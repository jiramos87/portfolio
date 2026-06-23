import { GitCommit } from "lucide-react";
import type { CommitEntry } from "@/lib/api";
import { formatDate } from "@/lib/format";

/**
 * Live recent-commit feed for an exhibit's repo. Data is pulled from GitHub
 * nightly and stored on the Project row, so this renders from the DB like
 * everything else (no per-request GitHub call). The "as of" label lives in the
 * caller so the cached-nightly nature stays explicit.
 */
export function RecentCommits({ commits }: { commits: CommitEntry[] }) {
  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {commits.map((commit) => (
        <li key={commit.sha} className="relative">
          <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border border-border bg-card">
            <GitCommit className="size-3 text-primary" aria-hidden />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground hover:text-primary"
            >
              {commit.sha}
            </a>
            <span className="font-mono text-[10px] text-muted-foreground">
              {formatDate(commit.date)}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">
            <a
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              {commit.message}
            </a>
          </p>
        </li>
      ))}
    </ol>
  );
}
