import type { Metadata } from "next";
import { urlFor } from "./image";

type Seo = {
  title?: string;
  description?: string;
  image?: any;
  canonical?: string;
  noindex?: boolean;
};

export function seoToMetadata({ seo, pathname = "/", locale = "da" }: { seo?: Seo; pathname?: string; locale?: "da" | "en" }): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://mondaybrew-website.vercel.app";
  const title = seo?.title || (locale === "da" ? "mondaybrew — Websites, Webapps & PPC" : "mondaybrew — Websites, Webapps & PPC");
  const description = seo?.description || (locale === "da" ? "Digitalt bureau i Danmark med fokus på websites, webapps og PPC." : "Digital agency in Denmark specializing in websites, webapps, and PPC.");
  const image = seo?.image ? urlFor(seo.image).width(1200).height(630).fit("crop").url() : undefined;
  const canonical = seo?.canonical || new URL(pathname, base).toString();

  const languages: Record<string, string> = {
    da: new URL(pathname.startsWith("/en") ? pathname.replace(/^\/en/, "") || "/" : pathname, base).toString(),
    en: new URL(pathname.startsWith("/en") ? pathname : `/en${pathname === "/" ? "" : pathname}`, base).toString(),
  };

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "mondaybrew",
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  } satisfies Metadata;
}

