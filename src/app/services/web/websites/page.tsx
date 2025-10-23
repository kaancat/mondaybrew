import { fetchSanity } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { HeroPage, isHeroPage, type HeroPageData } from "@/components/sections/hero-page";
import { Section } from "@/components/layout/section";

/**
 * Websites service page - dynamically fetches content from Sanity
 */

type PageSection = HeroPageData & { _type: string; _key?: string };

type PagePayload = {
  sections?: PageSection[];
  locale?: "da" | "en";
};

export const revalidate = 60;

export default async function WebsitesPage() {
  // Fetch page data from Sanity by slug
  const page = await fetchSanity<PagePayload>(pageBySlugQuery, { 
    slug: "services/web/websites", 
    locale: "da" 
  });
  
  const sections = page?.sections ?? [];

  // If no content is found, show a placeholder message
  if (sections.length === 0) {
    return (
      <Section innerClassName="flow">
        <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">Web</span>
        <h1>Websites</h1>
        <p className="max-w-2xl text-muted-foreground">
          This page is not yet configured in Sanity. Please add a Page document with slug <code>services/web/websites</code> and add a Hero Page section.
        </p>
      </Section>
    );
  }

  // Render sections dynamically
  return (
    <main>
      {sections.map((section, index) => {
        const key = section?._key ?? `section-${index}`;

        if (isHeroPage(section)) {
          return (
            <HeroPage
              key={key}
              eyebrow={section.eyebrow}
              heading={section.heading}
              subheading={section.subheading}
              media={section.media}
              breadcrumbs={section.breadcrumbs}
            />
          );
        }

        // Handle other section types as needed
        return null;
      })}
    </main>
  );
}
