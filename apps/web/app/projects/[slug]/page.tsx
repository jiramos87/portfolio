import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { getProject, type Project } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { GithubIcon } from "@/components/site/brand-icons";

const KIND_LABEL: Record<Project["kind"], string> = {
  WEB_APP: "WEB_APP",
  TOOLING: "TOOLING",
  CASE_STUDY: "CASE_STUDY",
};

async function loadProject(slug: string): Promise<Project | null> {
  try {
    return await getProject(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return { title: "Project not found — Javier Ramos" };
  return {
    title: `${project.name} — Javier Ramos`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden /> All projects
      </Link>

      <header className="mt-6 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {KIND_LABEL[project.kind]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {project.repoPublic ? (
              "Public repo"
            ) : (
              <>
                <Lock className="size-2.5" aria-hidden /> Private code
              </>
            )}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{project.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{project.tagline}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ className: "cta-gradient" })}
            >
              <ExternalLink className="size-4" aria-hidden /> View live
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <GithubIcon className="size-4" /> Repository
            </a>
          ) : null}
        </div>
      </header>

      <div className="mt-8">
        <ProjectTabs project={project} />
      </div>
    </main>
  );
}
