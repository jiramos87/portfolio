import Link from "next/link";
import { ArrowUpRight, ExternalLink, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TagChip } from "@/components/site/tag-chip";
import { GithubIcon } from "@/components/site/brand-icons";
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

export function ExhibitCard({ project }: { project: Project }) {
  const built = [...project.toolsUsed, ...project.stack];
  const primaryMetric = project.metrics?.[0] ?? null;

  return (
    <Card className="group/exhibit gap-4 p-6 transition-colors hover:ring-foreground/20">
      <div className="flex flex-wrap items-center gap-2">
        <KindChip kind={project.kind} />
        <VisibilityChip repoPublic={project.repoPublic} />
      </div>

      <div>
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-lg font-semibold tracking-tight transition-colors hover:text-primary"
        >
          {project.name}
          <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover/exhibit:opacity-100" aria-hidden />
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

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-3 text-sm">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
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
    </Card>
  );
}
