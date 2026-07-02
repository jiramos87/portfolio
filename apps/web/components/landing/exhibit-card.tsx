import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TagChip } from "@/components/site/tag-chip";
import { GithubIcon } from "@/components/site/brand-icons";
import { TerminalCover } from "@/components/site/terminal-cover";
import { metricTag } from "@/lib/honesty";
import type { Project } from "@/lib/api";

const KIND_LABEL: Record<Project["kind"], string> = {
  WEB_APP: "WEB_APP",
  TOOLING: "TOOLING",
  CASE_STUDY: "CASE_STUDY",
};

function KindChip({ kind }: { kind: Project["kind"] }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {KIND_LABEL[kind]}
    </span>
  );
}

function VisibilityChip({ repoPublic }: { repoPublic: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {repoPublic ? (
        <>Public repo</>
      ) : (
        <>
          <Lock className="size-2.5" aria-hidden /> Private code
        </>
      )}
    </span>
  );
}

/**
 * 16:10 card cover: the first screenshot when present, a terminal mock for
 * tooling (no UI to capture), else a mono placeholder that keeps the ratio.
 */
function CardCover({ project }: { project: Project }) {
  const shot = project.screenshots?.[0];

  if (shot) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted">
        <Image
          src={shot}
          alt=""
          fill
          sizes="(min-width: 640px) 340px, 90vw"
          className="object-cover transition-transform duration-500 group-hover/exhibit:scale-105"
        />
      </div>
    );
  }

  if (project.kind === "TOOLING") {
    return <TerminalCover className="border-b border-border" />;
  }

  return (
    <div className="flex aspect-[16/10] w-full items-center justify-center border-b border-border bg-gradient-to-br from-muted to-card">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {project.name}
      </span>
    </div>
  );
}

/**
 * One exhibit: a media-forward card whose whole surface links to the detail
 * view (stretched link), with Live/Repo as independent links above it.
 * `decorative` marks the marquee's duplicated copies so they stay out of the
 * keyboard tab order.
 */
export function ExhibitCard({
  project,
  decorative = false,
}: {
  project: Project;
  decorative?: boolean;
}) {
  const built = [...project.toolsUsed, ...project.stack];
  const primaryMetric = project.metrics?.[0] ?? null;
  const tab = decorative ? -1 : undefined;

  return (
    <Card className="group/exhibit relative h-full gap-0 overflow-hidden p-0 transition-colors hover:ring-foreground/20">
      <CardCover project={project} />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <KindChip kind={project.kind} />
          <VisibilityChip repoPublic={project.repoPublic} />
        </div>

        <div>
          <Link
            href={`/projects/${project.slug}`}
            tabIndex={tab}
            className="inline-flex items-center gap-1 text-lg font-semibold tracking-tight transition-colors after:absolute after:inset-0 hover:text-primary"
          >
            {project.name}
            <ArrowUpRight
              className="size-4 opacity-0 transition-opacity group-hover/exhibit:opacity-100"
              aria-hidden
            />
          </Link>
          <p className="mt-1.5 text-sm text-muted-foreground">{project.tagline}</p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Built with
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {built.map((item) => (
              <span
                key={item}
                className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-3 text-sm">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tab}
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" aria-hidden /> Live
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tab}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <GithubIcon className="size-3.5" /> Repo
              </a>
            ) : null}
          </div>

          {primaryMetric ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="font-mono text-xs text-muted-foreground">
                {primaryMetric.label}{" "}
                {primaryMetric.value !== null ? String(primaryMetric.value) : "n/a"}
              </span>
              <TagChip tag={metricTag(primaryMetric.kind)} />
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
