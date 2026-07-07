/**
 * Guardrail caps for the Portfolio Agent (B06): per-IP rate limits, a global
 * daily kill-switch, and the shared cap constants (input length, turn count,
 * output tokens). This is a spike backstop ABOVE B05A's $5/month OpenRouter
 * billing cap: it keeps one hot day from draining a month's credits, it does
 * not replace the billing-layer cap. Runs BEFORE any model/embedding call.
 *
 * Fails CLOSED: if Upstash Redis is unreachable or unconfigured, every request
 * is treated as unavailable. Protecting the monthly budget beats availability
 * here (an outage is honest; a silent overspend is not).
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const CAPS = {
  /** Enforced in the route already (B03); restated here as the single source. */
  INPUT_CHARS: 1000,
  MAX_TURNS: 12,
  MAX_OUTPUT_TOKENS: 800,
  PER_IP_WINDOW_MAX: 10,
  PER_IP_WINDOW: '10 m',
  PER_IP_DAY_MAX: 30,
  GLOBAL_DAILY_MAX: 200,
} as const;

function redisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

let shortLimiter: Ratelimit | null = null;
function getShortLimiter(): Ratelimit {
  if (!shortLimiter) {
    shortLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(CAPS.PER_IP_WINDOW_MAX, CAPS.PER_IP_WINDOW),
      prefix: 'agent:rl:short',
    });
  }
  return shortLimiter;
}

let dayLimiter: Ratelimit | null = null;
function getDayLimiter(): Ratelimit {
  if (!dayLimiter) {
    dayLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(CAPS.PER_IP_DAY_MAX, '1 d'),
      prefix: 'agent:rl:day',
    });
  }
  return dayLimiter;
}

/** UTC calendar day key; a fixed 48h TTL comfortably outlives one UTC day. */
function todayKey(): string {
  return `agent:daily:${new Date().toISOString().slice(0, 10)}`;
}

async function incrGlobalDaily(): Promise<number> {
  const key = todayKey();
  const count = await getRedis().incr(key);
  if (count === 1) {
    await getRedis().expire(key, 48 * 60 * 60);
  }
  return count;
}

export type LimitVerdict =
  | { ok: true }
  | { ok: false; kind: 'rate-limited'; retryAfterSeconds: number }
  | { ok: false; kind: 'over-budget' }
  | { ok: false; kind: 'unavailable' };

/**
 * Check all per-IP and global caps for one request. Order: short window, then
 * daily-per-IP window, then the global kill-switch, short-circuiting on the
 * first miss so an already-throttled spammer does not also burn the shared
 * daily budget. Any Redis error (including misconfiguration) fails closed.
 */
export async function checkLimits(ip: string): Promise<LimitVerdict> {
  if (!redisConfigured()) {
    return { ok: false, kind: 'unavailable' };
  }
  try {
    const short = await getShortLimiter().limit(ip);
    if (!short.success) {
      return {
        ok: false,
        kind: 'rate-limited',
        retryAfterSeconds: Math.max(1, Math.ceil((short.reset - Date.now()) / 1000)),
      };
    }

    const day = await getDayLimiter().limit(ip);
    if (!day.success) {
      return {
        ok: false,
        kind: 'rate-limited',
        retryAfterSeconds: Math.max(1, Math.ceil((day.reset - Date.now()) / 1000)),
      };
    }

    const globalCount = await incrGlobalDaily();
    if (globalCount > CAPS.GLOBAL_DAILY_MAX) {
      return { ok: false, kind: 'over-budget' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[agent] limiter unreachable:', err);
    return { ok: false, kind: 'unavailable' };
  }
}
