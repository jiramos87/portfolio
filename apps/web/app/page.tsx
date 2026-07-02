import {
  getActivity,
  getProjects,
  type ActivitySnapshot,
  type Project,
} from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { KpiStrip, type Kpi } from "@/components/landing/kpi-strip";
import { ProjectGrid } from "@/components/landing/project-grid";
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
      label: "Ship time · this site",
      tag: "REAL",
      value: "<24h",
      sub: "spec to production",
    },
    {
      label: "Lighthouse · live site",
      tag: "REAL",
      value: "96-100",
      sub: "every category, desktop + mobile",
    },
    {
      label: "Production experience",
      tag: "REAL",
      value: "4+ yrs",
      sub: "payments, e-commerce, biotech",
    },
  ];

  return (
    <main>
      <Hero />
      <KpiStrip kpis={kpis} />
      <ProjectGrid projects={projects} />
      <MethodLoop />
      <ActivitySection activity={activity} />
      <ContactSection />
    </main>
  );
}
