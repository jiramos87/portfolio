import { Card } from "@/components/ui/card";
import { TagChip } from "@/components/site/tag-chip";
import { cn } from "@/lib/utils";
import { tagStyle, type HonestyTag } from "@/lib/honesty";

export interface Kpi {
  label: string;
  tag: HonestyTag;
  value: string;
  sub: string;
}

/** Decorative sparkline: a fixed shape, not a data claim. */
function Sparkline({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 80 24"
      className={cn("h-6 w-20", muted ? "text-muted-foreground" : "text-primary")}
      fill="none"
      aria-hidden
    >
      <polyline
        points="0,18 12,14 24,16 36,9 48,11 60,5 80,7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={muted ? 0.5 : 1}
      />
    </svg>
  );
}

export function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const muted = tagStyle(kpi.tag).muted;
          return (
            <Card key={kpi.label} className="gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {kpi.label}
                </span>
                <TagChip tag={kpi.tag} />
              </div>
              <div className="flex items-end justify-between gap-2">
                <span
                  className={cn(
                    "text-3xl font-semibold tracking-tight tabular-nums",
                    muted ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {kpi.value}
                </span>
                <Sparkline muted={muted} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
