import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CV_PATH } from "@/lib/site";

/**
 * The two-path contact block (hire full-time / freelance project). Shared by the
 * landing contact section and the contact page so the offer reads the same way
 * in both places.
 */
export function ContactIntro() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Hiring full-time?</span>{" "}
          Senior full-stack, backend-leaning, remote-first. The CV has the facts;
          the exhibits have the proof.
        </p>
        <Link
          href={CV_PATH}
          className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read the CV
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">Have a project?</span>{" "}
        Freelance work here means scoped full-stack products, APIs, and
        agentic-workflow enablement for teams that want their engineers shipping
        with agents. Tell me what you need.
      </p>
    </div>
  );
}
