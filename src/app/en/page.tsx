import type { Metadata } from "next";
import { fetchSanity } from "@/lib/sanity.client";
import { siteSettingsQuery } from "@/lib/sanity.queries";
import { seoToMetadata, type Seo } from "@/lib/seo";

type SiteSettings = { seo?: Seo };

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSanity<SiteSettings>(siteSettingsQuery, {});
  return seoToMetadata({ seo: settings?.seo, pathname: "/en", locale: "en" });
}

export default function HomeEN() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>mondaybrew</h1>
      <p className="mt-4 text-muted-foreground">English homepage placeholder.</p>
    </div>
  );
}
