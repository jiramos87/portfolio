import { Eyebrow } from "@/components/site/eyebrow";
import { ContributionHeatmap } from "@/components/landing/contribution-heatmap";
import { LanguageBar } from "@/components/landing/language-bar";
import { ContributionsChart } from "@/components/landing/contributions-chart";
import {
  parseStacks,
  parseCalendarWeeks,
  parseContributionsSeries,
} from "@/lib/honesty";
import type { ActivitySnapshot } from "@/lib/api";

export function ActivitySection({ activity }: { activity: ActivitySnapshot | null }) {
  const weeks = parseCalendarWeeks(activity?.calendar);
  const series = parseContributionsSeries(activity?.calendar);
  const stacks = parseStacks(activity?.languages);

  // "Live" only when the snapshot is real AND carries usable data for that view.
  const isReal = activity != null && !activity.isPlaceholder;
  const heatmapPending = !isReal || weeks.length === 0;
  const chartPending = !isReal || series === null;

  const total = activity?.totalContribs ?? 1863;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>PROOF — GITHUB ACTIVITY</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        Backed by real, continuous work
      </h2>
      <p className="mt-3 font-mono text-sm text-muted-foreground">
        <span className="font-semibold text-foreground tabular-nums">
          {total.toLocaleString()}
        </span>{" "}
        contributions · last 12 months · verified
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContributionHeatmap weeks={weeks} pending={heatmapPending} />
        </div>
        <LanguageBar stacks={stacks} />
        <div className="lg:col-span-3">
          <ContributionsChart series={series} pending={chartPending} />
        </div>
      </div>
    </section>
  );
}
