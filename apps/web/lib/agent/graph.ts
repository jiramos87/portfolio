/**
 * Portfolio Agent orchestration graph (B04, LangGraph.js).
 *
 * Nodes (names are exhibit material, B10 diagrams them):
 *   guardrail -> classify topic + language, pick the healthy provider.
 *   retrieve  -> cosine top-K over the corpus (on-topic only).
 *   agent     -> tool-calling slot (empty in B04; B05 fills it).
 *   answer    -> compose the grounded system prompt (or leave the decline).
 *
 * The graph runs the non-streamed decision path to completion and returns a
 * plan; the route does the actual token streaming with the chosen provider.
 * A conditional edge after `guardrail` short-circuits off-topic to `answer`.
 */
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import type { ModelMessage } from 'ai';
import { retrieve, type RetrievedChunk } from './retrieval';
import { buildSystemPrompt, toCitations, type Citation } from './prompt';
import { classify, type ProviderId } from './models';
import { declineText } from './guardrail';
import { gatherToolContext } from './tools';

/**
 * A recorded graph-node step. Plain data only (no Langfuse import): tracing.ts
 * (B08) turns each step into a span. Keeping this out of the graph means the
 * orchestration stays pure and testable, and tracing can be swapped or removed
 * without touching the nodes.
 */
export interface TraceStep {
  name: 'guardrail' | 'retrieve' | 'agent';
  /** epoch ms */
  startedAt: number;
  endedAt: number;
  input?: unknown;
  output?: unknown;
  metadata?: Record<string, unknown>;
  level?: 'DEFAULT' | 'WARNING';
  statusMessage?: string;
}

const AgentState = Annotation.Root({
  question: Annotation<string>(),
  modelMessages: Annotation<ModelMessage[]>(),
  route: Annotation<'answer' | 'decline'>({
    reducer: (_, next) => next,
    default: () => 'answer',
  }),
  lang: Annotation<'en' | 'es'>({
    reducer: (_, next) => next,
    default: () => 'en',
  }),
  provider: Annotation<ProviderId>({
    reducer: (_, next) => next,
    default: () => 'openrouter',
  }),
  degraded: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),
  capped: Annotation<boolean>({
    reducer: (_, next) => next,
    default: () => false,
  }),
  chunks: Annotation<RetrievedChunk[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  citations: Annotation<Citation[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  toolContext: Annotation<string>({
    reducer: (_, next) => next,
    default: () => '',
  }),
  systemPrompt: Annotation<string>({
    reducer: (_, next) => next,
    default: () => '',
  }),
  declineMessage: Annotation<string>({
    reducer: (_, next) => next,
    default: () => '',
  }),
  steps: Annotation<TraceStep[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
});

type State = typeof AgentState.State;

async function guardrailNode(state: State): Promise<Partial<State>> {
  const startedAt = Date.now();
  const result = await classify(state.question);
  const step: TraceStep = {
    name: 'guardrail',
    startedAt,
    endedAt: Date.now(),
    output: {
      onTopic: result.onTopic,
      lang: result.lang,
      provider: result.provider,
      degraded: result.degraded,
      capped: result.capped,
    },
  };
  if (!result.onTopic) {
    return {
      route: 'decline',
      lang: result.lang,
      provider: result.provider,
      degraded: result.degraded,
      capped: result.capped,
      declineMessage: declineText(result.lang),
      citations: [],
      steps: [step],
    };
  }
  return {
    route: 'answer',
    lang: result.lang,
    provider: result.provider,
    degraded: result.degraded,
    capped: result.capped,
    steps: [step],
  };
}

async function retrieveNode(state: State): Promise<Partial<State>> {
  const startedAt = Date.now();
  try {
    const chunks = await retrieve(state.question);
    const step: TraceStep = {
      name: 'retrieve',
      startedAt,
      endedAt: Date.now(),
      input: { query: state.question },
      output: {
        chunks: chunks.map((c) => ({
          id: c.id,
          title: c.title,
          section: c.section,
          score: Number(c.score),
        })),
      },
      metadata: { count: chunks.length },
    };
    return { chunks, citations: toCitations(chunks), steps: [step] };
  } catch {
    // Embeddings are Gemini-only; if they fail (e.g. Gemini down and we are on
    // the Groq fallback), degrade gracefully: answer without retrieval, no
    // citations, and flag degraded so the reply is honest about being limited.
    const step: TraceStep = {
      name: 'retrieve',
      startedAt,
      endedAt: Date.now(),
      input: { query: state.question },
      output: { chunks: [] },
      level: 'WARNING',
      statusMessage: 'retrieval unavailable; answering without corpus context',
    };
    return { chunks: [], citations: [], degraded: true, steps: [step] };
  }
}

// Run the live tools (github_activity, eval_results) this question warrants and
// fold their results into context. Deterministic execution (not a model
// tool-loop) is more reliable across providers and far cheaper on free-tier
// quotas; failures come back as honest caveats, never faked.
async function agentNode(state: State): Promise<Partial<State>> {
  const startedAt = Date.now();
  const toolContext = await gatherToolContext(state.question);
  const step: TraceStep = {
    name: 'agent',
    startedAt,
    endedAt: Date.now(),
    output: toolContext || '(no live tools invoked)',
    metadata: { invokedTools: toolContext.length > 0 },
  };
  return { toolContext, steps: [step] };
}

async function answerNode(state: State): Promise<Partial<State>> {
  if (state.route === 'decline') return {};
  return { systemPrompt: buildSystemPrompt(state.chunks, state.toolContext) };
}

const compiled = new StateGraph(AgentState)
  .addNode('guardrail', guardrailNode)
  .addNode('retrieve', retrieveNode)
  .addNode('agent', agentNode)
  .addNode('answer', answerNode)
  .addEdge(START, 'guardrail')
  .addConditionalEdges(
    'guardrail',
    (state: State) => (state.route === 'decline' ? 'answer' : 'retrieve'),
    { retrieve: 'retrieve', answer: 'answer' },
  )
  .addEdge('retrieve', 'agent')
  .addEdge('agent', 'answer')
  .addEdge('answer', END)
  .compile();

export interface AgentPlan {
  route: 'answer' | 'decline';
  provider: ProviderId;
  degraded: boolean;
  capped: boolean;
  lang: 'en' | 'es';
  citations: Citation[];
  systemPrompt: string;
  declineMessage: string;
  /** Per-node timing + data, for the B08 Langfuse trace (never sent to the client). */
  steps: TraceStep[];
}

/** Run the decision graph and return a plan the route streams from. */
export async function planAnswer(
  question: string,
  modelMessages: ModelMessage[],
): Promise<AgentPlan> {
  const final = await compiled.invoke({ question, modelMessages });
  return {
    route: final.route,
    provider: final.provider,
    degraded: final.degraded,
    capped: final.capped,
    lang: final.lang,
    citations: final.citations,
    systemPrompt: final.systemPrompt,
    declineMessage: final.declineMessage,
    steps: final.steps,
  };
}
