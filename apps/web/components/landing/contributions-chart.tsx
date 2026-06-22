"use client";

import { useState } from "react";
import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const RANGES = ["1D", "7D", "1M", "1Y"] as const;
type Range = (typeof RANGES)[number];

/**
 * Contributions over time. The time series is empty (placeholder), so we render
 * the range toggles + an explicit muted empty state — no fabricated points.
 */
export function ContributionsChart({ pending }: { pending: boolean }) {
  const [range, setRange] = useState<Range>("1Y");

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

      <div className="mt-4 flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center">
        <LineChart className="size-6 text-muted-foreground" aria-hidden />
        {pending ? (
          <p className="max-w-xs text-xs text-muted-foreground">
            Live pull pending — the {range} series fills once the nightly GitHub
            job writes real data. No fabricated points.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No data for {range}.</p>
        )}
      </div>
    </div>
  );
}
