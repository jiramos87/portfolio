import type { Metadata } from "next";
import { getProjects, type Project } from "@/lib/api";
import { Eyebrow } from "@/components/site/eyebrow";
import { ProjectsTable } from "@/components/projects/projects-table";

export const metadata: Metadata = {
  title: "Projects | Javier Ramos",
  description: "Every exhibit: the shipped product and how it was built.",
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await getProjects();
  } catch {
    // API unreachable: render the empty state below.
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>EXHIBITS</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Each row is an exhibit: the shipped product and the build behind it. Click a
        header to sort; open a row for the full story, PRD included.
      </p>

      <div className="mt-8">
        {projects.length > 0 ? (
          <ProjectsTable projects={projects} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No exhibits available right now.
          </div>
        )}
      </div>
    </main>
  );
}
