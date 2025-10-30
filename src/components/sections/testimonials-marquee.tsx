import TestimonialsMarqueeClient, { type TCard, type TImage } from "./testimonials-marquee.client";
import { Section } from "@/components/layout/section";
import { buildSanityImage } from "@/lib/sanity-image";

type SanityImage = {
  alt?: string | null;
  image?: { asset?: { url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number; height?: number } | null } | null } | null } | null;
} | null;

function resolveImage(img?: SanityImage): TImage {
  if (!img) return null;
  const built = buildSanityImage(
    {
      alt: img.alt ?? undefined,
      image: img.image ?? undefined,
    },
    { width: 720, quality: 80 },
  );
  if (!built.src && !built.alt) return null;
  return {
    src: built.src || null,
    alt: built.alt || null,
    blurDataURL: built.blurDataURL || null,
    width: built.width,
    height: built.height,
  } satisfies TImage;
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
    tone?: "surface" | "charcoal" | "accent" | "auto" | null;
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
      tone: (c?.tone as TCard["tone"]) ?? null,
      logo: resolveImage(c?.logo),
      image: resolveImage(c?.image),
      quote: c?.quote || null,
      author: c?.author || null,
      role: c?.role || null,
      cta: c?.cta || null,
    }));

  return (
    <Section
      padding="none"
      width="full"
      className="bg-transparent"
      // Reduce vertical gap between header and marquee on mobile
      innerClassName="flex min-h-[100vh] flex-col gap-2 md:gap-[calc(var(--flow-space)/1.6)] bg-transparent"
    >
      {/* Note: Section provides the padded Container already (width=full). Avoid nested Containers to prevent double gutters. */}
      <div className="flex flex-col gap-[calc(var(--flow-space)/1.4)] w-full lg:max-w-[78ch] xl:max-w-[82ch]">
        {eyebrow ? (
          <p className="eyebrow text-[length:var(--font-tight)] uppercase tracking-[0.25em] text-[color:var(--eyebrow-color)]">
            {eyebrow}
          </p>
        ) : null}
        {headline ? (
          <h2 className="text-balance text-[color:var(--foreground)]">
            {headline}
          </h2>
        ) : null}
        {subheading ? (
          <p className="max-w-[78ch] text-[length:var(--font-body)] leading-[1.7] text-muted-foreground">{subheading}</p>
        ) : null}
      </div>
      <div className="flex flex-1">
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
