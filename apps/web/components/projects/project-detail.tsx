import { ExternalLink, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MetricChip } from "@/components/site/metric-chip";
import { Timeline } from "@/components/projects/timeline";
import { RecentCommits } from "@/components/projects/recent-commits";
import { ScreenshotGallery } from "@/components/projects/screenshot-gallery";
import { TerminalCover } from "@/components/site/terminal-cover";
import { GithubIcon } from "@/components/site/brand-icons";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/api";

const SECTIONS = [
  { id: "product", label: "Product" },
  { id: "build", label: "How I built it" },
  { id: "metrics", label: "Metrics" },
] as const;

/**
 * Project detail as stacked, server-rendered sections (was a client tab widget).
 * Every section is in the initial HTML, so the "how it was built" story is
 * visible to a skimmer and to crawlers without a click. The row of anchor links
 * jumps between sections.
 */
export function ProjectDetail({ project }: { project: Project }) {
  const metrics = project.metrics ?? [];
  const timeline = project.timeline ?? [];
  const commits = project.repoCommits ?? [];
  const showDemoSlot = project.kind === "CASE_STUDY" && !project.liveUrl;

  return (
    <div className="space-y-14">
      <nav
        aria-label="Sections"
        className="flex flex-wrap gap-1 border-b border-border pb-3"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <section id="product" className="scroll-mt-24 space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Product</h2>
        <p className="text-sm text-muted-foreground">
          The shipped product: live link, the problem it solves, and the stack it runs
          on.
        </p>

        <div>
          <h3 className="text-sm font-medium">The problem</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{project.problem}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Stack</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {showDemoSlot ? (
          <div>
            <h3 className="text-sm font-medium">Gameplay</h3>
            {/* Placeholder until a capture is recorded; no video field is added
                until there is a real asset to render. */}
            <div className="mt-2 flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border bg-card">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Gameplay capture coming here
              </span>
            </div>
          </div>
        ) : null}

        {project.screenshots.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium">Screenshots</h3>
            <div className="mt-2">
              <ScreenshotGallery
                screenshots={project.screenshots}
                name={project.name}
              />
            </div>
          </div>
        ) : project.kind === "TOOLING" ? (
          <div>
            <h3 className="text-sm font-medium">Preview</h3>
            <div className="mt-2 max-w-md">
              <TerminalCover className="rounded-lg border border-border" />
            </div>
          </div>
        ) : null}
      </section>

      <section id="build" className="scroll-mt-24 space-y-8">
        <h2 className="text-lg font-semibold tracking-tight">How I built it</h2>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Product requirements</h3>
            {project.prdUrl ? (
              <a
                href={project.prdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <FileText className="size-3.5" aria-hidden />
                Open the PRD
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>

          {project.prd ? (
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <pre className="font-sans text-sm whitespace-pre-wrap text-muted-foreground">
                {project.prd}
              </pre>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {project.prdUrl
                ? "The full PRD lives in the repo. Open it above."
                : "PRD not published for this exhibit yet."}
            </p>
          )}

          {project.buildStory ? (
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              {project.buildStory}
            </p>
          ) : null}
        </div>

        {project.ciUrl ? (
          <div>
            <h3 className="text-base font-semibold">Continuous integration</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Every push runs the verify gate in GitHub Actions: type-check, lint,
              and build across the monorepo. This badge is live.
            </p>
            <a
              href={project.ciUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- live GitHub Actions status badge (SVG); next/image adds nothing here */}
              <img
                src={`${project.ciUrl}/badge.svg`}
                alt="GitHub Actions CI status"
                className="h-5 w-auto"
              />
            </a>
          </div>
        ) : null}

        {timeline.length > 0 ? (
          <div>
            <h3 className="text-base font-semibold">Timeline</h3>
            <div className="mt-4">
              <Timeline entries={timeline} />
            </div>
          </div>
        ) : null}

        {commits.length > 0 ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Recent commits</h3>
              {project.repoUrl ? (
                <a
                  href={`${project.repoUrl}/commits`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <GithubIcon className="size-3.5" />
                  All commits
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
            {project.repoCommitsAt ? (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Live from GitHub, as of {formatDate(project.repoCommitsAt)}
              </p>
            ) : null}
            <div className="mt-4">
              <RecentCommits commits={commits} />
            </div>
          </div>
        ) : null}
      </section>

      <section id="metrics" className="scroll-mt-24 space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Metrics</h2>
        {metrics.some((m) => m.key === "ship-time") ? (
          <p className="max-w-2xl text-foreground">
            Designed, built, and shipped in under 24 hours for under $15 of agent
            time, about 15% of a weekly Claude Code plan. That is roughly 7 projects
            of capacity in a five-day work week. Capacity, not yet a track record:
            the cadence metric stays a target until it is proven.
          </p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          Each metric carries an honesty tag. Verified numbers read solid; targets and
          placeholders read muted.
        </p>
        {metrics.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <MetricChip key={metric.key} metric={metric} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
            No metrics published for this exhibit yet.
          </p>
        )}
      </section>
    </div>
  );
}
