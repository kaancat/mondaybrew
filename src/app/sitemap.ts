import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mondaybrew.dk");
  const routes = ["/", "/en", "/blog", "/en/blog", "/work", "/en/work", "/services", "/en/services", "/contact", "/en/contact"];
  return routes.map((path) => ({ url: new URL(path, base).toString(), changeFrequency: "weekly", priority: 0.7 }));
}

