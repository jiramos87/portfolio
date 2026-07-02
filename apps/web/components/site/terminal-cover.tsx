import { cn } from "@/lib/utils";

/**
 * Faux build-log cover for exhibits with no UI to screenshot. The container
 * border and radius come from the caller so it works as a card cover (border-b)
 * or a standalone preview (rounded border).
 */
export function TerminalCover({ className }: { className?: string }) {
  return (
    <div className={cn("aspect-[16/10] w-full overflow-hidden bg-card", className)}>
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
        <span className="size-2 rounded-full bg-destructive/70" />
        <span className="size-2 rounded-full bg-warning/70" />
        <span className="size-2 rounded-full bg-success/70" />
      </div>
      <pre className="px-3 py-2.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
        <span className="text-foreground">$ agent run --kit</span>
        {"\n"}
        <span className="text-success">✓</span> skills · prd · implement · verify
        {"\n"}
        <span className="text-primary">→</span> mcp · schema · scaffold · deploy
        {"\n"}
        <span className="text-success">✓</span> ready
      </pre>
    </div>
  );
}
