import { cn } from "@/lib/utils";
import type { Stack } from "@/lib/honesty";

/**
 * Primary stacks: a curated, ordered list of the languages & frameworks Javier
 * builds in. Honest "what I work in", NOT a byte breakdown: raw GitHub bytes are
 * dominated by generated/vendored/game files that hide the real TypeScript.
 * Rendered as mono chips, with the primary (first) stack carrying the cyan accent.
 */
export function LanguageBar({ stacks }: { stacks: Stack[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-medium">Primary stacks</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        the languages &amp; frameworks I build in
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {stacks.map((stack, i) => (
          <li key={stack.name}>
            <span
              className={cn(
                "inline-flex items-center rounded-sm border px-2 py-1 font-mono text-xs",
                i === 0
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border bg-muted text-foreground",
              )}
            >
              {stack.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
