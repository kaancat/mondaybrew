import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mondaybrew.dk";
  return {
    rules: [{ userAgent: "*" }],
    sitemap: `${base}/sitemap.xml`,
  };
}

