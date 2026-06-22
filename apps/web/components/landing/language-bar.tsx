import type { LanguageSlice } from "@/lib/honesty";

const BAR_COLORS = [
  "bg-primary",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-muted-foreground",
];

/**
 * Language & tech breakdown. `activity.languages` carries real-looking design
 * values; render the bars but flag them as approximate / live pull pending.
 */
export function LanguageBar({
  languages,
  approximate,
}: {
  languages: LanguageSlice[];
  approximate: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Language &amp; tech breakdown</h3>
        {approximate ? (
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            approximate · live pull pending
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        across public + private repositories
      </p>

      <ul className="mt-4 space-y-3">
        {languages.map((lang, i) => (
          <li key={lang.name}>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-foreground">{lang.name}</span>
              <span className="text-muted-foreground tabular-nums">{lang.pct}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`${BAR_COLORS[i % BAR_COLORS.length]} h-full rounded-full`}
                style={{ width: `${lang.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
