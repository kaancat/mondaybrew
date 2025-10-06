import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const items = (stats ?? []).filter((item) => {
    const value = item?.value?.trim();
    const label = item?.label?.trim();
    const iconUrl = item?.icon?.asset?.url?.trim();
    return Boolean(value || label || iconUrl);
  });
  const ctaHref = resolveHref(cta);
  const overlayVars: CSSProperties & {
    "--overlay-gap"?: string;
    "--overlay-padding"?: string;
    "--overlay-inset"?: string;
  } = {
    "--overlay-gap": "calc(var(--flow-space) * 0.65)",
    "--overlay-padding": "calc(var(--flow-space) * 0.9)",
    "--overlay-inset": "calc(var(--flow-space) * 0.6)",
  };

  return (
    <Section innerClassName="flex flex-col gap-[var(--flow-space)]">
      <div className="flex flex-col gap-[calc(var(--flow-space)/1.4)] lg:max-w-[60ch]">
        {eyebrow ? (
          <p className="text-[length:var(--font-tight)] uppercase tracking-[0.28em] text-[color:var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        {headline ? (
          <h2 className="text-balance text-[clamp(2.125rem,3vw+1rem,3.5rem)] font-semibold leading-[1.08] text-[color:var(--foreground)]">
            {headline}
          </h2>
        ) : null}
        {subheading ? (
          <p className="text-[length:var(--font-body)] leading-[1.65] text-muted-foreground">{subheading}</p>
        ) : null}
      </div>

      <div className="relative" style={overlayVars}>
        <div className="relative overflow-hidden rounded-[5px] shadow-[var(--shadow-glass-lg)]">
          <div className="aspect-[8/3]" />
          {image.url ? (
            <Image
              src={image.url}
              alt={image.alt || "About section image"}
              placeholder={image.lqip ? "blur" : undefined}
              blurDataURL={image.lqip || undefined}
              fill
              sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 90vw"
              className="object-cover"
              priority={false}
            />
          ) : null}
        </div>

        {items.length ? (
          <div
            className={cn(
              "glass-panel mt-[var(--flow-space)] flex flex-col gap-[calc(var(--flow-space)/1.8)]",
              "rounded-[5px] border border-[color:var(--border)] shadow-[var(--shadow-glass-lg)] backdrop-blur-[12px]",
              "bg-[color:color-mix(in_oklch,var(--muted)_86%,transparent)] text-[color:var(--foreground)]",
              "sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
              "md:absolute md:bottom-[var(--overlay-gap)] md:left-[var(--overlay-inset)] md:right-[var(--overlay-inset)] md:mt-0",
            )}
          >
            <dl
              className={cn(
                "grid w-full gap-[calc(var(--flow-space)/2)]",
                items.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
                items.length >= 4 ? "xl:grid-cols-4" : null,
              )}
            >
              {items.map((stat, index) => (
                <StatItem key={stat?.label || stat?.value || index} stat={stat} />
              ))}
            </dl>
          </div>
        ) : null}
      </div>

      {ctaHref && cta?.label ? (
        <div>
          <Button asChild variant={resolveButtonVariant(cta?.variant)}>
            <Link href={ctaHref}>{cta.label}</Link>
          </Button>
        </div>
      ) : null}
    </Section>
  );
}

function StatItem({ stat }: { stat: AboutSectionStat }) {
  const value = stat?.value?.trim();
  const label = stat?.label?.trim();
  const icon = resolveImage(stat?.icon);
  const iconAlt = stat?.icon?.alt?.trim() || "";

  return (
    <div className="flex flex-col gap-[calc(var(--flow-space)/6)]">
      <dt className="order-last flex items-center gap-[calc(var(--flow-space)/5)] text-[length:var(--font-tight)] uppercase tracking-[0.18em] text-muted-foreground">
        {icon.url ? (
          <Image
            src={icon.url}
            alt={iconAlt}
            aria-hidden={iconAlt ? undefined : true}
            width={icon.width || 32}
            height={icon.height || 32}
            className="h-6 w-6 shrink-0 object-contain opacity-80"
            placeholder={icon.lqip ? "blur" : undefined}
            blurDataURL={icon.lqip || undefined}
          />
        ) : null}
        <span>{label || (value ? "Stat" : "")}</span>
      </dt>
      <dd className="order-first text-balance text-[clamp(1.75rem,3vw+0.5rem,3.1rem)] font-semibold leading-[1.05] text-[color:var(--foreground)]">
        {value || "—"}
      </dd>
    </div>
  );
}

function resolveImage(image?: SanityImageAsset | SanityIconImage | null) {
  const url = image?.asset?.url?.trim() || null;
  const alt = image?.alt?.trim() || null;
  const lqip = image?.asset?.metadata?.lqip?.trim() || null;
  const width = image?.asset?.metadata?.dimensions?.width || undefined;
  const height = image?.asset?.metadata?.dimensions?.height || undefined;

  return {
    url,
    alt,
    lqip,
    width,
    height,
  };
}

function resolveHref(cta: AboutSectionData["cta"]) {
  const manual = cta?.href?.trim();
  if (manual) return manual;
  const slug = cta?.reference?.slug?.trim();
  if (slug) {
    const locale = cta.reference?.locale || "da";
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
