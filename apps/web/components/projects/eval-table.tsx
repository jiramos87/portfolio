/**
 * The Portfolio Agent's published evaluation, read from the single committed
 * source of truth (docs/evals/results.json, statically imported so it bundles at
 * build). Every number on the page comes from this file, so the exhibit can
 * never drift from what the eval actually measured. The same JSON backs the
 * agent's own "how accurate are you?" answer (lib/agent/tools/eval-results.ts).
 */
import results from "../../../../docs/evals/results.json";

const ROWS = [
  { key: "fact", label: "Facts" },
  { key: "tool", label: "Live tools" },
  { key: "guardrail", label: "Guardrails" },
  { key: "es", label: "Spanish" },
] as const;

export function EvalTable() {
  const { overall, perType, agentModel, judgeModel, date } = results;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <p className="text-sm font-medium text-foreground">
          {overall.pct}% on a {overall.total}-question golden set
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Facts, live tools, guardrail probes, and Spanish, run against{" "}
          <span className="font-mono">{agentModel}</span> and graded by a
          cross-family judge (<span className="font-mono">{judgeModel}</span>,
          free tier). Measured {date}. Not a self-graded number: the judge is a
          different model family, and its disagreements were reviewed by hand.
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-5 py-2 font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Category
            </th>
            <th className="px-5 py-2 text-right font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Passed
            </th>
            <th className="px-5 py-2 text-right font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const cell = perType[row.key];
            return (
              <tr key={row.key} className="border-b border-border/60">
                <td className="px-5 py-2.5 text-foreground">{row.label}</td>
                <td className="px-5 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                  {cell.pass}/{cell.total}
                </td>
                <td className="px-5 py-2.5 text-right font-mono font-semibold tabular-nums text-foreground">
                  {cell.pct}%
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="px-5 py-2.5 font-medium text-foreground">Overall</td>
            <td className="px-5 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
              {overall.pass}/{overall.total}
            </td>
            <td className="px-5 py-2.5 text-right font-mono font-semibold tabular-nums text-primary">
              {overall.pct}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
