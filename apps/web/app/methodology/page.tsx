import type { Metadata } from "next";
import { PlayCircle } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { MethodLoop } from "@/components/landing/method-loop";

export const metadata: Metadata = {
  title: "Methodology | Javier Ramos",
  description:
    "The closed agentic loop behind every exhibit: PRD, grill, implement, verify, reconcile, with Claude Code skills and a custom MCP server.",
};

const SECTIONS = [
  {
    title: "The kit",
    body: "An open-source agentic-dev-kit: Claude Code skills, a custom MCP server, and PRD templates, dropped into each repo. The portfolio is built by dogfooding it end to end.",
  },
  {
    title: "The PRD loop",
    body: "Every feature starts as a behavioral PRD: scope, tasks, and acceptance criteria. A grill step then pressure-tests it with relentless polling rounds until the design, behavior, and dependencies are locked. The agent implements against it, and a failing check loops straight back to implement.",
  },
  {
    title: "Claude Design → UI",
    body: "Visual work flows from a Claude Design handoff (tokens + components) into the live UI. A design-sync skill keeps the shadcn token contract and the implementation aligned on every visual change.",
  },
  {
    title: "MCP + skills",
    body: "A project MCP server exposes schema introspection, exhibit scaffolding, and deploy status. Skills (prd / prd-grill-me / implement / verify / design-sync / reconcile) drive the repeatable steps.",
  },
  {
    title: "Closed-loop verify",
    body: "Lint, typecheck, tests, Lighthouse, and CI form the gate. Nothing ships until the loop closes green, and the proof is the public GitHub history.",
  },
  {
    title: "Reconcile (living PRD)",
    body: "A PRD is a living doc, not a contract written once. After shipping, a reconcile step diffs the spec against what actually shipped, logs the deltas, and updates the doc, so the PRD stays honest instead of drifting.",
  },
] as const;

export default function MethodologyPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-4">
        <Eyebrow>METHODOLOGY</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          A repeatable, verifiable pipeline, driven by a PRD
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every exhibit runs the same closed loop. Here&apos;s the shape of it, and the
          tooling that makes it repeatable.
        </p>
      </section>

      <MethodLoop withHeading={false} />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-card">
          <div className="flex aspect-video flex-col items-center justify-center gap-3 text-center">
            <PlayCircle className="size-10 text-muted-foreground" aria-hidden />
            <p className="font-mono text-sm text-muted-foreground">
              60–90s demo, coming soon
            </p>
            <p className="max-w-md text-xs text-muted-foreground">
              A short walkthrough of the loop in action: PRD → implement → verify →
              reconcile.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-base font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
