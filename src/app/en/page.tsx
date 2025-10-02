import type { Metadata } from "next";
import { fetchSanity } from "@/lib/sanity.client";
import { siteSettingsQuery, homePageQuery } from "@/lib/sanity.queries";
import { seoToMetadata, type Seo } from "@/lib/seo";
import { HeroSection, isHeroSection, type HeroSectionData } from "@/components/sections/hero";
import { PillarsSection, isPillarsSection, type PillarsSectionData } from "@/components/sections/pillars";
import { Section } from "@/components/layout/section";

type SiteSettings = { seo?: Seo };

type PillarsSectionWithType = PillarsSectionData & { _type: "pillars" };
type HeroSectionWithType = HeroSectionData & { _type: "hero" };

type HomePageSection = HeroSectionWithType | PillarsSectionWithType | { _type?: string };

type HomePagePayload = {
  seo?: Seo;
  sections?: HomePageSection[];
};

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([
    fetchSanity<SiteSettings>(siteSettingsQuery, {}),
    fetchSanity<HomePagePayload>(homePageQuery, { locale: "en" }),
  ]);

  return seoToMetadata({
    seo: page?.seo ?? settings?.seo,
    pathname: "/en",
    locale: "en",
  });
}

export default async function HomeEN() {
  const page = await fetchSanity<HomePagePayload>(homePageQuery, { locale: "en" });
  const hero = page?.sections?.find(isHeroSection);
  const pillars = page?.sections?.find(isPillarsSection);

  return (
    <main className="space-y-24 pb-24">
      {hero ? (
        <HeroSection
          locale="en"
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
          <h1>Hero content missing</h1>
          <p className="max-w-2xl text-muted-foreground">
            Add a Hero section to the English homepage in Sanity to render content here.
          </p>
        </Section>
      )}
      {pillars ? (
        <PillarsSection sectionTitle={pillars.sectionTitle} groups={pillars.groups} locale="en" />
      ) : null}
    </main>
  );
}
