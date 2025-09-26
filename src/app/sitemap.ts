import { MetadataRoute } from "next";
import { fetchSanity } from "@/lib/sanity.client";
import { allRoutesQuery } from "@/lib/sanity.queries";

type RouteDoc = { _type: string; slug: string; locale?: "da" | "en"; _updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app";
  const docs = await fetchSanity<RouteDoc[]>(allRoutesQuery);
  const urls: MetadataRoute.Sitemap = [];

  // Homepages
  urls.push({ url: `${base}/`, changeFrequency: "weekly", priority: 1 });
  urls.push({ url: `${base}/en`, changeFrequency: "weekly", priority: 0.9 });

  for (const d of docs) {
    const pathPrefix = d.locale === "en" ? "/en" : "";
    if (!d.slug) continue;
    const lastModified = d._updatedAt ? new Date(d._updatedAt) : undefined;
    // basic collections naming
    const segment = d._type === "post" ? "/blog" : d._type === "caseStudy" ? "/work" : "";
    const path = `${pathPrefix}${segment}/${d.slug}`.replace(/\/+/, "/");
    urls.push({ url: `${base}${path}`, changeFrequency: "weekly", priority: 0.7, lastModified });
  }
  return urls;
}
