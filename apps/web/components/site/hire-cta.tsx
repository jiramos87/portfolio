import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon } from "@/components/site/brand-icons";
import { CV_PATH } from "@/lib/site";

const KIT_REPO = "https://github.com/jiramos87/agentic-dev-kit";

/**
 * Closing conversion block. `exhibit` (default) ends a project detail page;
 * `methodology` ends the methodology page and points at the open-source kit.
 */
export function HireCta({
  variant = "exhibit",
}: {
  variant?: "exhibit" | "methodology";
}) {
  const isMethod = variant === "methodology";

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">
        {isMethod ? "This loop travels." : "Built the same way, every time."}
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {isMethod
          ? "The skills and MCP server are open source, and the same loop that built these exhibits can run inside your team's repos. If you're hiring an engineer who works this way, or you want help making agents productive on your codebase, get in touch."
          : "Every exhibit runs the same loop: spec, implement, verify, ship. If you want this kind of work on your team, full-time or freelance, let's talk."}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className={buttonVariants({ className: "cta-gradient" })}
        >
          Get in touch
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {isMethod ? (
          <a
            href={KIT_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            <GithubIcon className="size-4" />
            Browse the kit on GitHub
          </a>
        ) : (
          <Link href={CV_PATH} className={buttonVariants({ variant: "outline" })}>
            Read the CV
          </Link>
        )}
      </div>
    </section>
  );
}
