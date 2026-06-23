import { GitCommit, GitPullRequest, FileText, Rocket, Milestone } from "lucide-react";
import type { TimelineEntry } from "@/lib/api";
import { formatDate } from "@/lib/format";

const ICONS: Record<string, typeof GitCommit> = {
  commit: GitCommit,
  pr: GitPullRequest,
  deploy: Rocket,
  prd: FileText,
  milestone: Milestone,
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        No timeline entries yet. Commit, PR, and deploy activity will appear here.
      </p>
    );
  }

  return (
    <ol className="relative space-y-5 border-l border-border pl-6">
      {entries.map((entry, i) => {
        const Icon = ICONS[entry.type] ?? Milestone;
        return (
          <li key={i} className="relative">
            <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border border-border bg-card">
              <Icon className="size-3 text-primary" aria-hidden />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {entry.type}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {formatDate(entry.date)}
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground">
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {entry.label}
                </a>
              ) : (
                entry.label
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
