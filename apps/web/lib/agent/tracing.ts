/**
 * Langfuse tracing for the Portfolio Agent (B08). One PUBLIC trace per request,
 * with a span per graph node (guardrail, retrieval, tools) and a generation
 * observation for the streamed answer. The public trace URL is returned in reply
 * metadata so the chat can render a "see how I answered" link that opens without
 * a login.
 *
 * Fail-OPEN (the opposite of the B06 limiter): if Langfuse is unconfigured or
 * errors, the reply must still stream and the link is simply omitted. Every
 * Langfuse call is wrapped so a tracing failure never touches the answer. Traces
 * are the only transcript store; we never record the visitor IP (the sessionId
 * is a random per-request id).
 */
import { randomUUID } from 'node:crypto';
import { Langfuse } from 'langfuse';
import type { TraceStep } from './graph';
import type { ProviderId } from './model-catalog';

function baseUrl(): string {
  return (process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com').replace(/\/+$/, '');
}

/**
 * Configured only when both keys carry Langfuse's documented `pk-lf-` / `sk-lf-`
 * prefixes. The prefix check is deliberate: an obviously-bogus or absent key (the
 * B08 "bogus keys" acceptance) reads as "not configured", so no broken trace link
 * is ever emitted, and we avoid an extra auth round-trip on the hot path.
 */
export function tracingConfigured(): boolean {
  const pk = process.env.LANGFUSE_PUBLIC_KEY ?? '';
  const sk = process.env.LANGFUSE_SECRET_KEY ?? '';
  return pk.startsWith('pk-lf-') && sk.startsWith('sk-lf-');
}

/** A fresh trace id the route can turn into a URL up front, before spans exist. */
export function newTraceId(): string {
  return randomUUID();
}

// The project id is part of the public trace URL. The SDK's short `/trace/{id}`
// link needs a session to resolve the project (it 500s anonymously), so we build
// the canonical `/project/{projectId}/traces/{id}` URL, which renders without a
// login when the trace is public. The id is derived once from the key and cached;
// a successful lookup also proves the keys work, so a well-formed-but-wrong key
// yields no link (rather than a dead one).
let projectIdCache: string | undefined;
let projectIdPromise: Promise<string | null> | null = null;

async function resolveProjectId(): Promise<string | null> {
  if (projectIdCache) return projectIdCache;
  if (!projectIdPromise) {
    projectIdPromise = (async () => {
      const auth = Buffer.from(
        `${process.env.LANGFUSE_PUBLIC_KEY}:${process.env.LANGFUSE_SECRET_KEY}`,
      ).toString('base64');
      const res = await fetch(`${baseUrl()}/api/public/projects`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { data?: Array<{ id?: string }> };
      return body.data?.[0]?.id ?? null;
    })()
      .catch(() => null)
      .then((id) => {
        // Cache only success; leave a failure retryable (transient blip / key fix).
        if (id) projectIdCache = id;
        projectIdPromise = null;
        return id;
      });
  }
  return projectIdPromise;
}

/**
 * The public trace URL, or null when tracing is off or the keys do not resolve a
 * project (so the "see how I answered" link never points at a dead or private
 * trace). Async because the project id is fetched once and cached.
 */
export async function traceUrlFor(traceId: string): Promise<string | null> {
  if (!tracingConfigured()) return null;
  const projectId = await resolveProjectId();
  if (!projectId) return null;
  return `${baseUrl()}/project/${projectId}/traces/${traceId}`;
}

let client: Langfuse | null = null;
function getClient(): Langfuse | null {
  if (!tracingConfigured()) return null;
  if (!client) {
    client = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: baseUrl(),
      // Low volume + we flush explicitly in the route's after() hook.
      flushAt: 1,
    });
  }
  return client;
}

export interface GenerationRecord {
  provider: ProviderId;
  /** The model that actually served (OpenRouter slug or the Groq fallback). */
  servedModel: string;
  /** What the visitor asked for (may differ from servedModel when degraded/capped). */
  requestedModelId: string;
  startedAt: number;
  endedAt: number;
  usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
  /** Per-call cost OpenRouter reports, when the provider surfaces it. */
  costUsd?: number | null;
  degraded: boolean;
  capped: boolean;
  outputPreview?: string;
}

export interface TraceRecord {
  traceId: string;
  sessionId: string;
  question: string;
  route: 'answer' | 'decline';
  lang?: 'en' | 'es';
  steps: TraceStep[];
  requestedModelId: string;
  citationsCount: number;
  /** Absent for pure declines and hard-failure paths. */
  generation?: GenerationRecord;
  /** Decline / unavailable text, used as the trace output when there is no generation. */
  finalText?: string;
}

/** Pull a numeric per-call cost out of provider metadata if the provider reported one. */
export function extractCostUsd(providerMetadata: unknown): number | null {
  const pm = providerMetadata as Record<string, Record<string, unknown>> | undefined;
  if (!pm) return null;
  for (const key of ['openrouter', 'openai-compatible', 'openai']) {
    const bucket = pm[key];
    if (!bucket) continue;
    const direct = bucket.cost;
    if (typeof direct === 'number') return direct;
    const usage = bucket.usage as Record<string, unknown> | undefined;
    if (usage && typeof usage.cost === 'number') return usage.cost;
  }
  return null;
}

/**
 * Build and flush the trace for one request. Never throws: a tracing failure is
 * logged and swallowed so the reply is unaffected. No-ops when tracing is off.
 */
export async function recordTrace(rec: TraceRecord): Promise<void> {
  const lf = getClient();
  if (!lf) return;
  try {
    const trace = lf.trace({
      id: rec.traceId,
      name: 'portfolio-agent',
      sessionId: rec.sessionId,
      public: true,
      input: rec.question,
      output: rec.generation?.outputPreview ?? rec.finalText ?? undefined,
      metadata: {
        route: rec.route,
        lang: rec.lang,
        requestedModelId: rec.requestedModelId,
        citations: rec.citationsCount,
      },
      tags: ['portfolio-agent', rec.route],
    });

    for (const step of rec.steps) {
      trace.span({
        name: step.name,
        startTime: new Date(step.startedAt),
        endTime: new Date(step.endedAt),
        input: step.input,
        output: step.output,
        metadata: step.metadata,
        level: step.level,
        statusMessage: step.statusMessage,
      });
    }

    const g = rec.generation;
    if (g) {
      const usage =
        g.usage &&
        (g.usage.inputTokens != null ||
          g.usage.outputTokens != null ||
          g.usage.totalTokens != null)
          ? {
              promptTokens: g.usage.inputTokens,
              completionTokens: g.usage.outputTokens,
              totalTokens: g.usage.totalTokens,
            }
          : undefined;
      trace.generation({
        name: 'answer',
        model: g.servedModel,
        startTime: new Date(g.startedAt),
        endTime: new Date(g.endedAt),
        usage,
        output: g.outputPreview,
        metadata: {
          provider: g.provider,
          requestedModelId: g.requestedModelId,
          degraded: g.degraded,
          capped: g.capped,
          ...(g.costUsd != null ? { costUsd: g.costUsd } : {}),
        },
        ...(g.costUsd != null ? { costDetails: { total: g.costUsd } } : {}),
      });
    }

    await lf.flushAsync();
  } catch (err) {
    console.error('[agent] tracing failed (reply unaffected):', err);
  }
}
