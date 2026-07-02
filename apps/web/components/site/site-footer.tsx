import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons";
import { CONTACT_EMAIL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="cta-gradient flex size-7 items-center justify-center rounded-md font-mono text-xs font-bold"
          >
            JR
          </span>
          <div>
            <p className="font-semibold leading-tight">Javier Ramos</p>
            <p className="font-mono text-xs text-muted-foreground">
              full-stack &middot; agentic workflows
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Santiago, Chile (GMT-4) &middot; remote &middot; EN / ES
            </p>
          </div>
        </div>

        <p className="order-last text-center text-xs text-muted-foreground sm:order-none">
          &copy; 2026 Javier Ramos &middot; built with agentic workflows
        </p>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={`Email ${CONTACT_EMAIL}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-5" />
          </a>
          <a
            href="https://github.com/jiramos87"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-5" />
          </a>
          <a
            href="https://linkedin.com/in/javier-ramos-humeres"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
