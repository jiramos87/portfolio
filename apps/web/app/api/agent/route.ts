import { after } from 'next/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai';
import { planAnswer } from '@/lib/agent/graph';
import {
  modelFor,
  resolveModelId,
  GROQ_MODEL,
  DEFAULT_MODEL_ID,
  type ProviderId,
} from '@/lib/agent/models';
import { unavailableText } from '@/lib/agent/guardrail';
import { checkLimits, CAPS } from '@/lib/agent/limits';
import {
  newTraceId,
  traceUrlFor,
  recordTrace,
  extractCostUsd,
} from '@/lib/agent/tracing';
import {
  INPUT_MAX_CHARS,
  type AgentMetadata,
  type ServedBy,
} from '@/lib/agent/prompt';

/**
 * Portfolio Agent chat route (B04 orchestration; B05A provider rework; B06 caps;
 * B08 Langfuse tracing).
 *
 * A LangGraph graph classifies + routes + retrieves, returning a plan; this
 * route streams the answer with the provider the graph found healthy: OpenRouter
 * on the visitor-selected model, or the Groq free tier (degraded, and `capped`
 * when OpenRouter's monthly budget is spent). Off-topic -> a one-sentence
 * decline. All providers down -> an honest unavailable message.
 *
 * Guard order: cheap local validation (JSON, message shape, turn cap, input
 * length) runs first; the Redis-backed per-IP + global caps run right before
 * any model/embedding call, per B06. These caps are a spike backstop above
 * B05A's $5/month OpenRouter billing cap, not a replacement for it.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export type AgentUIMessage = UIMessage<AgentMetadata>;

/** First IP in X-Forwarded-For, falling back to X-Real-IP, then 'unknown'. */
function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || 'unknown';
}

/** Concatenate the text parts of a UI message. */
function messageText(message: AgentUIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('\n')
    .trim();
}

