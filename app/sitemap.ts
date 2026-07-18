import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://enisqetaj.com"; return ["", "/work", "/research", "/contact"].map((path) => ({ url: `${base}${path}`, changeFrequency: path ? "monthly" : "weekly", priority: path ? 0.7 : 1 })); }

