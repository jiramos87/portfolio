import {
  getActivity,
  getProjects,
  type ActivitySnapshot,
  type Project,
} from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { KpiStrip, type Kpi } from "@/components/landing/kpi-strip";
import { ProjectCarousel } from "@/components/landing/project-carousel";
import { MethodLoop } from "@/components/landing/method-loop";
import { ActivitySection } from "@/components/landing/activity-section";
import { ContactSection } from "@/components/landing/contact-section";

export default async function Home() {
  let projects: Project[] = [];
  let activity: ActivitySnapshot | null = null;

  try {
    [projects, activity] = await Promise.all([getProjects(), getActivity()]);
  } catch {
    // API unreachable (e.g. at build time): degrade to honest defaults.
  }

  const kpis: Kpi[] = [
    {
      label: "Contributions · 12 mo",
      tag: "REAL",
      value: (activity?.totalContribs ?? 1863).toLocaleString(),
      sub: "verified on GitHub",
    },
    {
      label: "Launch exhibits",
      tag: "NOW",
      value: String(projects.length || 3),
      sub: "product + build log",
    },
    { label: "Avg Lighthouse", tag: "TARGET", value: "95+", sub: "target across exhibits" },
    { label: "Core stack", tag: "TECH", value: "10", sub: "TS · Node · Nest · Next +6" },
  ];

  return (
    <main>
      <Hero />
      <KpiStrip kpis={kpis} />
      <ProjectCarousel projects={projects} />
      <MethodLoop />
      <ActivitySection activity={activity} />
      <ContactSection />
    </main>
  );
}
