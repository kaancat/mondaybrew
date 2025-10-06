import { AboutSection, type AboutSectionData } from "@/components/sections/about-section";
import { Section } from "@/components/layout/section";
import { fetchSanity } from "@/lib/sanity.client";
import { aboutSectionQuery } from "@/lib/sanity.queries";

export const revalidate = 60;

type AboutSectionDocument = AboutSectionData | null;

export default async function AboutPage() {
  const about = await fetchSanity<AboutSectionDocument>(aboutSectionQuery, {});

  return (
    <main>
      {about ? (
        <div className="vr-section">
          <AboutSection
            eyebrow={about.eyebrow}
            headline={about.headline}
            subheading={about.subheading}
            mainImage={about.mainImage}
            stats={about.stats}
            cta={about.cta}
          />
        </div>
      ) : (
        <Section innerClassName="flow">
          <span className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Om os</span>
          <h1>Indhold mangler i Sanity</h1>
          <p className="max-w-2xl text-muted-foreground">
            Opret dokumentet <span className="font-medium">About Section</span> i Sanity for at vise om os indholdet her.
          </p>
        </Section>
      )}
    </main>
  );
}
