import { Section } from "@/components/layout/section";
import { TextOnlyClient } from "./text-only.client";

type ButtonData = {
    label?: string | null;
    href?: string | null;
    variant?: string | null;
} | null;

type RichTextSection = {
    _type: "textOnlyRichText";
    _key: string;
    title?: string | null;
    body?: string | null;
};

type RichTextImageSection = {
    _type: "textOnlyRichTextImage";
    _key: string;
    title?: string | null;
    order?: "textFirst" | "imageFirst" | null;
    body?: string | null;
    image?: {
        alt?: string | null;
        image?: {
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
    } | null;
};

type Cta1Section = {
    _type: "textOnlyCta1";
    _key: string;
    button?: ButtonData;
};

type Cta2Section = {
    _type: "textOnlyCta2";
    _key: string;
    button1?: ButtonData;
    button2?: ButtonData;
};

type DividerSection = {
    _type: "textOnlyDivider";
    _key: string;
    style?: "solid" | "dashed" | "dotted" | null;
    width?: "full" | "constrained" | null;
};

type TextOnlyContentSection = RichTextSection | RichTextImageSection | Cta1Section | Cta2Section | DividerSection;

export type TextOnlySectionData = {
    eyebrow?: string | null;
    sections?: TextOnlyContentSection[] | null;
};

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"]);

/**
 * Text Only Section Component
 * Displays flexible text content with rich text, CTAs, and dividers
 * 
 * Why: Provides a flexible content block for text-heavy sections
 * Allows mixing of text, buttons, and dividers in any order
 */
export function TextOnlySection({
    eyebrow,
    sections,
}: TextOnlySectionData) {
    if (!sections || sections.length === 0) {
        return null;
    }

    const mappedSections = sections.map((section) => {
        switch (section._type) {
            case "textOnlyRichText":
                return {
                    _key: section._key,
                    type: "richText" as const,
                    title: section.title?.trim(),
                    body: section.body?.trim(),
                };
            case "textOnlyRichTextImage":
                const imageUrl = section.image?.image?.asset?.url;
                if (!imageUrl) return null;
                return {
                    _key: section._key,
                    type: "richTextImage" as const,
                    title: section.title?.trim(),
                    order: section.order || "textFirst",
                    body: section.body?.trim(),
                    image: {
                        url: imageUrl,
                        alt: section.image?.alt || section.title || "Image",
                        lqip: section.image?.image?.asset?.metadata?.lqip,
                        width: section.image?.image?.asset?.metadata?.dimensions?.width,
                        height: section.image?.image?.asset?.metadata?.dimensions?.height,
                    },
                };
            case "textOnlyCta1":
                return {
                    _key: section._key,
                    type: "cta1" as const,
                    button: buildCta(section.button),
                };
            case "textOnlyCta2":
                return {
                    _key: section._key,
                    type: "cta2" as const,
                    button1: buildCta(section.button1),
                    button2: buildCta(section.button2),
                };
            case "textOnlyDivider":
                return {
                    _key: section._key,
                    type: "divider" as const,
                    style: section.style || "solid",
                    width: section.width || "full",
                };
            default:
                return null;
        }
    }).filter(Boolean);

    return (
        <Section innerClassName="flex flex-col gap-[var(--flow-space)]">
            <TextOnlyClient
                eyebrow={eyebrow?.trim()}
                sections={mappedSections}
            />
        </Section>
    );
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
function buildCta(cta: ButtonData) {
    const href = cta?.href?.trim();
    if (!cta?.label || !href) return null;
    return {
        label: cta.label,
        href,
        variant: resolveButtonVariant(cta.variant),
    } as const;
}

/**
 * Type guard to check if a section is a TextOnlySection
 */
export function isTextOnlySection(
    section: { _type?: string } | null | undefined,
): section is TextOnlySectionData & { _type: "textOnly" } {
    return Boolean(section && section._type === "textOnly");
}

