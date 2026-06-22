import { getActivity, getProjects, type Project } from "../lib/api";

// TEMPORARY M2 page: proves the DB → API → RSC read path end-to-end.
// Replaced by the designed landing (Direction B / terminal hero) at M4.
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
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "3rem 1.5rem",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <p
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          opacity: 0.6,
        }}
      >
        M2 · RSC read proof — replaced by the designed landing at M4
      </p>
      <h1 style={{ fontSize: 32, margin: "0.25rem 0 1rem" }}>
        Javier Ramos — Developer Showroom
      </h1>

      {error ? (
        <p style={{ color: "crimson" }}>
          API unreachable: {error}. Start it with <code>pnpm dev</code> (or{" "}
          <code>pnpm --filter api dev</code>).
        </p>
      ) : (
        <>
          {totalContribs !== null && (
            <p>
              <strong>{totalContribs.toLocaleString()}</strong> GitHub
              contributions (last 12 months)
              {placeholder ? " — live calendar pending" : ""}.
            </p>
          )}
          <h2 style={{ fontSize: 18, marginTop: "2rem" }}>
            Exhibits ({projects.length})
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {projects.map((project) => (
              <li
                key={project.id}
                style={{
                  padding: "0.75rem 0",
                  borderTop: "1px solid rgba(127,127,127,0.2)",
                }}
              >
                <strong>{project.name}</strong>
                {project.featured ? " ★" : ""}{" "}
                <span style={{ opacity: 0.6 }}>
                  · {KIND_LABEL[project.kind]}
                </span>
                <br />
                <span style={{ opacity: 0.8 }}>{project.tagline}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
