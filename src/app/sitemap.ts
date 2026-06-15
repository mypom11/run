import type { MetadataRoute } from "next";

const STATIC_ROUTES = ["", "/race", "/community", "/magazine"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://runable.me";
  const now = new Date();
  return STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "hourly",
    priority: path === "" ? 1 : 0.7,
  }));
}
