import { cn } from "@/lib/utils";

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const WEEKS = 53;
const DAYS = 7;

/**
 * Contribution heatmap. The snapshot calendar is `isPlaceholder` (empty), so we
 * render an explicit muted empty grid — never fabricated cells.
 */
export function ContributionHeatmap({ pending }: { pending: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Contribution heatmap</h3>
        {pending ? (
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            live calendar pending
          </span>
        ) : null}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div
          className={cn("mt-2 grid grid-flow-col gap-[3px]", pending && "opacity-40")}
          style={{ gridTemplateRows: `repeat(${DAYS}, 1fr)` }}
          aria-hidden
        >
          {Array.from({ length: WEEKS * DAYS }).map((_, i) => (
            <span
              key={i}
              className="size-[9px] rounded-[2px] border border-border/60 bg-muted"
            />
          ))}
        </div>

        {pending ? (
          <p className="mt-3 text-xs text-muted-foreground">
            No fabricated cells. The grid fills once the nightly GitHub pull lands.
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted-foreground">
        <span>Less</span>
        <span className="size-[9px] rounded-[2px] bg-muted" />
        <span className="size-[9px] rounded-[2px] bg-primary/30" />
        <span className="size-[9px] rounded-[2px] bg-primary/60" />
        <span className="size-[9px] rounded-[2px] bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
}
