import { cn } from "@/lib/utils";
import { metricTag, tagStyle } from "@/lib/honesty";
import { TagChip } from "@/components/site/tag-chip";
import type { Metric } from "@/lib/api";

function formatValue(metric: Metric): string {
  if (metric.value === null) return "—";
  const v = String(metric.value);
  return metric.unit ? `${v}${metric.unit}` : v;
}

/** A single metric rendered with its honesty treatment. */
export function MetricChip({ metric, className }: { metric: Metric; className?: string }) {
  const tag = metricTag(metric.kind);
  const muted = tagStyle(tag).muted;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2",
        className,
      )}
    >
      <div className="flex flex-col">
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          {metric.label}
        </span>
        <span
          className={cn(
            "text-lg font-semibold tabular-nums",
            muted ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {formatValue(metric)}
        </span>
      </div>
      <TagChip tag={tag} className="ml-auto" />
    </div>
  );
}
