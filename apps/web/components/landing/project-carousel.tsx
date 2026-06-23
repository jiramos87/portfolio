import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { ExhibitCard } from "@/components/landing/exhibit-card";
import type { Project } from "@/lib/api";

/**
 * Featured exhibits as a seamless right-to-left marquee. Pure CSS: identical
 * card groups drift left and loop (see `.animate-marquee` in globals.css), pause
 * on hover, and stop under reduced-motion. The whole list is one band; the full,
 * static catalogue lives on /projects (linked below the heading) for keyboard /
 * reduced-motion users.
 */
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  // Enough identical groups to fill wide viewports without a gap (~340px/card).
  const groupWidth = projects.length * 340;
  const groups = Math.max(2, Math.ceil(2400 / groupWidth));

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
          Each exhibit shows the shipped product and the agentic build behind it.
          Hover to pause, click a card to open it.
        </p>
      </div>

      <div className="marquee-fade group/marquee relative mt-8 flex gap-5 overflow-hidden [--marquee-duration:55s] [--marquee-gap:1.25rem]">
        {Array.from({ length: groups }).map((_, g) => (
          <ul
            key={g}
            aria-hidden={g > 0 || undefined}
            className="flex shrink-0 items-stretch gap-5 animate-marquee group-hover/marquee:[animation-play-state:paused]"
          >
            {projects.map((project) => (
              <li key={`${g}-${project.id}`} className="w-[300px] shrink-0 sm:w-[340px]">
                <ExhibitCard project={project} decorative={g > 0} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
