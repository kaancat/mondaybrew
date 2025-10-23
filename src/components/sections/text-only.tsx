import { Section } from "@/components/layout/section";
import { TextOnlyClient } from "./text-only.client";

export type TextOnlySectionData = {
    sectionId?: { current?: string | null } | null;
    eyebrow?: string | null;
    title?: string | null;
    body?: string | null;
    cta?: {
        label?: string | null;
        href?: string | null;
        variant?: string | null;
    } | null;
    cta2?: {
        label?: string | null;
        href?: string | null;
        variant?: string | null;
    } | null;
};

const ALLOWED_BUTTON_VARIANTS = new Set(["default", "secondary", "outline", "ghost", "link"]);

/**
 * Text Only Section Component
 * Displays text content in a two-column layout with decorative accent line
 * 
 * Why: Provides a content block for text-heavy sections without images
 * Useful for mission statements, descriptions, or informational content
 */
export function TextOnlySection({
    sectionId,
    eyebrow,
    title,
    body,
    cta,
    cta2,
}: TextOnlySectionData) {
    const id = sectionId?.current?.trim() || undefined;

    return (
        <Section innerClassName="flex flex-col gap-[var(--flow-space)]">
            <TextOnlyClient
                sectionId={id}
                eyebrow={eyebrow?.trim()}
                title={title?.trim()}
                body={body?.trim()}
                cta={buildCta(cta)}
                cta2={buildCta(cta2)}
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
function buildCta(cta: TextOnlySectionData["cta"]) {
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

