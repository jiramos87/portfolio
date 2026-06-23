import type { MetricKind } from "@/lib/api";

/**
 * Honesty tags (PRD §3) drive visual treatment across the showroom.
 * `real` reads confident/solid; `placeholder` / `target` read muted + labeled.
 * Never present a placeholder/target value as verified.
 */
export type HonestyTag = "REAL" | "NOW" | "TARGET" | "TECH" | "PLACEHOLDER";

export interface TagStyle {
  /** chip text/border classes */
  className: string;
  /** whether the value it labels should read muted */
  muted: boolean;
}

const TAG_STYLES: Record<HonestyTag, TagStyle> = {
  REAL: { className: "border-primary/40 bg-primary/15 text-primary", muted: false },
  NOW: { className: "border-success/40 bg-success/15 text-success", muted: false },
  TARGET: { className: "border-warning/40 bg-warning/15 text-warning", muted: true },
  TECH: { className: "border-chart-3/40 bg-chart-3/15 text-chart-3", muted: false },
  PLACEHOLDER: { className: "border-border bg-muted text-muted-foreground", muted: true },
};

export function tagStyle(tag: HonestyTag): TagStyle {
  return TAG_STYLES[tag];
}

/** Map a metric's data `kind` to its display tag. */
export function metricTag(kind: MetricKind): HonestyTag {
  if (kind === "real") return "REAL";
  if (kind === "target") return "TARGET";
  return "PLACEHOLDER";
}

/**
 * Legacy byte-percentage slice. Still used by the design-system donut demo;
 * the live activity block now renders curated `Stack`s (no percentages).
 */
export interface LanguageSlice {
  name: string;
  pct: number;
}

/**
 * Curated primary stacks ("what I build in"). Honest self-representation, NOT a
 * byte measurement. The activity payload ships an ordered list of `{ name }`.
 */
export interface Stack {
  name: string;
}

/**
 * Narrow the `unknown` languages payload into an ordered list of stack names.
 * Accepts the curated `[{ name }]` shape; also tolerates the legacy
 * `[{ name, pct }]` shape (the `pct` is simply ignored).
 */
export function parseStacks(raw: unknown): Stack[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is Stack =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).name === "string",
    )
    .map((item) => ({ name: item.name }));
}

/** One day in the contribution calendar. */
export interface CalendarDay {
  date: string;
  count: number;
}

/** A single week column of the heatmap. */
export interface CalendarWeek {
  days: CalendarDay[];
}

/** A normalized point of the contributions-over-time series. */
export interface SeriesPoint {
  date: string;
  count: number;
}

/** The supported chart ranges (mirrors the API's normalized series keys). */
export type SeriesRange = "1D" | "7D" | "1M" | "1Y";

export type ContributionsSeries = Record<SeriesRange, SeriesPoint[]>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Narrow the `unknown` calendar payload into the validated heatmap weeks. */
export function parseCalendarWeeks(raw: unknown): CalendarWeek[] {
  if (!isRecord(raw)) return [];
  const weeks = raw.weeks;
  if (!Array.isArray(weeks)) return [];
  return weeks
    .map((week): CalendarWeek | null => {
      if (!isRecord(week) || !Array.isArray(week.days)) return null;
      const days = week.days
        .filter(
          (d): d is CalendarDay =>
            isRecord(d) &&
            typeof d.date === "string" &&
            typeof d.count === "number",
        )
        .map((d) => ({ date: d.date, count: d.count }));
      return { days };
    })
    .filter((w): w is CalendarWeek => w !== null && w.days.length > 0);
}

function parseSeriesPoints(raw: unknown): SeriesPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (p): p is SeriesPoint =>
        isRecord(p) &&
        typeof p.date === "string" &&
        typeof p.count === "number",
    )
    .map((p) => ({ date: p.date, count: p.count }));
}

/** Narrow the `unknown` calendar payload into the normalized time series. */
export function parseContributionsSeries(
  raw: unknown,
): ContributionsSeries | null {
  if (!isRecord(raw) || !isRecord(raw.series)) return null;
  const series = raw.series;
  const out: ContributionsSeries = {
    "1D": parseSeriesPoints(series["1D"]),
    "7D": parseSeriesPoints(series["7D"]),
    "1M": parseSeriesPoints(series["1M"]),
    "1Y": parseSeriesPoints(series["1Y"]),
  };
  const hasAny = (Object.values(out) as SeriesPoint[][]).some(
    (pts) => pts.length > 0,
  );
  return hasAny ? out : null;
}
