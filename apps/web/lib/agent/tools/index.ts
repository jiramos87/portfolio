/**
 * The Portfolio Agent's live tools (B05), run deterministically by the graph's
 * agent node. Each tool has a cheap keyword gate + a runner. Results are
 * formatted into a LIVE DATA block the answer node grounds on; failures are
 * voiced honestly, never faked.
 */
import { runGithubActivity, wantsGithubActivity } from './github';
import { runEvalResults, wantsEvalResults } from './eval-results';

/** Run the tools this question warrants and format their results for the prompt. */
export async function gatherToolContext(question: string): Promise<string> {
  const blocks: string[] = [];

  if (wantsGithubActivity(question)) {
    const result = await runGithubActivity();
    if (result.ok) {
      const lines = result.commits
        .map((c) => `- [${c.repo}] ${c.message} (${c.date.slice(0, 10)})`)
        .join('\n');
      blocks.push(`Recent GitHub commits (live):\n${lines}`);
    } else {
      blocks.push(
        `GitHub activity: ${result.error}. Tell the visitor the live GitHub lookup failed right now; do NOT invent commits or dates.`,
      );
    }
  }

  if (wantsEvalResults(question)) {
    const result = await runEvalResults();
    blocks.push(
      result.available
        ? `Evaluation results (live): ${JSON.stringify(result.results)}`
        : `Evaluation results: ${result.message}`,
    );
  }

  return blocks.join('\n\n');
}