/** Stream a fixed message (decline / unavailable) as a UI message. */
function streamFixed(text: string, metadata: AgentMetadata): Response {
  const stream = createUIMessageStream<AgentUIMessage>({
    execute: ({ writer }) => {
      writer.write({ type: 'start', messageMetadata: metadata });
      writer.write({ type: 'text-start', id: '0' });
      writer.write({ type: 'text-delta', id: '0', delta: text });
      writer.write({ type: 'text-end', id: '0' });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

/** The provider + model that will serve, given the plan and the visitor's pick. */
function servedByFor(provider: ProviderId, resolvedModelId: string): ServedBy {
  return provider === 'openrouter'
    ? { provider, model: resolvedModelId }
    : { provider, model: GROQ_MODEL };
}

export async function POST(req: Request): Promise<Response> {
  let body: { messages?: AgentUIMessage[]; modelId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: 'Send a non-empty messages array.' },
      { status: 400 },
    );
  }

  const userTurns = messages.filter((m) => m.role === 'user').length;
  if (userTurns > CAPS.MAX_TURNS) {
    return Response.json(
      {
        error: `This conversation has reached its ${CAPS.MAX_TURNS}-turn limit. Start a new chat, or email Javier directly.`,
      },
      { status: 400 },
    );
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const question = lastUser ? messageText(lastUser) : '';
  if (question.length === 0) {
    return Response.json(
      { error: 'The latest message has no text.' },
      { status: 400 },
    );
  }
  if (question.length > INPUT_MAX_CHARS) {
    return Response.json(
      {
        error: `Message too long. Keep it under ${INPUT_MAX_CHARS} characters so the agent stays fast and affordable.`,
      },
      { status: 400 },
    );
  }

  const limitVerdict = await checkLimits(clientIp(req));
  if (!limitVerdict.ok) {
    if (limitVerdict.kind === 'rate-limited') {
      return Response.json(
        {
          error: `You've sent a lot of messages. Try again in about ${limitVerdict.retryAfterSeconds} seconds.`,
          retryAfterSeconds: limitVerdict.retryAfterSeconds,
        },
        { status: 429, headers: { 'Retry-After': String(limitVerdict.retryAfterSeconds) } },
      );
    }
    if (limitVerdict.kind === 'over-budget') {
      return Response.json(
        {
          error:
            "The agent has reached its budget for today. Please browse the portfolio, or reach Javier through the contact page.",
        },
        { status: 429 },
      );
    }
    // Redis unreachable or unconfigured: fail closed rather than risk an
    // unbounded spend against the monthly billing cap.
    return Response.json({ error: unavailableText() }, { status: 503 });
  }

  const modelMessages = await convertToModelMessages(messages);
  // The visitor's model choice applies to OpenRouter answers only; anything not
  // on the allowlist silently becomes the default (no error, no honored pick).
  const resolvedModelId = resolveModelId(body.modelId);

  // B08: one public Langfuse trace per request. The id + URL are known up front
  // (the URL is just baseUrl/trace/{id}), so the link ships in the reply's start
  // metadata while spans + the generation are recorded after the stream ends.
  // sessionId is random (never the IP). traceUrl is null when tracing is off.
  const traceId = newTraceId();
  const sessionId = newTraceId();
  // Resolve the public trace URL in parallel with the graph (the projectId
  // lookup is cached after the first request); awaited before we emit metadata.
  const traceUrlPromise = traceUrlFor(traceId);

  let plan;
  try {
    plan = await planAnswer(question, modelMessages);
  } catch (err) {
    // No provider configured or every provider failed: honest error state.
    console.error('[agent] planAnswer failed:', err);
    const text = unavailableText();
    const traceUrl = await traceUrlPromise;
    after(() =>
      recordTrace({
        traceId,
        sessionId,
        question,
        route: 'answer',
        steps: [],
        requestedModelId: resolvedModelId,
        citationsCount: 0,
        finalText: text,
      }),
    );
    return streamFixed(text, {
      citations: [],
      degraded: true,
      capped: false,
      servedBy: { provider: 'openrouter', model: DEFAULT_MODEL_ID },
      traceUrl,
    });
  }

  const servedBy = servedByFor(plan.provider, resolvedModelId);
  const traceUrl = await traceUrlPromise;

  if (plan.route === 'decline') {
    after(() =>
      recordTrace({
        traceId,
        sessionId,
        question,
        route: 'decline',
        lang: plan.lang,
        steps: plan.steps,
        requestedModelId: resolvedModelId,
        citationsCount: 0,
        finalText: plan.declineMessage,
      }),
    );
    return streamFixed(plan.declineMessage, {
      citations: [],
      degraded: plan.degraded,
      capped: plan.capped,
      servedBy,
      traceUrl,
    });
  }

  // Capture generation timing + usage for the trace's generation span. onFinish
  // fires at stream end; after() runs once the response is fully sent, so the
  // captured values are ready by then.
  const genStartedAt = Date.now();
  let genFinished: {
    endedAt: number;
    usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
    text?: string;
    providerMetadata?: unknown;
  } | null = null;

  const result = streamText({
    model: modelFor(plan.provider, resolvedModelId),
    system: plan.systemPrompt,
    messages: modelMessages,
    maxOutputTokens: CAPS.MAX_OUTPUT_TOKENS,
    onFinish: ({ usage, text, providerMetadata }) => {
      genFinished = { endedAt: Date.now(), usage, text, providerMetadata };
    },
  });

  after(() =>
    recordTrace({
      traceId,
      sessionId,
      question,
      route: 'answer',
      lang: plan.lang,
      steps: plan.steps,
      requestedModelId: resolvedModelId,
      citationsCount: plan.citations.length,
      generation: {
        provider: plan.provider,
        servedModel: servedBy.model,
        requestedModelId: resolvedModelId,
        startedAt: genStartedAt,
        endedAt: genFinished?.endedAt ?? Date.now(),
        usage: genFinished?.usage,
        costUsd: extractCostUsd(genFinished?.providerMetadata),
        degraded: plan.degraded,
        capped: plan.capped,
        outputPreview: (genFinished?.text ?? '').slice(0, 4000),
      },
    }),
  );

  return result.toUIMessageStreamResponse<AgentUIMessage>({
    messageMetadata: ({ part }) =>
      part.type === 'start'
        ? {
            citations: plan.citations,
            degraded: plan.degraded,
            capped: plan.capped,
            servedBy,
            traceUrl,
          }
        : undefined,
  });
}
