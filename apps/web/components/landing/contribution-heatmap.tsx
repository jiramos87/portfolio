import { cn } from "@/lib/utils";
import type { CalendarWeek } from "@/lib/honesty";

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const WEEKS = 53;
const DAYS = 7;

/** Intensity → background class. Index 0 = no contributions. */
const LEVEL_BG = [
  "bg-muted",
  "bg-primary/30",
  "bg-primary/60",
  "bg-primary",
] as const;

/** Bucket a day's count into one of 4 intensity levels, scaled by the busiest day. */
function level(count: number, max: number): number {
  if (count <= 0) return 0;
  if (max <= 0) return 0;
  const ratio = count / max;
  if (ratio > 0.66) return 3;
  if (ratio > 0.33) return 2;
  return 1;
}

/**
 * Contribution heatmap. When the snapshot is real, fill the grid from the
 * calendar weeks; otherwise (`pending`) render a muted empty grid (never
 * fabricated cells.
 */
export function ContributionHeatmap({
  weeks,
  pending,
}: {
  weeks: CalendarWeek[];
  pending: boolean;
}) {
  const maxCount = pending
    ? 0
    : weeks.reduce(
        (max, w) => w.days.reduce((m, d) => Math.max(m, d.count), max),
        0,
      );

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

        {pending ? (
          <div
            className="mt-2 grid grid-flow-col gap-[3px] opacity-40"
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
        ) : (
          <div
            className="mt-2 grid grid-flow-col gap-[3px]"
            style={{ gridTemplateRows: `repeat(${DAYS}, 1fr)` }}
            aria-hidden
          >
            {weeks.map((week, wi) =>
              Array.from({ length: DAYS }).map((_, di) => {
                const day = week.days[di];
                const lvl = day ? level(day.count, maxCount) : 0;
                return (
                  <span
                    key={`${wi}-${di}`}
                    title={day ? `${day.date}: ${day.count}` : undefined}
                    className={cn(
                      "size-[9px] rounded-[2px] border border-border/60",
                      LEVEL_BG[lvl],
                    )}
                  />
                );
              }),
            )}
          </div>
        )}

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
