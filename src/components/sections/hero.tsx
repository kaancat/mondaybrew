import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextReactComponents } from "@portabletext/react";
import type { ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { HeroFeatureCarousel, type HeroFeatureDisplayItem } from "./hero-feature-carousel";

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"]);

type Dimensions = { width?: number; height?: number } | undefined;

export type HeroButton = {
  label?: string;
  href?: string;
  variant?: string;
} | null;

type WithImageAsset = {
  alt?: string;
  image?: {
    asset?: {
      url?: string;
      metadata?: {
        lqip?: string;
        dimensions?: Dimensions;
      };
    };
  } | null;
} | null;

export type HeroBackground = {
  alt?: string;
  videoUrl?: string;
  image?: WithImageAsset;
  poster?: WithImageAsset;
} | null;

export type HeroFeatureReference = {
  _type?: 'page' | 'post' | 'caseStudy';
  title?: string;
  locale?: string;
  slug?: string;
  href?: string;
  excerpt?: string;
  image?: WithImageAsset;
} | null;

export type HeroFeatureItem = {
  title?: string;
  excerpt?: string;
  href?: string;
  metaLabel?: string;
  image?: WithImageAsset;
  reference?: HeroFeatureReference | null;
  linkType?: "reference" | "manual" | null;
} | null;

export type HeroFeature = {
  title?: string;
  excerpt?: string;
  href?: string;
  metaLabel?: string;
  image?: WithImageAsset;
  reference?: HeroFeatureReference | null;
  items?: HeroFeatureItem[] | null;
} | null;

export type HeroSectionData = {
  eyebrow?: string;
  headline?: PortableTextBlock[] | string | null;
  heading?: string | null;
  subheading?: string | null;
  helper?: string | null;
  cta?: HeroButton;
  feature?: HeroFeature;
  background?: HeroBackground;
  alignment?: "start" | "center" | "end";
  // legacy fallbacks
  primary?: HeroButton;
  secondary?: HeroButton;
  media?: WithImageAsset;
};

export function isHeroSection(
  section: { _type?: string } | null | undefined,
): section is HeroSectionData & { _type: "hero" } {
  return Boolean(section && section._type === "hero");
}

type HeroSectionProps = HeroSectionData & { locale?: "da" | "en" };

const CTA_FALLBACK: Record<"da" | "en", string> = {
  da: "Start et projekt",
  en: "Start a project",
};

const FEATURE_META_FALLBACK: Record<"da" | "en", string> = {
  da: "Seneste indlæg",
  en: "Latest entries",
};

const FEATURE_META_BY_TYPE: Record<string, Record<"da" | "en", string>> = {
  post: { da: "Blogindlæg", en: "Blog post" },
  caseStudy: { da: "Case study", en: "Case study" },
  page: { da: "Side", en: "Page" },
};

const portableComponents: Partial<PortableTextReactComponents> = {
  marks: {
    em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
    strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold">{children}</strong>,
  },
  block: {
    normal: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-balance text-[clamp(2.5rem,4vw+1rem,4.5rem)] font-semibold leading-[1.05] text-white">
        {children}
      </h1>
    ),
  },
};

function resolveVariant(button: HeroButton, fallback: "default" | "ghost" = "default") {
  if (!button?.variant) return fallback;
  return ALLOWED_BUTTON_VARIANTS.has(button.variant) ? (button.variant as typeof fallback) : fallback;
}

function resolveImageAsset(media: WithImageAsset): {
  url?: string;
  alt?: string;
  dimensions?: Dimensions;
  lqip?: string;
} {
  const url = media?.image?.asset?.url;
  const dimensions = media?.image?.asset?.metadata?.dimensions;
  const lqip = media?.image?.asset?.metadata?.lqip;
  const alt = media?.alt;
  return { url, dimensions, lqip, alt };
}

function buildReferenceHref(ref?: HeroFeatureReference | null): string | undefined {
  if (!ref?._type) return undefined;
  const slug = ref.slug?.replace(/^\/+|\/+$/g, '') || '';
  const locale = ref.locale || 'da';

  switch (ref._type) {
    case 'post':
      return slug ? `${locale === 'en' ? '/en/blog/' : '/blog/'}${slug}` : locale === 'en' ? '/en/blog' : '/blog';
    case 'caseStudy':
      return slug ? `${locale === 'en' ? '/en/cases/' : '/cases/'}${slug}` : locale === 'en' ? '/en/cases' : '/cases';
    case 'page': {
      if (!slug || slug === 'home') {
        return locale === 'en' ? '/en' : '/';
      }
      return `${locale === 'en' ? '/en/' : '/'}${slug}`.replace(/\/+$/g, '');
    }
    default:
      return undefined;
  }
}

