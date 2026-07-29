import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route, index) => ({
    url: route.path === "/" ? "https://enisqetaj.com/" : `https://enisqetaj.com${route.path}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route.path.startsWith("/work/") ? 0.8 : 0.7,
  }));
}
