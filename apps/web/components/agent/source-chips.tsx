import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Citation } from "@/lib/agent/prompt";
import { cn } from "@/lib/utils";

const CHIP =
  "inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors";
const LINKY = "hover:border-primary/50 hover:text-foreground";

function label(c: Citation): string {
  return c.section ? `${c.title} · ${c.section}` : c.title;
}

/** Render the reply's sources as chips: internal links use next/link, external open in a new tab, sourceless chips are static. */
export function SourceChips({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {citations.map((c, i) => {
        const text = label(c);
        if (!c.url) {
          return (
            <span key={`${c.title}-${i}`} className={CHIP}>
              <FileText aria-hidden className="size-3 shrink-0" />
              <span className="truncate">{text}</span>
            </span>
          );
        }
        const external = /^https?:\/\//.test(c.url);
        const content = (
          <>
            <FileText aria-hidden className="size-3 shrink-0" />
            <span className="truncate">{text}</span>
            {external ? <ArrowUpRight aria-hidden className="size-3 shrink-0" /> : null}
          </>
        );
        return external ? (
          <a
            key={`${c.title}-${i}`}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(CHIP, LINKY)}
          >
            {content}
          </a>
        ) : (
          <Link key={`${c.title}-${i}`} href={c.url} className={cn(CHIP, LINKY)}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