export function HeroSection({
  locale = "da",
  eyebrow,
  headline,
  heading,
  subheading,
  helper,
  cta,
  feature,
  background,
  alignment = "center",
  primary,
  secondary,
  media,
}: HeroSectionProps) {
  const backgroundMedia = background?.image ?? media ?? null;
  const posterMedia = background?.poster ?? null;
  const { url: backgroundUrl, lqip: backgroundLqip, alt: backgroundAlt } =
    resolveImageAsset(backgroundMedia);
  const poster = resolveImageAsset(posterMedia);
  const videoUrl = background?.videoUrl;

  const ctaData = cta || primary;
  const ctaHref = ctaData?.href || "/kontakt";
  const ctaLabel = ctaData?.label || CTA_FALLBACK[locale];

  const secondaryData = secondary;

  const helperText = helper || null;

  const fallbackHref = secondaryData?.href || "/cases";
  const featureItemsSource = feature?.items?.length
    ? feature.items
    : feature
    ? [
        {
          title: feature.title,
          excerpt: feature.excerpt,
          href: feature.href,
          metaLabel: feature.metaLabel,
          image: feature.image,
          reference: feature.reference,
        },
      ]
    : [];

  const featureItems = featureItemsSource
    .map((item, idx) => {
      if (!item) return null;
      const reference = item.reference || null;
      const title = item.title || reference?.title || null;
      const excerpt = item.excerpt || reference?.excerpt || null;
      const linkType = item.linkType || (reference ? "reference" : null);
      const manualHref = item.href?.trim() || undefined;
      const href =
        linkType === "manual"
          ? manualHref
          : buildReferenceHref(reference) || manualHref || fallbackHref;
      if (!href) return null;
      const imageSource = item.image || reference?.image || null;
      const resolvedImage = resolveImageAsset(imageSource);
      const image = resolvedImage.url
        ? { url: resolvedImage.url, alt: resolvedImage.alt || title || undefined, lqip: resolvedImage.lqip }
        : null;
      const referenceMeta = reference?._type ? FEATURE_META_BY_TYPE[reference._type]?.[locale] : undefined;
      const metaLabel = item.metaLabel || referenceMeta || FEATURE_META_FALLBACK[locale];
      const slugKey = reference?.slug ? reference.slug.replace(/^\/+|\/+$/g, "") : "";
      const key = reference?._type ? `${reference._type}:${slugKey || idx}` : `manual-${idx}`;
      return { key, title, excerpt, href, metaLabel, image } satisfies HeroFeatureDisplayItem;
    })
    .filter(Boolean) as HeroFeatureDisplayItem[];

  const offsetVar = "var(--hero-offset, 140px)";
  const bottomGapVar = "var(--hero-bottom-gap, 96px)";
  const heroHeight = `min(820px, max(500px, calc(100vh - ${offsetVar} - ${bottomGapVar})))`;

  const contentJustify = alignment === "start" ? "flex-start" : alignment === "end" ? "flex-end" : "center";
  const contentGap = alignment === "center" ? "gap-12" : "gap-10";

  return (
    <Section
      padding="none"
      innerClassName="pb-16"
      style={{ marginTop: offsetVar, marginBottom: bottomGapVar }}
    >
      <div
        className="relative isolate flex w-full flex-col overflow-hidden rounded-[5px] border border-white/10 bg-black/60 shadow-[0_50px_120px_rgba(8,6,20,0.35)]"
        style={{ minHeight: "560px", height: heroHeight }}
      >
        <div className="absolute inset-0">
          {videoUrl ? (
            <video
              className="h-full w-full object-cover"
              src={videoUrl}
              poster={poster.url || backgroundUrl}
              preload="metadata"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : backgroundUrl ? (
            <Image
              src={backgroundUrl}
              alt={background?.alt || backgroundAlt || "Background"}
              fill
              priority
              placeholder={backgroundLqip ? "blur" : undefined}
              blurDataURL={backgroundLqip}
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-black/82" />
        </div>

        <div
          className={`relative z-10 flex h-full flex-col ${contentGap} px-6 py-10 sm:px-10 lg:px-16`}
          style={{ justifyContent: contentJustify }}
        >
          <div className="max-w-2xl text-white">
            {eyebrow ? <span className="mb-4 block text-sm font-medium text-white/80">{eyebrow}</span> : null}
            {Array.isArray(headline) ? (
              <PortableText value={headline as PortableTextBlock[]} components={portableComponents} />
            ) : typeof headline === "string" && headline ? (
              <h1 className="text-balance text-[clamp(2.5rem,4vw+1rem,4.5rem)] font-semibold leading-[1.05] text-white">
                {headline}
              </h1>
            ) : heading ? (
              <h1 className="text-balance text-[clamp(2.5rem,4vw+1rem,4.5rem)] font-semibold leading-[1.05] text-white">
                {heading}
              </h1>
            ) : null}
            {subheading ? (
              <p className="mt-5 max-w-xl text-lg text-white/80 md:text-xl">
                {subheading}
              </p>
            ) : null}
            {helperText ? (
              <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                {helperText}
              </p>
            ) : null}
            {ctaData ? (
              <div className="mt-6">
                <Button asChild size="lg" variant={resolveVariant(ctaData, "default")}>
                  <Link href={ctaHref} className="inline-flex items-center gap-2">
                    <span>{ctaLabel}</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>

          {featureItems.length ? <HeroFeatureCarousel items={featureItems} /> : null}
        </div>

        {feature ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-black/40 to-transparent md:block" aria-hidden="true" />
        ) : null}
      </div>
    </Section>
  );
}
