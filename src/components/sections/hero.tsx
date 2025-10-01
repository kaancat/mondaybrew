import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextReactComponents } from "@portabletext/react";
import type { ReactNode } from "react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

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

export type HeroFeature = {
  title?: string;
  excerpt?: string;
  href?: string;
  metaLabel?: string;
  image?: WithImageAsset;
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

  const featureHref = feature?.href || secondaryData?.href || "/cases";
  const featureImage = resolveImageAsset(feature?.image ?? null);
  const featureMeta = feature?.metaLabel || FEATURE_META_FALLBACK[locale];

  return (
    <Section padding="none" className="mt-28 md:mt-36 lg:mt-40 xl:mt-44" innerClassName="pb-20">
      <div
        className="relative isolate flex w-full flex-col overflow-hidden rounded-[5px] border border-white/10 bg-black/60 shadow-[0_50px_120px_rgba(8,6,20,0.35)]"
        style={{ minHeight: "560px", height: "min(85vh, 940px)" }}
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

        <div className="relative z-10 flex h-full flex-col justify-between gap-12 px-6 py-10 sm:px-10 lg:px-16">
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
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </div>
            ) : null}
          </div>

          {feature ? (
            <Link
              href={featureHref}
              className="group mt-10 w-full max-w-md rounded-[5px] border border-white/10 bg-black/55 text-white shadow-[0_32px_80px_rgba(15,10,30,0.35)] backdrop-blur-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[rgba(255,145,77,0.55)] hover:border-white/20 hover:bg-black/70 hover:shadow-[0_40px_90px_rgba(11,8,20,0.45)] sm:max-w-sm md:mt-0 md:max-w-xs md:hover:-translate-y-1 lg:max-w-sm xl:max-w-md md:absolute md:bottom-12 md:right-12"
            >
              {featureImage.url ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[5px]">
                  <Image
                    src={featureImage.url}
                    alt={featureImage.alt || feature?.title || "Feature"}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    placeholder={featureImage.lqip ? "blur" : undefined}
                    blurDataURL={featureImage.lqip}
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-3 px-5 py-6">
                {feature?.title ? <h3 className="text-lg font-semibold leading-tight">{feature.title}</h3> : null}
                {feature?.excerpt ? (
                  <p className="text-sm text-white/80">
                    {feature.excerpt}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center justify-between text-xs font-medium text-white/65">
                  <span>{featureMeta}</span>
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition group-hover:border-white/25 group-hover:bg-white/20">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ) : null}
        </div>

        {feature ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-black/40 to-transparent md:block" aria-hidden="true" />
        ) : null}
      </div>
    </Section>
  );
}
