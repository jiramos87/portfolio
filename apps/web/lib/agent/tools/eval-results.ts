/**
 * eval_results tool: the agent reports its own published evaluation accuracy.
 * The self-referential exhibit trick ("how accurate are you?").
 *
 * Reads the committed docs/evals/results.json (statically imported so it
 * bundles). Until the golden-set run (B09) overwrites it, it is an honest
 * "not-yet-run" stub the tool relays truthfully; it never invents a number.
 */
import rawResults from '../../../../../docs/evals/results.json';

const results = rawResults as Record<string, unknown>;

export type EvalResult =
  | { available: false; message: string }
  | { available: true; results: Record<string, unknown> };

/** Cheap keyword check: does this question ask about the agent's accuracy/eval? */
export function wantsEvalResults(question: string): boolean {
  return /accura|eval|reliab|how good|well[- ]tested|score|precis|confiab|qué tan bueno/i.test(
    question,
  );
}

export async function runEvalResults(): Promise<EvalResult> {
  if (results.status === 'not-yet-run') {
    return {
      available: false,
      message:
        'The evaluation has not been run yet, so there is no accuracy score to report. A published eval table ships with v1 of the agent.',
    };
  }
  // Return a compact summary (overall + per-type + methodology), never the full
  // perItem array: the model only needs the headline numbers, and the whole file
  // would bloat every LIVE DATA block.
  const summary: Record<string, unknown> = {
    overall: results.overall,
    perType: results.perType,
    date: results.date,
    agentModel: results.agentModel,
    judgeModel: results.judgeModel,
  };
  return { available: true, results: summary };
}
