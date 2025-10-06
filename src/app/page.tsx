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
import ClientsSection from "@/components/sections/clients-section";
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
  feature?: {
    items?: Array<{
      linkType?: "reference" | "manual";
      title?: string;
      excerpt?: string;
      href?: string;
      metaLabel?: string;
      image?: { alt?: string; image?: { asset?: { url?: string; metadata?: { lqip?: string } } } };
      reference?: {
        _type?: "page" | "post" | "caseStudy";
        title?: string;
        locale?: string;
        slug?: string;
        excerpt?: string;
        image?: { alt?: string; image?: { asset?: { url?: string; metadata?: { lqip?: string } } } };
      } | null;
    }> | null;
  } | null;
};
type ClientsSectionWithType = {
  _type: "clientsSection";
  _key?: string;
  eyebrow?: string;
  headline?: string;
  subheading?: string;
  more?: { label?: string; href?: string; variant?: string } | null;
  logos?: Array<{
    title?: string;
    url?: string;
    image?: { alt?: string; image?: { asset?: { url?: string; metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } } } } };
  }>;
};
type HomePageSection =
  | HeroSectionWithType
  | ServicesSplitSectionWithType
  | CaseStudyCarouselSectionWithType
  | ClientsSectionWithType
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

function isClientsSection(section: HomePageSection | undefined): section is ClientsSectionWithType {
  return !!section && section._type === "clientsSection";
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
    <main>
      {sections.map((section, index) => {
        const key = section?._key ?? `section-${index}`;

        if (isHeroSection(section)) {
          return (
            <div className="vr-hero" key={key}>
              <HeroSection
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
            </div>
          );
        }

        if (isServicesSplitSection(section)) {
          return (
            <div className="vr-section" key={key}>
              <ServicesSplitSection {...section} />
            </div>
          );
        }

        if (isCaseStudyCarouselSection(section)) {
          return (
            <div className="vr-section-tight" key={key}>
              <CaseStudyCarouselSection
                locale={locale}
                initialIndex={section.initialIndex}
                eyebrow={section.eyebrow}
                headline={section.headline}
                intro={section.intro}
                explore={section.explore}
                feature={section.feature}
              />
            </div>
          );
        }

        if (isClientsSection(section)) {
          return (
            <div className="vr-section-tight" key={key}>
              <ClientsSection
                eyebrow={section.eyebrow}
                headline={section.headline}
                subheading={section.subheading}
                logos={section.logos}
                more={section.more}
                locale={locale}
              />
            </div>
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
