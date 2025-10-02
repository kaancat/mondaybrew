import type { ServicesSplitCta, ServicesSplitMedia, ServicesSplitService, ServicesSplitTab } from "./services-split.types";
import { ServicesSplit } from "./services-split.client";

import type { ServicesSplitProps } from "./services-split.types";

type SanityButton = {
  label?: string | null;
  href?: string | null;
  variant?: string | null;
} | null;

type SanityImageWithAlt = {
  alt?: string | null;
  image?: {
    asset?: {
      url?: string | null;
      metadata?: {
        lqip?: string | null;
      } | null;
    } | null;
  } | null;
} | null;

type SanityServicesSplitMedia = {
  mode?: string | null;
  image?: SanityImageWithAlt;
  videoUrl?: string | null;
  poster?: SanityImageWithAlt;
} | null;

type SanityServicesSplitService = {
  _key?: string;
  label?: string | null;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  media?: SanityServicesSplitMedia;
  primaryCta?: SanityButton;
  secondaryCta?: SanityButton;
} | null;

type SanityServicesSplitTab = {
  _key?: string;
  label?: string | null;
  services?: SanityServicesSplitService[] | null;
} | null;

export type ServicesSplitSectionData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  tabs?: SanityServicesSplitTab[] | null;
};

export function isServicesSplitSection(
  section: { _type?: string } | null | undefined,
): section is ServicesSplitSectionData & { _type: "servicesSplit" } {
  return Boolean(section && section._type === "servicesSplit");
}

export function ServicesSplitSection(data: ServicesSplitSectionData) {
  const mappedTabs = mapSanityTabs(data.tabs);

  return (
    <ServicesSplit
      eyebrow={data.eyebrow || undefined}
      title={data.title || undefined}
      description={data.description || undefined}
      tabs={mappedTabs.length ? mappedTabs : undefined}
    />
  );
}

function mapSanityTabs(tabs?: SanityServicesSplitTab[] | null): ServicesSplitTab[] {
  if (!tabs?.length) return [];

  const normalized = tabs
    .map((tab, tabIndex) => {
      const label = tab?.label?.trim();
      if (!label) return null;

      const idSource = tab?._key ? `${tab._key}` : `${label}-${tabIndex}`;
      const id = slugify(idSource);
      const services = (tab?.services ?? [])
        .map((service, serviceIndex) => mapSanityService(service, id, serviceIndex))
        .filter((service): service is ServicesSplitService => Boolean(service));

      if (!services.length) return null;

      return {
        id,
        label,
        services,
      } satisfies ServicesSplitTab;
    })
    .filter((tab): tab is ServicesSplitTab => Boolean(tab));

  return normalized;
}

function mapSanityService(
  service: SanityServicesSplitService,
  tabId: string,
  serviceIndex: number,
): ServicesSplitService | null {
  const label = service?.label?.trim();
  if (!label) return null;

  const idSource = service?._key ? `${service._key}` : `${tabId}-${label}-${serviceIndex}`;
  const id = slugify(idSource);
  const media = mapServiceMedia(service?.media);

  return {
    id,
    label,
    title: service?.title || undefined,
    summary: service?.summary || undefined,
    description: service?.description || undefined,
    media: media ?? null,
    primaryCta: mapButtonToCta(service?.primaryCta) ?? undefined,
    secondaryCta: mapButtonToCta(service?.secondaryCta, "secondary") ?? undefined,
  } satisfies ServicesSplitService;
}

function mapServiceMedia(media?: SanityServicesSplitMedia | null): ServicesSplitMedia | undefined {
  if (!media) return undefined;

  const mode = media.mode || (media.videoUrl ? "video" : "image");

  if (mode === "video") {
    const src = media.videoUrl?.trim();
    if (!src) return undefined;
    const poster = resolveImageWithAlt(media.poster);
    return {
      type: "video",
      src,
      poster: poster.url,
    } satisfies ServicesSplitMedia;
  }

  const image = resolveImageWithAlt(media.image);
  if (image.url) {
    return {
      type: "image",
      src: image.url,
      alt: image.alt,
      blurDataURL: image.lqip,
    } satisfies ServicesSplitMedia;
  }

  const fallbackVideo = media.videoUrl?.trim();
  if (fallbackVideo) {
    const poster = resolveImageWithAlt(media.poster);
    return {
      type: "video",
      src: fallbackVideo,
      poster: poster.url,
    } satisfies ServicesSplitMedia;
  }

  return undefined;
}

function resolveImageWithAlt(image?: SanityImageWithAlt | null) {
  return {
    url: image?.image?.asset?.url || undefined,
    alt: image?.alt || undefined,
    lqip: image?.image?.asset?.metadata?.lqip || undefined,
  };
}

function mapButtonToCta(button?: SanityButton, fallback: "primary" | "secondary" = "primary") {
  const label = button?.label?.trim();
  const href = button?.href?.trim();
  if (!label || !href) return undefined;

  const variant = selectCtaVariant(button?.variant, fallback);

  return {
    label,
    href,
    variant,
  } satisfies ServicesSplitCta;
}

function selectCtaVariant(variant?: string | null, fallback: "primary" | "secondary" = "primary") {
  const normalized = variant?.toLowerCase();
  if (!normalized) return fallback;
  if (["secondary", "outline", "ghost"].includes(normalized)) {
    return "secondary" as const;
  }
  return "primary";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export { ServicesSplit } from "./services-split.client";
export type { ServicesSplitProps };
export type { ServicesSplitMedia, ServicesSplitService, ServicesSplitTab, ServicesSplitCta };
