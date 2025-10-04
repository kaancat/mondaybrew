import { CaseStudyCarousel } from "./case-study-carousel.client";
import { getCaseStudies } from "@/lib/caseStudies";
import { Section } from "@/components/layout/section";
import { HeroFeatureCarousel, type HeroFeatureDisplayItem } from "./hero-feature-carousel";

type Props = {
  locale?: string;
  initialIndex?: number;
  eyebrow?: string;
  headline?: Array<{ children?: Array<{ text?: string }> }>;
  intro?: string;
  explore?: { label?: string; href?: string | null } | null;
  feature?: {
    items?: Array<{
      linkType?: "reference" | "manual";
      title?: string;
      excerpt?: string;
      href?: string | null;
      metaLabel?: string | null;
      image?: { alt?: string | null; image?: { asset?: { url?: string; metadata?: { lqip?: string } } } } | null;
      reference?: {
        _type?: "page" | "post" | "caseStudy";
        title?: string | null;
        locale?: string | null;
        slug?: string | null;
        excerpt?: string | null;
        image?: { alt?: string | null; image?: { asset?: { url?: string; metadata?: { lqip?: string } } } } | null;
      } | null;
    }> | null;
  } | null;
};

function buildReferenceHref(ref?: { _type?: string | null; slug?: string | null } | null) {
  if (!ref?._type || !ref.slug) return undefined;
  const seg = ref._type === "post" ? "/blog" : ref._type === "caseStudy" ? "/cases" : "";
  return `${seg}/${ref.slug}`;
}

export default async function CaseStudyCarouselSection({ locale, initialIndex, eyebrow, headline, intro, explore, feature }: Props) {
  const items = await getCaseStudies(locale);
  const featureItems: HeroFeatureDisplayItem[] =
    (feature?.items || [])
      .map((it, i) => {
        const href = (it.linkType === "manual" ? it.href : buildReferenceHref(it.reference)) || "";
        const src = it.image?.image?.asset?.url || it.reference?.image?.image?.asset?.url;
        const lqip = it.image?.image?.asset?.metadata?.lqip || it.reference?.image?.image?.asset?.metadata?.lqip;
        const title = it.title || it.reference?.title || undefined;
        const excerpt = it.excerpt || it.reference?.excerpt || undefined;
        return {
          key: `feature-${i}`,
          title,
          excerpt,
          href,
          metaLabel: it.metaLabel || undefined,
          image: src ? { url: src, alt: it.image?.alt || it.reference?.image?.alt || title, lqip } : undefined,
        } satisfies HeroFeatureDisplayItem;
      })
      .filter(Boolean);
  return (
    <Section>
      {featureItems.length ? (
        <div className="mb-8">
          <HeroFeatureCarousel items={featureItems} />
        </div>
      ) : null}
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
