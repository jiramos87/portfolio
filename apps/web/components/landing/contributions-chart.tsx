"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContributionsSeries, SeriesRange, SeriesPoint } from "@/lib/honesty";

const RANGES: SeriesRange[] = ["1D", "7D", "1M", "1Y"];

const VIEW_W = 560;
const VIEW_H = 120;
const MARGIN_LEFT = 44;

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
}

/** Build an SVG area+line path from a series. Returns null when too few points. */
function buildPaths(points: SeriesPoint[]): ChartPaths | null {
  if (points.length < 2) return null;
  const max = Math.max(1, ...points.map((p) => p.count));
  const innerW = VIEW_W - MARGIN_LEFT;
  const stepX = innerW / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = MARGIN_LEFT + i * stepX;
    const y = VIEW_H - (p.count / max) * (VIEW_H - 8) - 4;
    return { x, y };
  });
  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${VIEW_W} ${VIEW_H} L ${MARGIN_LEFT} ${VIEW_H} Z`;

  const mid = Math.round(max / 2);
  const ticks = max <= 1 ? [0, 1] : [0, mid, max];

  return { line, area, max, ticks };
}

/**
 * Contributions over time. When the snapshot is real, render the normalized
 * series per range as an inline SVG chart; otherwise show the muted empty
 * state (no fabricated points).
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
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H + 16}`}
            preserveAspectRatio="none"
            className="h-44 w-full"
            role="img"
            aria-label={`Contributions for ${range}: ${total} total, Y axis ${Y_LABEL[range]}`}
          >
            <defs>
              <linearGradient id="contrib-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {paths.ticks.map((tick) => {
              const y =
                tick === 0
                  ? VIEW_H - 4
                  : VIEW_H - (tick / paths.max) * (VIEW_H - 8) - 4;
              return (
                <g key={tick}>
                  <line
                    x1={MARGIN_LEFT}
                    y1={y}
                    x2={VIEW_W}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={MARGIN_LEFT - 4}
                    y={y + 3}
                    textAnchor="end"
                    fill="var(--muted-foreground)"
                    fontSize={9}
                    fontFamily="var(--font-mono, monospace)"
                  >
                    {tick}
                  </text>
                </g>
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

            <text
              x={4}
              y={10}
              fill="var(--muted-foreground)"
              fontSize={8}
              fontFamily="var(--font-mono, monospace)"
            >
              {Y_LABEL[range]}
            </text>
          </svg>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            {total.toLocaleString()} contributions over {range} · peak{" "}
            {paths.max.toLocaleString()} per {INTERVAL_LABEL[range]}
          </p>
        </div>
      )}
    </div>
  );
}
