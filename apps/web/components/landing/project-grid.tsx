import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { ExhibitCard } from "@/components/landing/exhibit-card";
import type { Project } from "@/lib/api";

/**
 * Featured exhibits as a static 2x2 grid (single column on mobile). Every exhibit
 * is visible without interaction, so a recruiter skimming the page sees the whole
 * catalogue at once. The full, sortable list lives on /projects.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Eyebrow>FEATURED EXHIBITS</Eyebrow>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            The product and how it was built
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all exhibits
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Each exhibit pairs the shipped product with the build behind it: the PRD
          it started from, the timeline, and the metrics, honestly tagged.
        </p>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="reveal-on-scroll">
              <ExhibitCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
