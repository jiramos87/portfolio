import { Eyebrow } from "@/components/site/eyebrow";
import { ExhibitCard } from "@/components/landing/exhibit-card";
import type { Project } from "@/lib/api";

export function FeaturedExhibits({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Eyebrow>FEATURED EXHIBITS</Eyebrow>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        The product and how it was built
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ExhibitCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
