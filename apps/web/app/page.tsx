import { getActivity, getProjects, type Project } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

// TEMPORARY M2/M3 page: proves the DB → API → RSC path AND the design system
// (Tailwind v4 tokens + shadcn + next-themes). Replaced by the designed landing
// (Direction B / terminal hero) at M4.
export const dynamic = "force-dynamic";

const KIND_LABEL: Record<Project["kind"], string> = {
  WEB_APP: "Web app",
  TOOLING: "Tooling",
  CASE_STUDY: "Case study",
};

export default async function Home() {
  let projects: Project[] = [];
  let totalContribs: number | null = null;
  let placeholder = false;
  let error: string | null = null;

  try {
    const [p, activity] = await Promise.all([getProjects(), getActivity()]);
    projects = p;
    totalContribs = activity?.totalContribs ?? null;
    placeholder = activity?.isPlaceholder ?? false;
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          M3 · design-system proof — replaced at M4
        </p>
        <ThemeToggle />
      </div>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Javier Ramos — <span className="text-primary">Developer Showroom</span>
      </h1>

      {error ? (
        <p className="mt-6 text-destructive">
          API unreachable: {error}. Start it with{" "}
          <code className="font-mono">pnpm --filter api dev</code>.
        </p>
      ) : (
        <>
          {totalContribs !== null && (
            <p className="mt-3 text-muted-foreground">
              <span className="font-semibold text-foreground">
                {totalContribs.toLocaleString()}
              </span>{" "}
              GitHub contributions (last 12 months)
              {placeholder ? " — live calendar pending" : ""}.
            </p>
          )}

          <h2 className="mt-10 text-lg font-medium">
            Exhibits ({projects.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{project.name}</span>
                  {project.featured && (
                    <span className="rounded-sm bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-primary">
                      Featured
                    </span>
                  )}
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {KIND_LABEL[project.kind]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.tagline}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button>View work</Button>
          </div>
        </>
      )}
    </main>
  );
}
