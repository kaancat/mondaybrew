import { Section } from "@/components/layout/section";
import {
  AboutSectionClient,
  type AboutSectionResolvedImage,
  type AboutSectionResolvedStat,
} from "@/components/sections/about-section.client";

type SanityImageAsset = {
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
} | null;

type SanityIconImage = {
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
} | null;

export type AboutSectionStat = {
  value?: string | null;
  label?: string | null;
  icon?: SanityIconImage;
} | null;

export type AboutSectionData = {
  eyebrow?: string | null;
  headline?: string | null;
  subheading?: string | null;
  mainImage?: SanityImageAsset;
  stats?: AboutSectionStat[] | null;
  cta?: {
    label?: string | null;
    href?: string | null;
    reference?: { slug?: string | null; locale?: string | null } | null;
    variant?: string | null;
  } | null;
};

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"]);

export function AboutSection({ eyebrow, headline, subheading, mainImage, stats, cta }: AboutSectionData) {
  const image = resolveImage(mainImage);
  // Allow easy override from environment or static public file during design tweaks
  // Prefer explicit envs; fall back to a common dev filename in public/ if present.
  // Examples: "/statistics_billede.png" or any absolute URL.
  const overrideUrl =
    process.env.NEXT_PUBLIC_ABOUT_IMAGE_URL?.trim() ||
    process.env.ABOUT_IMAGE_URL?.trim() ||
    (process.env.NODE_ENV !== "production" ? "/statistics_billede.png" : undefined);
  const mergedImage: AboutSectionResolvedImage | null = overrideUrl
    ? { url: overrideUrl, alt: image?.alt ?? "About image", lqip: image?.lqip, width: image?.width, height: image?.height }
    : image;
  const sanitizedStats = (stats ?? []).reduce<AboutSectionResolvedStat[]>((acc, stat) => {
    const value = stat?.value?.trim();
    const label = stat?.label?.trim();
    const icon = stat?.icon ? resolveImage(stat.icon) : null;
    if (!value && !label && !icon?.url) {
      return acc;
    }
    acc.push({ value, label, icon });
    return acc;
  }, []);

  return (
    <Section innerClassName="flex flex-col gap-[var(--flow-space)]">
      <AboutSectionClient
        eyebrow={eyebrow?.trim()}
        headline={headline?.trim()}
        subheading={subheading?.trim()}
        image={mergedImage}
        stats={sanitizedStats}
        cta={buildCta(cta)}
      />
    </Section>
  );
}

function resolveImage(image?: SanityImageAsset | SanityIconImage | null): AboutSectionResolvedImage | null {
  const url = image?.asset?.url?.trim() || null;
  const alt = image?.alt?.trim() || null;
  const lqip = image?.asset?.metadata?.lqip?.trim() || null;
  const width = image?.asset?.metadata?.dimensions?.width || undefined;
  const height = image?.asset?.metadata?.dimensions?.height || undefined;

  if (!url && !alt) {
    return null;
  }

  return { url, alt, lqip, width, height } satisfies AboutSectionResolvedImage;
}

function resolveHref(cta: AboutSectionData["cta"]) {
  const manual = cta?.href?.trim();
  if (manual) return manual;
  const slug = cta?.reference?.slug?.trim();
  if (slug) {
    const locale = cta?.reference?.locale || "da";
    return locale === "en" ? `/en/${slug}` : `/${slug}`;
  }
  return null;
}

function resolveButtonVariant(variant?: string | null): "default" | "secondary" | "outline" | "ghost" | "link" {
  if (variant && ALLOWED_BUTTON_VARIANTS.has(variant)) {
    return variant as "default" | "secondary" | "outline" | "ghost" | "link";
  }
  return "default";
}

function buildCta(cta: AboutSectionData["cta"]) {
  const href = resolveHref(cta);
  if (!cta?.label || !href) return null;
  return {
    label: cta.label,
    href,
    variant: resolveButtonVariant(cta.variant),
  } as const;
}
