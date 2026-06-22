"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContributionsSeries, SeriesRange, SeriesPoint } from "@/lib/honesty";

const RANGES: SeriesRange[] = ["1D", "7D", "1M", "1Y"];

const VIEW_W = 600;
const VIEW_H = 120;

/** Build an SVG area+line path from a series. Returns null when too few points. */
function buildPaths(points: SeriesPoint[]) {
  if (points.length < 2) return null;
  const max = Math.max(1, ...points.map((p) => p.count));
  const stepX = VIEW_W / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = VIEW_H - (p.count / max) * (VIEW_H - 8) - 4;
    return { x, y };
  });
  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${VIEW_W} ${VIEW_H} L 0 ${VIEW_H} Z`;
  return { line, area, max };
}

/**
 * Contributions over time. When the snapshot is real, render the normalized
 * series per range as an inline SVG chart; otherwise show the muted empty
 * state — no fabricated points.
 */
export function ContributionsChart({
  series,
  pending,
}: {
  series: ContributionsSeries | null;
  pending: boolean;
}) {
  const [range, setRange] = useState<SeriesRange>("1Y");

  const points = !pending && series ? series[range] : [];
  const paths = buildPaths(points);
  const total = points.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Contributions over time</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            commit + PR activity, normalized
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-[3px]">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-xs transition-colors",
                range === r
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {pending || !paths ? (
        <div className="mt-4 flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
          <LineChart className="size-6 text-muted-foreground" aria-hidden />
          {pending ? (
            <p className="max-w-xs text-xs text-muted-foreground">
              Live pull pending — the {range} series fills once the nightly
              GitHub job writes real data. No fabricated points.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No data for {range}.</p>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="h-40 w-full"
            role="img"
            aria-label={`Contributions for ${range}: ${total} total`}
          >
            <defs>
              <linearGradient id="contrib-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={paths.area} fill="url(#contrib-fill)" />
            <path
              d={paths.line}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            {total.toLocaleString()} contributions over {range} · peak{" "}
            {paths.max.toLocaleString()}/interval
          </p>
        </div>
      )}
    </div>
  );
}
