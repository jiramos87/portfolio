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

export interface LanguageSlice {
  name: string;
  pct: number;
}

/** Narrow the `unknown` languages payload into a typed, validated array. */
export function parseLanguages(raw: unknown): LanguageSlice[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is LanguageSlice =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).name === "string" &&
        typeof (item as Record<string, unknown>).pct === "number",
    )
    .map((item) => ({ name: item.name, pct: item.pct }));
}
