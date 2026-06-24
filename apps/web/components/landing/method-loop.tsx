import { ArrowRight, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/site/eyebrow";

const STEPS = [
  {
    num: "01",
    title: "Explore",
    body: "Scan the repo, read context, frame the problem with the agent.",
  },
  {
    num: "02",
    title: "PRD",
    body: "Write a PRD: scope, tasks, and acceptance criteria.",
  },
  {
    num: "03",
    title: "Grill",
    body: "Pressure-test the PRD: polling rounds lock design, behavior, and dependencies.",
  },
  {
    num: "04",
    title: "Implement",
    body: "The agent writes code and tests against the PRD.",
  },
  {
    num: "05",
    title: "Verify",
    body: "Lint, typecheck, Lighthouse, CI, then loop back.",
  },
  {
    num: "06",
    title: "Reconcile",
    body: "Diff the PRD against what shipped; log the deltas, update the spec.",
  },
] as const;

/** The 01–05 + iterate agentic loop. Used on landing and methodology. */
export function MethodLoop({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {withHeading ? (
        <div className="max-w-2xl">
          <Eyebrow>THE METHOD</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            A closed agentic loop, on every exhibit
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each product is built with a repeatable, verifiable pipeline, driven by
            a PRD and Claude Code skills, closed by automated checks.
          </p>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STEPS.map((step, i) => (
          <div key={step.num} className="relative">
            <Card className="h-full gap-2 p-5">
              <span className="font-mono text-sm font-semibold text-primary">
                {step.num}
              </span>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </Card>
            {i < STEPS.length - 1 ? (
              <ArrowRight
                aria-hidden
                className="absolute top-1/2 -right-3 hidden size-4 -translate-y-1/2 text-muted-foreground xl:block"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
        <RotateCcw className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">
          <span className="font-mono font-semibold uppercase tracking-wide text-primary">
            iterate
          </span>{" "}
          When verify fails, loop back to implement. Reconcile keeps the PRD honest
          against what shipped, and Claude Design ⇄ UI runs on every visual change.
        </p>
      </div>
    </section>
  );
}
