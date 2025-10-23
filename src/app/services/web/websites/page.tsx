import { fetchSanity } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { HeroPage, isHeroPage } from "@/components/sections/hero-page";
import { Section } from "@/components/layout/section";

/**
 * Websites service page - Dynamically renders content from Sanity
 * Add a Hero Page content block in Sanity Studio to display hero content
 */

type PageSection = {
  _type?: string;
  _key?: string;
  [key: string]: unknown;
};

type PagePayload = {
  sections?: PageSection[];
};

export const revalidate = 60;

export default async function WebsitesPage() {
  const page = await fetchSanity<PagePayload>(pageBySlugQuery, {
    slug: "services/web/websites",
    locale: "da",
  });

  if (!page) {
    return (
      <Section innerClassName="flow">
        <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">
          Setup Required
        </span>
        <h1>Websites</h1>
        <p className="max-w-2xl text-muted-foreground">
          This page needs to be set up in Sanity. Please create a Page document with slug{" "}
          <code className="bg-muted px-2 py-1 rounded">services/web/websites</code> and add a Hero Page
          section.
        </p>
      </Section>
    );
  }

  const sections = page?.sections ?? [];

  return (
    <main>
      {sections.map((section, index: number) => {
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

        // Add other section types here as needed

        return null;
      })}
    </main>
  );
}
