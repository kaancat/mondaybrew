import { Section } from "@/components/layout/section";
import MediaShowcaseClient, { type ShowcaseResolvedImage, type ShowcaseResolvedVideo, type ShowcaseStat } from "@/components/sections/media-showcase.client";

type SanityImageAsset = {
  alt?: string | null;
  image?: { asset?: { url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null } | null } | null;
  asset?: { url?: string | null; metadata?: { lqip?: string | null; dimensions?: { width?: number | null; height?: number | null } | null } | null } | null;
} | null;

type SanityMedia = {
  mode?: "image" | "video" | null;
  image?: SanityImageAsset;
  videoUrl?: string | null;
  videoFile?: { asset?: { url?: string | null; mimeType?: string | null } | null } | null;
  poster?: SanityImageAsset;
} | null;

export type MediaShowcaseSectionData = {
  sectionId?: { current?: string | null } | null;
  eyebrow?: string | null;
  headline?: string | null;
  alignment?: "start" | "center" | "end" | null;
  cta?: { label?: string | null; href?: string | null; reference?: { slug?: string | null; locale?: string | null } | null; variant?: string | null } | null;
  media?: SanityMedia;
  stats?: Array<{ value?: string | null; label?: string | null; icon?: SanityImageAsset } | null> | null;
};

function resolveImage(input?: SanityImageAsset | null): ShowcaseResolvedImage | null {
  const asset = input?.image?.asset || input?.asset;
  const url = asset?.url?.trim() || null;
  const alt = input?.alt?.trim?.() || null;
  const lqip = asset?.metadata?.lqip || null;
  const width = asset?.metadata?.dimensions?.width || undefined;
  const height = asset?.metadata?.dimensions?.height || undefined;
  if (!url && !alt) return null;
  return { url, alt, lqip, width, height };
}

function resolveVideo(input?: SanityMedia | null): ShowcaseResolvedVideo | null {
  if (!input || input.mode !== "video") return null;
  const url = input.videoFile?.asset?.url?.trim() || input.videoUrl?.trim() || null;
  if (!url) return null;
  const poster = resolveImage(input.poster ?? null);
  return { url, poster };
}

function resolveHref(cta: MediaShowcaseSectionData["cta"]) {
  const manual = cta?.href?.trim();
  if (manual) return manual;
  const slug = cta?.reference?.slug?.trim();
  if (slug) {
    const locale = cta?.reference?.locale || "da";
    return locale === "en" ? `/en/${slug}` : `/${slug}`;
  }
  return null;
}

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"]);
function resolveButtonVariant(variant?: string | null): "default" | "secondary" | "outline" | "ghost" | "link" {
  if (variant && ALLOWED_BUTTON_VARIANTS.has(variant)) return variant as "default" | "secondary" | "outline" | "ghost" | "link";
  return "default";
}

export default function MediaShowcaseSection({ sectionId, eyebrow, headline, alignment, cta, media, stats }: MediaShowcaseSectionData) {
  const id = sectionId?.current?.trim() || undefined;
  const image = media?.mode !== "video" ? resolveImage(media?.image ?? null) : null;
  const video = resolveVideo(media);
  const resolvedStats: ShowcaseStat[] = (stats ?? []).flatMap((s) => {
    const value = s?.value?.trim();
    const label = s?.label?.trim();
    const icon = s?.icon ? resolveImage(s.icon) : null;
    if (!value && !label && !icon?.url) return [];
    return [{ value, label, icon }];
  });

  const resolvedCta = (() => {
    const href = resolveHref(cta);
    if (!href || !cta?.label) return null;
    return { label: cta.label, href, variant: resolveButtonVariant(cta.variant) };
  })();

  return (
    <Section id={id} innerClassName="flow">
      <MediaShowcaseClient
        eyebrow={eyebrow?.trim()}
        headline={headline?.trim()}
        alignment={alignment ?? "start"}
        cta={resolvedCta}
        image={image}
        video={video}
        stats={resolvedStats}
      />
    </Section>
  );
}
