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
      <div className="min-h-[100vh] flex flex-col">
      <div className="layout-container pt-8 pb-0">
        <div className="flex flex-col gap-[calc(var(--flow-space)/1.4)] w-full lg:max-w-[78ch] xl:max-w-[82ch]">
          {eyebrow ? (
            <div className="eyebrow text-[length:var(--font-tight)] uppercase tracking-[0.25em] text-[color:var(--eyebrow-color)]">{eyebrow}</div>
          ) : null}
          {headline ? (
            <h2 className="text-balance text-[clamp(32px,6vw,58px)] font-semibold leading-[1.03] tracking-tight text-[color:var(--foreground)]">
              {headline}
            </h2>
          ) : null}
          {subheading ? (
            <p className="max-w-[78ch] text-[length:var(--font-body)] leading-[1.7] text-muted-foreground">{subheading}</p>
          ) : null}
        </div>
      </div>
      <TestimonialsMarqueeClient
        top={mapCards(top)}
        bottom={mapCards(bottom)}
        speedTop={speedTop ?? undefined}
        speedBottom={speedBottom ?? undefined}
      />
      </div>
    </Section>
  );
}
