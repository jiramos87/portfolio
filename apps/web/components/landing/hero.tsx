import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/site/eyebrow";
import { TerminalPanel } from "@/components/landing/terminal-panel";
import { CV_PATH } from "@/lib/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <Eyebrow>SPEC → IMPLEMENT → VERIFY → SHIP</Eyebrow>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            From Spec to production.
            <br className="hidden sm:block" /> Built with agentic workflows.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            I&apos;m Javier Ramos, a backend-leaning full-stack engineer with 4+
            years shipping production systems. Everything here is real: deployed
            products, live GitHub activity, and the agent-driven process that built
            each one, from spec to green CI.
          </p>

          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            SANTIAGO, CHILE (GMT-4) · REMOTE · EN / ES
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className={buttonVariants({ size: "lg", className: "cta-gradient" })}
            >
              View the work
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/methodology"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              See the method
            </Link>
          </div>

          <Link
            href={CV_PATH}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            In a hurry? Read the CV
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <TerminalPanel />
      </div>
    </section>
  );
}
