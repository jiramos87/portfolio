import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/api";

const SITE_URL = process.env.SITE_URL ?? "https://javierramos.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/projects",
    "/methodology",
    "/design-system",
    "/about",
    "/cv",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Per-exhibit detail pages. Fall back to the seed slugs if the API is down at build.
  let slugs = ["portfolio", "agentic-dev-kit", "territory-developer"];
  try {
    const projects = await getProjects();
    if (projects.length) slugs = projects.map((p) => p.slug);
  } catch {
    // keep the fallback slugs
  }

  const projectRoutes = slugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
