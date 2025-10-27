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
import { AboutSection, type AboutSectionData } from "@/components/sections/about-section";
import TestimonialsMarquee, { type TestimonialsMarqueeData } from "@/components/sections/testimonials-marquee";
import { TextImageSection, type TextImageSectionData } from "@/components/sections/text-image";
import { TextOnlySection, type TextOnlySectionData } from "@/components/sections/text-only";
import { Section } from "@/components/layout/section";
import MediaShowcaseSection, { type MediaShowcaseSectionData } from "@/components/sections/media-showcase";

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
  forceBlackLogos?: boolean;
  logos?: Array<{
    title?: string;
    url?: string;
    image?: { alt?: string; image?: { asset?: { url?: string; metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } } } } };
  }>;
};
type AboutSectionWithType = AboutSectionData & { _type: "aboutSection"; _key?: string };
type TestimonialsWithType = TestimonialsMarqueeData & { _type: "testimonialsMarquee"; _key?: string };
type TextImageSectionWithType = TextImageSectionData & { _type: "textImage"; _key?: string };
type TextOnlySectionWithType = TextOnlySectionData & { _type: "textOnly"; _key?: string };
type MediaShowcaseWithType = MediaShowcaseSectionData & { _type: "mediaShowcase"; _key?: string };
type HomePageSection =
  | HeroSectionWithType
  | ServicesSplitSectionWithType
  | CaseStudyCarouselSectionWithType
  | ClientsSectionWithType
  | AboutSectionWithType
  | TestimonialsWithType
  | TextImageSectionWithType
  | TextOnlySectionWithType
  | MediaShowcaseWithType
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

function isAboutSection(section: HomePageSection | undefined): section is AboutSectionWithType {
  return !!section && section._type === "aboutSection";
}
function isTestimonials(section: HomePageSection | undefined): section is TestimonialsWithType {
  return !!section && section._type === "testimonialsMarquee";
}

function isTextImageSection(section: HomePageSection | undefined): section is TextImageSectionWithType {
  return !!section && section._type === "textImage";
}

function isTextOnlySection(section: HomePageSection | undefined): section is TextOnlySectionWithType {
  return !!section && section._type === "textOnly";
}

function isMediaShowcase(section: HomePageSection | undefined): section is MediaShowcaseWithType {
  return !!section && section._type === "mediaShowcase";
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

  // Render Sanity sections in the exact order defined in Studio
  const sectionsWithTest = sections;

  return (
    <main>
      {sectionsWithTest.map((section, index) => {
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

        if (isTextImageSection(section)) {
          return (
            <div className="vr-section" key={key}>
              <TextImageSection
                variant={section.variant}
                enableTabs={section.enableTabs}
                eyebrow={section.eyebrow}
                title={section.title}
                body={section.body}
                image={section.image}
                imagePosition={section.imagePosition}
                tabs={section.tabs}
                cta={section.cta}
              />
            </div>
          );
        }

        if (isTextOnlySection(section)) {
          return (
            <div className="vr-section" key={key}>
              <TextOnlySection
                eyebrow={section.eyebrow}
                title={section.title}
                body={section.body}
                cta={section.cta}
                cta2={section.cta2}
              />
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
                forceBlackLogos={section.forceBlackLogos}
              />
            </div>
          );
        }

        if (isAboutSection(section)) {
          return (
            <div className="vr-section" key={key}>
              <AboutSection
                eyebrow={section.eyebrow}
                headline={section.headline}
                subheading={section.subheading}
                mainImage={section.mainImage}
                stats={section.stats}
                cta={section.cta}
              />
            </div>
          );
        }
        if (isTestimonials(section)) {
          return (
            <div className="vr-section" key={key}>
              <TestimonialsMarquee
                eyebrow={section.eyebrow}
                headline={section.headline}
                subheading={section.subheading}
                speedTop={section.speedTop}
                speedBottom={section.speedBottom}
                top={section.top}
                bottom={section.bottom}
              />
            </div>
          );
        }

        if (isMediaShowcase(section)) {
          return (
            <div className="vr-section" key={key}>
              <MediaShowcaseSection
                sectionId={section.sectionId}
                eyebrow={section.eyebrow}
                headline={section.headline}
                alignment={section.alignment}
                cta={section.cta}
                media={section.media}
                stats={section.stats}
              />
            </div>
          );
        }

        return null;
      })}
      {!hasHero ? (
        <Section innerClassName="flow">
          <span className="eyebrow text-sm uppercase tracking-[0.25em] text-[color:var(--eyebrow-color,currentColor)]">Homepage</span>
          <h1>Heroindhold mangler i Sanity</h1>
          <p className="max-w-2xl text-muted-foreground">
            Tilføj en Hero sektion til forsiden i Sanity (Forside → sektioner) for at se indholdet her.
          </p>
        </Section>
      ) : null}
    </main>
  );
}
