import { buildSanityImage } from "@/lib/sanity-image";
import { ServicesSplit } from "./services-split.client";
import type {
  ServicesSplitCta,
  ServicesSplitMedia,
  ServicesSplitProps,
  ServicesSplitService,
  ServicesSplitTab,
} from "./services-split.types";

type SanityButton = {
  _key?: string;
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
  videoFile?: {
    asset?: {
      url?: string | null;
      mimeType?: string | null;
    } | null;
  } | null;
} | null;

type SanityServicesSplitService = {
  _key?: string;
  key?: { current?: string | null } | null;
  title?: string | null;
  detailTitle?: string | null;
  summary?: string | null;
  description?: string | null;
  media?: SanityServicesSplitMedia;
  ctas?: SanityButton[] | null;
} | null;

type SanityServicesSplitPillar = {
  label?: string | null;
  headline?: string | null;
  description?: string | null;
  services?: SanityServicesSplitService[] | null;
} | null;

export type ServicesSplitSectionData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  marketing?: SanityServicesSplitPillar;
  web?: SanityServicesSplitPillar;
};

export function isServicesSplitSection(
  section: { _type?: string } | null | undefined,
): section is ServicesSplitSectionData & { _type: "servicesSplit" } {
  return Boolean(section && section._type === "servicesSplit");
}

export function ServicesSplitSection(data: ServicesSplitSectionData) {
  const tabs = mapSanityPillars([
    { fallbackId: "marketing", fallbackLabel: "Marketing", pillar: data.marketing },
    { fallbackId: "web", fallbackLabel: "Web", pillar: data.web },
  ]);

  return (
    <ServicesSplit
      eyebrow={data.eyebrow || undefined}
      title={data.title || undefined}
      description={data.description || undefined}
      tabs={tabs.length ? tabs : undefined}
    />
  );
}

function mapSanityPillars(
  pillars: Array<{ fallbackId: string; fallbackLabel: string; pillar: SanityServicesSplitPillar | null | undefined }>,
): ServicesSplitTab[] {
  return pillars
    .map(({ fallbackId, fallbackLabel, pillar }) => mapSanityPillar(fallbackId, fallbackLabel, pillar))
    .filter((pillar): pillar is ServicesSplitTab => Boolean(pillar));
}

function mapSanityPillar(
  fallbackId: string,
  fallbackLabel: string,
  pillar: SanityServicesSplitPillar | null | undefined,
): ServicesSplitTab | null {
  const label = pillar?.label?.trim() || fallbackLabel;
  const headline = pillar?.headline?.trim();
  const description = pillar?.description?.trim();
  const baseId = slugify(pillar?.label?.trim() || fallbackId);

  const services = (pillar?.services ?? [])
    .map((service, index) => mapSanityService(service, baseId, index))
    .filter((service): service is ServicesSplitService => Boolean(service));

  if (!services.length) return null;

  return {
    id: baseId,
    label,
    headline,
    description,
    services,
  } satisfies ServicesSplitTab;
}

function mapSanityService(
  service: SanityServicesSplitService,
  pillarId: string,
  serviceIndex: number,
): ServicesSplitService | null {
  const title = service?.title?.trim();
  if (!title) return null;

  const slug = service?.key?.current?.trim();
  const rawId = slug || service?._key || `${pillarId}-${serviceIndex}`;
  const id = slugify(rawId);
  const media = mapServiceMedia(service?.media);
  const ctas = mapCtas(service?.ctas, id);

  return {
    id,
    title,
    detailTitle: service?.detailTitle?.trim() || undefined,
    summary: service?.summary || undefined,
    description: service?.description || undefined,
    media: media ?? null,
    ctas: ctas.length ? ctas : undefined,
  } satisfies ServicesSplitService;
}

function mapCtas(ctas: (SanityButton | null | undefined)[] | null | undefined, serviceId: string): ServicesSplitCta[] {
  return (ctas ?? []).reduce<ServicesSplitCta[]>((acc, cta, index) => {
    const label = cta?.label?.trim();
    const href = cta?.href?.trim();
    if (!label || !href) return acc;

    const style = selectCtaStyle(cta?.variant);
    const id = cta?._key?.trim() || slugify(`${serviceId}-cta-${index}`);

    acc.push({
      id,
      label,
      href,
      style,
    });

    return acc;
  }, []);
}

function mapServiceMedia(media?: SanityServicesSplitMedia | null): ServicesSplitMedia | undefined {
  if (!media) return undefined;

  const mode = media.mode || (media.videoUrl ? "video" : "image");

  if (mode === "video") {
    const fileSrc = media.videoFile?.asset?.url?.trim();
    const src = fileSrc || media.videoUrl?.trim();
    if (!src) return undefined;
    const poster = resolveImageWithAlt(media.poster, { width: 1200, quality: 70 });
    return {
      type: "video",
      src,
      poster: poster.url,
      fileType: media.videoFile?.asset?.mimeType || undefined,
    } satisfies ServicesSplitMedia;
  }

  const image = resolveImageWithAlt(media.image, { width: 1400, quality: 80 });
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
    const poster = resolveImageWithAlt(media.poster, { width: 1200, quality: 70 });
    return {
      type: "video",
      src: fallbackVideo,
      poster: poster.url,
    } satisfies ServicesSplitMedia;
  }

  return undefined;
}

function resolveImageWithAlt(image?: SanityImageWithAlt | null, opts?: { width?: number; quality?: number }) {
  if (!image) {
    return { url: undefined, alt: undefined, lqip: undefined };
  }
  const built = buildSanityImage(
    {
      alt: image.alt ?? undefined,
      image: image.image ?? undefined,
    },
    {
      width: opts?.width,
      quality: opts?.quality,
      fit: "max",
    },
  );

  return {
    url: built.src,
    alt: built.alt,
    lqip: built.blurDataURL,
  };
}

function selectCtaStyle(variant?: string | null): ServicesSplitCta["style"] {
  const value = variant?.toLowerCase();
  if (!value) return undefined;
  if (value === "secondary" || value === "outline" || value === "ghost") return "secondary";
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
