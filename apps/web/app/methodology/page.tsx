import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/eyebrow";
import { MethodLoop } from "@/components/landing/method-loop";
import { HireCta } from "@/components/site/hire-cta";

export const metadata: Metadata = {
  title: "Methodology | Javier Ramos",
  description:
    "The closed agentic loop behind every exhibit: PRD, grill, implement, verify, learn, with Claude Code skills and a custom MCP server.",
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
    title: "Spec + test driven",
    body: "The PRD is the spec, so every build runs against a written contract instead of guesswork. Tests are written from that spec and run in CI, gating each ship. Two ends of one loop: write it down, then prove it green.",
  },
  {
    title: "Claude Design → UI",
    body: "Visual work flows from a Claude Design handoff (tokens + components) into the live UI. A design-sync skill keeps the shadcn token contract and the implementation aligned on every visual change.",
  },
  {
    title: "MCP + skills",
    body: "A project MCP server exposes schema introspection, exhibit scaffolding, and deploy status. Skills (prd / prd-grill-me / implement / verify / design-sync / reconcile / learnings) drive the repeatable steps.",
  },
  {
    title: "Closed-loop verify",
    body: "Lint, typecheck, tests, Lighthouse, and CI form the gate. Nothing ships until the loop closes green, and the proof is the public GitHub history.",
  },
  {
    title: "Learn: the toolchain compounds",
    body: "After shipping, a learnings step reflects on how the session actually went: what worked, where the agent fought the tools, and what the human had to correct. Those lessons are written back to where the next agent will read them, the repo context and rules, the persistent memory, and the skills themselves, so each run starts from a better-prepared toolchain. The portfolio improves the kit that builds it.",
  },
] as const;

export default function MethodologyPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-4">
        <Eyebrow>METHODOLOGY</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          A repeatable, verifiable pipeline, driven by a Spec
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every exhibit runs the same closed loop. It is the discipline you already
          expect from a strong team, a written spec first, tests as the gate, honest
          scope changes, with agents doing the heavy lifting. Here is the shape of it,
          and the tooling that makes it repeatable.
        </p>
      </section>

      <MethodLoop withHeading={false} />

      <section className="mx-auto max-w-6xl px-6 pt-4">
        <div className="mx-auto flex aspect-video max-w-3xl items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            A 60 to 90 second screen capture of one real loop, PRD to green verify,
            is coming here. Until then, the timeline and commits on each exhibit are
            the receipts.
          </p>
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

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <HireCta variant="methodology" />
      </section>
    </main>
  );
}
