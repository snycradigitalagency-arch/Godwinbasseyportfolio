import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/queries/projects";
import { getAllInsightSlugs } from "@/lib/queries/insights";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://godwinbassey.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, insightSlugs] = await Promise.all([
    getAllProjectSlugs(),
    getAllInsightSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/insights`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const insightRoutes: MetadataRoute.Sitemap = insightSlugs.map((i) => ({
    url: `${SITE_URL}/insights/${i.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...insightRoutes];
}
