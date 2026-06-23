import { cn } from "@/lib/utils";

type Glyph = "ok" | "run" | "verify" | "iterate";

interface Line {
  glyph?: Glyph;
  /** the bold step label, e.g. "explore" */
  step?: string;
  /** the trailing detail text */
  text: string;
  /** a command line ($ ...) rendered without a glyph */
  command?: boolean;
}

const GLYPHS: Record<Glyph, { char: string; className: string }> = {
  ok: { char: "✓", className: "text-success" }, // ✓
  run: { char: "→", className: "text-primary" }, // →
  verify: { char: "◐", className: "text-warning" }, // ◐
  iterate: { char: "↻", className: "text-chart-4" }, // ↻
};

// Verify step (Lighthouse + CI) omitted until M6–M8: no fabricated scores in the hero log.
const LINES: Line[] = [
  { command: true, text: "$ agent run --prd portfolio.prd.md" },
  { glyph: "ok", step: "explore", text: "repo scanned · 142 files · context built" },
  { glyph: "ok", step: "plan", text: "PRD → 9 tasks · acceptance set" },
  { glyph: "run", step: "implement", text: "apps/web/landing.tsx · +312 −44" },
  { glyph: "iterate", step: "iterate", text: "Claude Design → UI · diff applied" },
  { glyph: "ok", step: "ship", text: "deployed · main@a1f9c2" },
];

export function TerminalPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-destructive/70" />
          <span className="size-3 rounded-full bg-warning/70" />
          <span className="size-3 rounded-full bg-success/70" />
        </span>
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          agent · build-feature.sh
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
        <code>
          {LINES.map((line, i) => (
            <div key={i} className="flex gap-2 whitespace-pre-wrap">
              {line.command ? (
                <span className="text-foreground">{line.text}</span>
              ) : (
                <>
                  {line.glyph ? (
                    <span aria-hidden className={GLYPHS[line.glyph].className}>
                      {GLYPHS[line.glyph].char}
                    </span>
                  ) : null}
                  <span>
                    <span className="font-semibold text-foreground">{line.step}</span>{" "}
                    <span className="text-muted-foreground">{line.text}</span>
                  </span>
                </>
              )}
            </div>
          ))}
          <div className="mt-1 flex">
            <span className="inline-block h-4 w-2 animate-pulse bg-primary" aria-hidden />
          </div>
        </code>
      </pre>
    </div>
  );
}
