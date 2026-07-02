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

// A representative Claude Code session: slash-command steps with their results.
// The PRD is the spec; tests are written first (red), implement turns them green,
// /verify gates the ship, and /learnings feeds the lessons back into the toolchain.
const LINES: Line[] = [
  { command: true, text: "/prd portfolio-exploration.md" },
  { glyph: "ok", step: "plan", text: "PRD → 9 tasks · acceptance set" },
  { glyph: "verify", step: "tests", text: "7 specs written first · red" },
  { command: true, text: "/implement portfolio-prd.md" },
  { glyph: "iterate", step: "iterate", text: "Claude Code → diff applied" },
  { command: true, text: "/verify → 7/7 tests passed" },
  { glyph: "ok", step: "lighthouse", text: "96-100 · live site" },
  { glyph: "ok", step: "ship", text: "deployed · main@a1f9c2" },
  { command: true, text: "/learnings → 1 skill improved, 2 repo rules modified, and 1 memory entry added" },
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
          example claude code agentic workflow
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
        <code>
          {LINES.map((line, i) => (
            <div
              key={i}
              className="flex gap-2 whitespace-pre-wrap animate-fade-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
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
