import type { MetadataRoute } from "next";
import { projects } from "@/config/projects";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/projects", "/about", "/contact"];
  return [
    ...pages.map((path) => ({
      url: site.url + path,
      lastModified: now,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified: now,
      priority: 0.9,
    })),
  ];
}
