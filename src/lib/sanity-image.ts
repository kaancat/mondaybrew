import type { ImageLoaderProps } from "next/image";

type Maybe<T> = T | null | undefined;

type SanityAssetLike = {
  url?: string | null;
  metadata?: {
    lqip?: string | null;
    dimensions?: {
      width?: number | null;
      height?: number | null;
      aspectRatio?: number | null;
    } | null;
  } | null;
};

type SanityImageLike = {
  alt?: string | null;
  asset?: SanityAssetLike | null;
  image?: {
    asset?: SanityAssetLike | null;
  } | null;
};

export type SanityImageSource = Maybe<SanityImageLike>;

export type ImageTransformOptions = {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "min" | "max";
  format?: "auto" | "jpg" | "png" | "webp" | "avif";
  quality?: number;
  dpr?: number;
};

export type NormalizedSanityImage = {
  src?: string;
  baseUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  blurDataURL?: string;
};

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";

function normalizeAsset(asset: Maybe<SanityAssetLike>) {
  const rawUrl = asset?.url?.trim();
  if (!rawUrl) return undefined;

  const baseUrl = rawUrl.split("?")[0];
  const dimensions = asset?.metadata?.dimensions ?? undefined;
  const width = dimensions?.width ?? undefined;
  const height = dimensions?.height ?? undefined;
  const aspectRatio = dimensions?.aspectRatio ?? (width && height ? width / height : undefined);
  const blurDataURL = asset?.metadata?.lqip ?? undefined;

  return {
    url: rawUrl,
    baseUrl,
    width,
    height,
    aspectRatio,
    blurDataURL,
  };
}

export function normalizeSanityImage(source: SanityImageSource): NormalizedSanityImage {
  if (!source) return {};

  const directAsset = source.asset ?? source.image?.asset;
  const asset = normalizeAsset(directAsset);
  return {
    src: asset?.url,
    baseUrl: asset?.baseUrl,
    width: asset?.width,
    height: asset?.height,
    aspectRatio: asset?.aspectRatio,
    blurDataURL: asset?.blurDataURL,
    alt: source.alt ?? undefined,
  } satisfies NormalizedSanityImage;
}

export function buildSanityImageUrl(
  source: SanityImageSource,
  { width, height, fit = "max", format = "auto", quality = 75, dpr = 1 }: ImageTransformOptions = {},
): string | undefined {
  const normalized = normalizeSanityImage(source);
  const baseUrl = normalized.baseUrl;
  if (!baseUrl) return undefined;

  const url = new URL(baseUrl, "https://cdn.sanity.io/");

  // Sanity asset URLs already include the full path. If the url we received is absolute, reuse it directly.
  if (url.origin !== "https://cdn.sanity.io") {
    try {
      const absolute = new URL(baseUrl);
      absolute.searchParams.set("auto", format === "auto" ? "format" : format);
      if (width) absolute.searchParams.set("w", Math.round(width * dpr).toString());
      if (height) absolute.searchParams.set("h", Math.round(height * dpr).toString());
      if (fit) absolute.searchParams.set("fit", fit);
      if (quality) absolute.searchParams.set("q", Math.min(Math.max(Math.round(quality), 30), 100).toString());
      return absolute.toString();
    } catch {
      return normalized.src;
    }
  }

  const params = url.searchParams;
  params.set("auto", format === "auto" ? "format" : format);
  if (width) params.set("w", Math.round(width * dpr).toString());
  if (height) params.set("h", Math.round(height * dpr).toString());
  if (fit) params.set("fit", fit);
  if (quality) params.set("q", Math.min(Math.max(Math.round(quality), 30), 100).toString());

  return url.toString();
}

export function buildSanitySrcSet(
  source: SanityImageSource,
  widths: number[],
  options: Omit<ImageTransformOptions, "width"> = {},
): string | undefined {
  if (!widths.length) return undefined;
  const entries = widths.map((size) => {
    const url = buildSanityImageUrl(source, { ...options, width: size });
    return url ? `${url} ${size}w` : undefined;
  });
  const validEntries = entries.filter((entry): entry is string => Boolean(entry));
  return validEntries.length ? validEntries.join(", ") : undefined;
}

export function getSanityImageDimensions(source: SanityImageSource) {
  const normalized = normalizeSanityImage(source);
  return {
    width: normalized.width,
    height: normalized.height,
    aspectRatio: normalized.aspectRatio,
  };
}

export function getSanityBlurData(source: SanityImageSource): string | undefined {
  return normalizeSanityImage(source).blurDataURL;
}

export function getSanityAssetPath(source: SanityImageSource): string | undefined {
  const normalized = normalizeSanityImage(source);
  if (!normalized.baseUrl) return undefined;
  try {
    const url = new URL(normalized.baseUrl);
    return url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
  } catch {
    return normalized.baseUrl?.replace(/^https?:\/\//, "");
  }
}

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  const path = src.startsWith("http") ? src : `https://cdn.sanity.io/${src.replace(/^\//, "")}`;
  const url = new URL(path);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  url.searchParams.set("w", String(width));
  if (quality) {
    url.searchParams.set("q", String(Math.min(Math.max(Math.round(quality), 30), 100)));
  }
  return url.toString();
}

export function getSanityProjectDetails() {
  return {
    projectId: SANITY_PROJECT_ID ?? null,
    dataset: SANITY_DATASET ?? null,
  };
}

export type BuiltSanityImage = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  blurDataURL?: string;
};

export function buildSanityImage(
  source: SanityImageSource,
  options: ImageTransformOptions = {},
): BuiltSanityImage {
  const normalized = normalizeSanityImage(source);
  if (!normalized.baseUrl && !normalized.src) {
    return {};
  }
  const src = buildSanityImageUrl(source, options) ?? normalized.src;
  const width = options.width ?? normalized.width;
  const height = options.height ?? normalized.height;
  return {
    src,
    alt: normalized.alt,
    width,
    height,
    aspectRatio: normalized.aspectRatio,
    blurDataURL: normalized.blurDataURL,
  } satisfies BuiltSanityImage;
}
