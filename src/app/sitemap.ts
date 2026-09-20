import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://insyncrealty.in";
  const staticRoutes = ["", "/about", "/projects", "/contact", "/privacy-policy", "/terms", "/disclaimer"];
  return [
    ...staticRoutes.map(path => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : .7,
    })),
    ...publishedProjects.map(project => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: .9,
    })),
  ];
}
