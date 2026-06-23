"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContributionsSeries, SeriesRange, SeriesPoint } from "@/lib/honesty";

const RANGES: SeriesRange[] = ["1D", "7D", "1M", "1Y"];

const VIEW_W = 560;
const VIEW_H = 120;
/** viewBox units kept clear top + bottom so the line and labels never hug the edge. */
const INSET = 10;

/** Y-axis label per range (matches API bucket sizes in activity.service.ts). */
const Y_LABEL: Record<SeriesRange, string> = {
  "1D": "contrib / day",
  "7D": "contrib / day",
  "1M": "contrib / day",
  "1Y": "contrib / week",
};

const INTERVAL_LABEL: Record<SeriesRange, string> = {
  "1D": "day",
  "7D": "day",
  "1M": "day",
  "1Y": "week",
};

interface ChartPaths {
  line: string;
  area: string;
  max: number;
  ticks: number[];
  /** Vertical position (0..1 from top) for a value, shared by gridlines + labels. */
  topFrac: (value: number) => number;
}

/** Build an SVG area+line path from a series. Returns null when too few points. */
function buildPaths(points: SeriesPoint[]): ChartPaths | null {
  if (points.length < 2) return null;
  const max = Math.max(1, ...points.map((p) => p.count));
  const stepX = VIEW_W / (points.length - 1);
  const topFrac = (value: number) =>
    (INSET + (1 - value / max) * (VIEW_H - 2 * INSET)) / VIEW_H;
  const yOf = (value: number) => topFrac(value) * VIEW_H;

  const coords = points.map((p, i) => ({ x: i * stepX, y: yOf(p.count) }));
  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const base = yOf(0).toFixed(1);
  const area = `${line} L ${VIEW_W} ${base} L 0 ${base} Z`;

  const mid = Math.round(max / 2);
  const ticks = max <= 1 ? [1, 0] : [max, mid, 0];

  return { line, area, max, ticks, topFrac };
}

/**
 * Contributions over time. When the snapshot is real, render the normalized
 * series per range as an inline SVG chart; otherwise show the muted empty
 * state (no fabricated points). The y-axis labels are HTML (not SVG text) so
 * they stay crisp under the chart's non-uniform horizontal stretch.
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
            GitHub commits + PRs, {Y_LABEL[range]}
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
              Live pull pending. The {range} series fills once the nightly GitHub
              job writes real data. No fabricated points.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No data for {range}.</p>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex h-44 gap-2">
            {/* Y-axis labels: HTML, right-aligned, centered on their gridlines. */}
            <div className="relative w-8 shrink-0">
              {paths.ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute right-0 -translate-y-1/2 font-mono text-[10px] tabular-nums text-muted-foreground"
                  style={{ top: `${(paths.topFrac(tick) * 100).toFixed(2)}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>

            {/* Plot: paths stretch to fill width; no text inside the SVG. */}
            <div className="relative flex-1">
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="none"
                className="h-full w-full"
                role="img"
                aria-label={`Contributions for ${range}: ${total} total, ${Y_LABEL[range]}`}
              >
                <defs>
                  <linearGradient id="contrib-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {paths.ticks.map((tick) => {
                  const y = paths.topFrac(tick) * VIEW_H;
                  return (
                    <line
                      key={tick}
                      x1={0}
                      y1={y}
                      x2={VIEW_W}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth={0.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

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
            </div>
          </div>

          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            {total.toLocaleString()} contributions over {range} · peak{" "}
            {paths.max.toLocaleString()} per {INTERVAL_LABEL[range]}
          </p>
        </div>
      )}
    </div>
  );
}
