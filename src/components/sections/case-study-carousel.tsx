import { CaseStudyCarousel } from "./case-study-carousel.client";
import { getCaseStudies } from "@/lib/caseStudies";
import { Section } from "@/components/layout/section";

type Props = {
  locale?: string;
  initialIndex?: number;
  eyebrow?: string;
  headline?: Array<{ children?: Array<{ text?: string }> }>;
  intro?: string;
  explore?: { label?: string; href?: string | null } | null;
};

export default async function CaseStudyCarouselSection({ locale, initialIndex, eyebrow, headline, intro, explore }: Props) {
  const items = await getCaseStudies(locale);
  return (
    <Section>
      <CaseStudyCarousel
        items={items}
        initialIndex={initialIndex}
        eyebrow={eyebrow}
        headlineText={headline?.[0]?.children?.[0]?.text}
        intro={intro}
        exploreHref={explore?.href || "/cases"}
        exploreLabel={explore?.label || "Explore all cases"}
      />
    </Section>
  );
}
