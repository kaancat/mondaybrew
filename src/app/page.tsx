import type { Metadata } from "next";
import { fetchSanity } from "@/lib/sanity.client";
import { siteSettingsQuery, homePageQuery } from "@/lib/sanity.queries";
import { seoToMetadata, type Seo } from "@/lib/seo";
import { HeroSection, isHeroSection, type HeroSectionData } from "@/components/sections/hero";
import { Section } from "@/components/layout/section";

type SiteSettings = { seo?: Seo };

type HomePagePayload = {
  seo?: Seo;
  sections?: Array<{ _type?: string } & Partial<HeroSectionData>>;
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery, {}),
    fetchSanity<HomePagePayload>(homePageQuery, { locale: "da" }),
  ]);

  return seoToMetadata({
    seo: page?.seo ?? settings?.seo,
    pathname: "/",
    locale: "da",
  });
}

export default async function Home() {
  const page = await fetchSanity<HomePagePayload>(homePageQuery, { locale: "da" });
  const hero = page?.sections?.find(isHeroSection);

  return (
    <main className="space-y-24 pb-24">
      {hero ? (
        <HeroSection
          locale="da"
          eyebrow={hero.eyebrow}
          headline={hero.headline}
          heading={hero.heading}
          subheading={hero.subheading}
          helper={hero.helper}
          alignment={hero.alignment as "start" | "center" | "end" | undefined}
          primary={hero.primary}
          secondary={hero.secondary}
          cta={hero.cta}
          background={hero.background}
          feature={hero.feature}
          media={hero.media}
        />
      ) : (
        <Section innerClassName="flow">
          <span className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Homepage</span>
          <h1>Heroindhold mangler i Sanity</h1>
          <p className="max-w-2xl text-muted-foreground">
            Tilføj en Hero sektion til forsiden i Sanity (Forside → sektioner) for at se indholdet her.
          </p>
        </Section>
      )}
    </main>
  );
}
