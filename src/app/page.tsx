import type { Metadata } from "next";
import { fetchSanity } from "@/lib/sanity.client";
import { siteSettingsQuery, homePageQuery } from "@/lib/sanity.queries";
import { seoToMetadata, type Seo } from "@/lib/seo";
import { HeroSection, isHeroSection, type HeroSectionData } from "@/components/sections/hero";
import {
  ServicesSplitSection,
  isServicesSplitSection,
  type ServicesSplitSectionData,
} from "@/components/sections/services-split";
import CaseStudyCarouselSection from "@/components/sections/case-study-carousel";
import { Section } from "@/components/layout/section";

type SiteSettings = { seo?: Seo };

type HeroSectionWithType = HeroSectionData & { _type: "hero"; _key?: string };
type ServicesSplitSectionWithType = ServicesSplitSectionData & { _type: "servicesSplit"; _key?: string };

type CaseStudyCarouselSectionWithType = {
  _type: "caseStudyCarousel";
  _key?: string;
  eyebrow?: string;
  headline?: Array<{ children?: Array<{ text?: string }> }>;
  intro?: string;
  initialIndex?: number;
  explore?: { label?: string; href?: string; variant?: string } | null;
};
type HomePageSection =
  | HeroSectionWithType
  | ServicesSplitSectionWithType
  | CaseStudyCarouselSectionWithType
  | { _type?: string; _key?: string };

type HomePagePayload = {
  seo?: Seo;
  locale?: "da" | "en";
  sections?: HomePageSection[];
};

export const revalidate = 60;

function isCaseStudyCarouselSection(
  section: HomePageSection | undefined,
): section is CaseStudyCarouselSectionWithType {
  return !!section && section._type === "caseStudyCarousel";
}

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
  const sections = page?.sections ?? [];
  const locale = (page?.locale as "da" | "en" | undefined) ?? "da";
  const hasHero = sections.some(isHeroSection);

  return (
    <main className="space-y-24 pb-24">
      {sections.map((section, index) => {
        const key = section?._key ?? `section-${index}`;

        if (isHeroSection(section)) {
          return (
            <HeroSection
              key={key}
              locale={locale}
              eyebrow={section.eyebrow}
              headline={section.headline}
              heading={section.heading}
              subheading={section.subheading}
              helper={section.helper}
              alignment={section.alignment as "start" | "center" | "end" | undefined}
              primary={section.primary}
              secondary={section.secondary}
              cta={section.cta}
              background={section.background}
              feature={section.feature}
              media={section.media}
            />
          );
        }

        if (isServicesSplitSection(section)) {
          return <ServicesSplitSection key={key} {...section} />;
        }

        if (isCaseStudyCarouselSection(section)) {
          return (
            <CaseStudyCarouselSection
              key={key}
              locale={locale}
              initialIndex={section.initialIndex}
              eyebrow={section.eyebrow}
              headline={section.headline}
              intro={section.intro}
              explore={section.explore}
            />
          );
        }

        return null;
      })}
      {!hasHero ? (
        <Section innerClassName="flow">
          <span className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Homepage</span>
          <h1>Heroindhold mangler i Sanity</h1>
          <p className="max-w-2xl text-muted-foreground">
            Tilføj en Hero sektion til forsiden i Sanity (Forside → sektioner) for at se indholdet her.
          </p>
        </Section>
      ) : null}
    </main>
  );
}
