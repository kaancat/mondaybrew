import { Section } from "@/components/layout/section";
import { TextImageClient, type TextImageResolvedImage } from "./text-image.client";

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

export type TextImageSectionData = {
    eyebrow?: string | null;
    title?: string | null;
    body?: string | null;
    image?: SanityImageAsset;
    imagePosition?: "left" | "right" | null;
    cta?: {
        label?: string | null;
        href?: string | null;
        variant?: string | null;
    } | null;
};

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"]);

/**
 * Text and Image Section Component
 * Displays a flexible text + image layout with configurable image placement
 * 
 * Why: Provides a reusable content block for marketing/editorial content
 * where text and visual content need equal emphasis
 */
export function TextImageSection({
    eyebrow,
    title,
    body,
    image,
    imagePosition,
    cta,
}: TextImageSectionData) {
    const resolvedImage = resolveImage(image);
    const position = imagePosition === "right" ? "right" : "left"; // Default to left

    return (
        <Section innerClassName="flex flex-col gap-[var(--flow-space)]">
            <TextImageClient
                eyebrow={eyebrow?.trim()}
                title={title?.trim()}
                body={body?.trim()}
                image={resolvedImage}
                imagePosition={position}
                cta={buildCta(cta)}
            />
        </Section>
    );
}

/**
 * Resolves Sanity image asset to a clean image object
 * Extracts URL, alt text, LQIP blur, and dimensions
 */
function resolveImage(image?: SanityImageAsset | null): TextImageResolvedImage | null {
    const url = image?.asset?.url?.trim() || null;
    const alt = image?.alt?.trim() || null;
    const lqip = image?.asset?.metadata?.lqip?.trim() || null;
    const width = image?.asset?.metadata?.dimensions?.width || undefined;
    const height = image?.asset?.metadata?.dimensions?.height || undefined;

    if (!url) {
        return null;
    }

    return { url, alt, lqip, width, height };
}

/**
 * Resolves button variant to allowed values
 * Falls back to "default" if invalid
 */
function resolveButtonVariant(variant?: string | null): "default" | "secondary" | "outline" | "ghost" | "link" {
    if (variant && ALLOWED_BUTTON_VARIANTS.has(variant)) {
        return variant as "default" | "secondary" | "outline" | "ghost" | "link";
    }
    return "default";
}

/**
 * Builds CTA object with resolved href and variant
 * Returns null if label or href is missing
 */
function buildCta(cta: TextImageSectionData["cta"]) {
    const href = cta?.href?.trim();
    if (!cta?.label || !href) return null;
    return {
        label: cta.label,
        href,
        variant: resolveButtonVariant(cta.variant),
    } as const;
}

/**
 * Type guard to check if a section is a TextImageSection
 */
export function isTextImageSection(
    section: { _type?: string } | null | undefined,
): section is TextImageSectionData & { _type: "textImage" } {
    return Boolean(section && section._type === "textImage");
}

