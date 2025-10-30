import { Section } from "@/components/layout/section";
import { TextImageSwitch } from "./text-image.switch.client";
import type { TextImageResolvedImage } from "./text-image.client";
import { buildSanityImage } from "@/lib/sanity-image";

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
    variant?: "default" | "tabs" | null;
    enableTabs?: boolean | null;
    eyebrow?: string | null;
    title?: string | null;
    body?: string | null;
    image?: SanityImageAsset;
    imagePosition?: "left" | "right" | null;
    tabs?: { label?: string | null; title?: string | null; body?: string | null }[] | null;
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
    variant,
    enableTabs,
    eyebrow,
    title,
    body,
    image,
    imagePosition,
    tabs,
    cta,
}: TextImageSectionData) {
    const resolvedImage = resolveImage(image);
    const position = imagePosition === "right" ? "right" : "left"; // Default to left

    // If tabs variant and tabs provided, render the interactive layout
    const wantsTabs = Boolean(variant === "tabs" || enableTabs || (Array.isArray(tabs) && tabs.length > 0));
    if (wantsTabs && tabs && tabs.length) {
        const safeTabs = tabs
            .map((t, i) => ({
                id: `tab-${i}`,
                label: (t.label || `0${i + 1}`).trim(),
                title: (t.title || "").trim(),
                body: (t.body || "").trim(),
            }))
            .filter((t) => t.label.length > 0 || t.title.length > 0 || t.body.length > 0);

        if (safeTabs.length) {
            return (
                <Section innerClassName="">
                    <TextImageSwitch
                        variant="tabs"
                        eyebrow={eyebrow?.trim() || undefined}
                        title={title?.trim() || undefined}
                        body={body?.trim() || undefined}
                        image={resolvedImage}
                        imagePosition={position}
                        tabs={safeTabs}
                        cta={buildCta(cta)}
                    />
                </Section>
            );
        }
    }

    return (
        <Section innerClassName="flex flex-col gap-[var(--flow-space)]">
            <TextImageSwitch
                variant={variant || "default"}
                eyebrow={eyebrow?.trim() || undefined}
                title={title?.trim() || undefined}
                body={body?.trim() || undefined}
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
    if (!image) return null;
    const built = buildSanityImage(
        {
            alt: image.alt ?? undefined,
            asset: image.asset ?? undefined,
        },
        { width: 1400, quality: 80 },
    );

    if (!built.src) {
        return null;
    }

    return {
        src: built.src,
        alt: built.alt ?? null,
        blurDataURL: built.blurDataURL ?? null,
        width: built.width,
        height: built.height,
    };
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
