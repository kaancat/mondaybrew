import TestimonialsMarqueeClient, { type TCard, type TImage } from "./testimonials-marquee.client";
import { Section } from "@/components/layout/section";

type SanityImage = {
  alt?: string | null;
  image?: { asset?: { url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number; height?: number } | null } | null } | null } | null;
} | null;

function resolveImage(img?: SanityImage): TImage {
  const url = img?.image?.asset?.url || null;
  const alt = img?.alt || null;
  const lqip = img?.image?.asset?.metadata?.lqip || null;
  const width = img?.image?.asset?.metadata?.dimensions?.width || undefined;
  const height = img?.image?.asset?.metadata?.dimensions?.height || undefined;
  if (!url) return null;
  return { url, alt, lqip, width, height };
}

export type TestimonialsMarqueeData = {
  eyebrow?: string | null;
  headline?: string | null;
  subheading?: string | null;
  speedTop?: number | null;
  speedBottom?: number | null;
  top?: Array<{
    variant?: "image" | "quote" | "imageQuote";
    background?: string | null;
    logo?: SanityImage;
    image?: SanityImage;
    quote?: string | null;
    author?: string | null;
    role?: string | null;
    cta?: { label?: string | null; href?: string | null } | null;
  }> | null;
  bottom?: TestimonialsMarqueeData["top"];
};

export default function TestimonialsMarquee({ eyebrow, headline, subheading, speedTop, speedBottom, top, bottom }: TestimonialsMarqueeData) {
  const mapCards = (set?: TestimonialsMarqueeData["top"]): TCard[] =>
    (set || []).map((c) => ({
      variant: (c?.variant as TCard["variant"]) || "quote",
      background: c?.background || null,
      logo: resolveImage(c?.logo),
      image: resolveImage(c?.image),
      quote: c?.quote || null,
      author: c?.author || null,
      role: c?.role || null,
      cta: c?.cta || null,
    }));

  return (
    <Section padding="none" innerClassName="layout-container-full">
      <div className="layout-container pt-14 pb-6">
        {eyebrow ? (
          <div className="eyebrow text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--eyebrow-color)]">{eyebrow}</div>
        ) : null}
        {headline ? (
          <h2 className="mt-2 text-balance text-[clamp(32px,6vw,56px)] font-semibold leading-[1.05] tracking-tight">
            {headline}
          </h2>
        ) : null}
        {subheading ? (
          <p className="mt-3 max-w-[70ch] text-[length:var(--font-body)] text-muted-foreground">{subheading}</p>
        ) : null}
      </div>
      <TestimonialsMarqueeClient
        top={mapCards(top)}
        bottom={mapCards(bottom)}
        speedTop={speedTop ?? undefined}
        speedBottom={speedBottom ?? undefined}
      />
    </Section>
  );
}

