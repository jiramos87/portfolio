import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/site/eyebrow";
import { TerminalPanel } from "@/components/landing/terminal-panel";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <Eyebrow>PRD → IMPLEMENT → VERIFY → SHIP</Eyebrow>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            From PRD to production.
            <br className="hidden sm:block" /> Built with agentic workflows.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            I&apos;m Javier, a backend-leaning full-stack engineer. Each exhibit is
            real, deployed, and backed by GitHub activity, with the agent-driven
            process shown in full.
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
        </div>

        <TerminalPanel />
      </div>
    </section>
  );
}
