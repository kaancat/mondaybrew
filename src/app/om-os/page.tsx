import { AboutSection, type AboutSectionData } from "@/components/sections/about-section";
import { Section } from "@/components/layout/section";
import { fetchSanity } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";

export const revalidate = 60;

type PageWithSections = {
  sections?: Array<AboutSectionData & { _type?: string }>;
  locale?: string | null;
};

function isAboutSection(
  section: (AboutSectionData & { _type?: string }) | undefined,
): section is AboutSectionData & { _type: "aboutSection" } {
  return Boolean(section && section._type === "aboutSection");
}

export default async function AboutPage() {
  const page = await fetchSanity<PageWithSections | null>(pageBySlugQuery, { slug: "om-os", locale: "da" });
  const section = page?.sections?.find(isAboutSection) ?? null;

  return (
    <main>
      {section ? (
        <div className="vr-section">
          <AboutSection
            eyebrow={section.eyebrow}
            headline={section.headline}
            subheading={section.subheading}
            mainImage={section.mainImage}
            stats={section.stats}
            cta={section.cta}
          />
        </div>
      ) : (
        <Section innerClassName="flow">
          <span className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Om os</span>
          <h1>Indhold mangler i Sanity</h1>
          <p className="max-w-2xl text-muted-foreground">
            Tilføj sektionen <span className="font-medium">About (Glass overlay)</span> til siden Om os i Sanity for at vise indhold her.
          </p>
        </Section>
      )}
    </main>
  );
}
