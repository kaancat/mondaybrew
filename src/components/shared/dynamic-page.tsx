import { fetchSanity } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { HeroPage, isHeroPage } from "@/components/sections/hero-page";
import { TextImageSection } from "@/components/sections/text-image";
import { TextOnlySection } from "@/components/sections/text-only";
import { Section } from "@/components/layout/section";

/**
 * Dynamic Page Component
 * 
 * Renders any page from Sanity by slug, supporting all content block types.
 * Used by service pages to enable dynamic content management.
 * 
 * Why: Provides a single reusable component for all service pages,
 * eliminating code duplication and ensuring consistent behavior.
 */

type PageSection = {
    _type?: string;
    _key?: string;
    [key: string]: unknown;
};

type PagePayload = {
    sections?: PageSection[];
};

type DynamicPageProps = {
    slug: string;
    locale?: string;
    fallbackTitle?: string;
    fallbackDescription?: string;
};

// Type guards
function isTextImageSection(section: PageSection): boolean {
    return section?._type === "textImage";
}

function isTextOnlySection(section: PageSection): boolean {
    return section?._type === "textOnly";
}

export async function DynamicPage({
    slug,
    locale = "da",
    fallbackTitle = "Page",
    fallbackDescription = "This page needs to be set up in Sanity.",
}: DynamicPageProps) {
    const page = await fetchSanity<PagePayload>(pageBySlugQuery, {
        slug,
        locale,
    });

    if (!page) {
        return (
            <Section innerClassName="flow">
                <span className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)]">
                    Setup Required
                </span>
                <h1>{fallbackTitle}</h1>
                <p className="max-w-2xl text-muted-foreground">
                    {fallbackDescription} Please create a Page document with slug{" "}
                    <code className="bg-muted px-2 py-1 rounded">{slug}</code> and add content sections.
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

        if (isTextImageSection(section)) {
          return (
            <div className="vr-section" key={key} id={key}>
              <TextImageSection
                eyebrow={section.eyebrow as string | undefined}
                title={section.title as string | undefined}
                body={section.body as string | undefined}
                image={section.image as {
                  alt?: string | null;
                  asset?: {
                    url?: string | null;
                    metadata?: {
                      lqip?: string | null;
                      dimensions?: {
                        width?: number | null;
                        height?: number | null;
                      } | null;
                    } | null;
                  } | null;
                } | null | undefined}
                imagePosition={section.imagePosition as "left" | "right" | null | undefined}
                cta={section.cta as {
                  label?: string | null;
                  href?: string | null;
                  variant?: string | null;
                } | null | undefined}
              />
            </div>
          );
        }

        if (isTextOnlySection(section)) {
          return (
            <div className="vr-section" key={key} id={key}>
              <TextOnlySection
                eyebrow={section.eyebrow as string | null | undefined}
                title={section.title as string | null | undefined}
                body={section.body as string | null | undefined}
              />
            </div>
          );
        }

                // Unknown section type - skip silently
                return null;
            })}
        </main>
    );
}

export const revalidate = 60;

