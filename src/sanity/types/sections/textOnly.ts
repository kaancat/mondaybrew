import { defineType, defineField } from "sanity";

export default defineType({
    name: "textOnly",
    title: "Text Only",
    type: "object",
    fields: [
        defineField({
            name: "sectionId",
            title: "Section ID (for navigation)",
            type: "slug",
            description: "Optional ID for this section. Used by breadcrumb navigation.",
            options: {
                source: "eyebrow",
                maxLength: 50,
            },
        }),
        defineField({
            name: "eyebrow",
            title: "Eyebrow",
            type: "string",
            description: "Small label above the first section",
        }),
        defineField({
            name: "sections",
            title: "Content Sections",
            type: "array",
            description: "Add rich text, images, CTAs, and dividers in any order",
            of: [
                { type: "textOnlyRichText" },
                { type: "textOnlyRichTextImage" },
                { type: "textOnlyCta1" },
                { type: "textOnlyCta2" },
                { type: "textOnlyDivider" },
            ],
            validation: (Rule) => Rule.required().min(1),
        }),
    ],
    preview: {
        select: {
            eyebrow: "eyebrow",
            sectionId: "sectionId.current",
            sections: "sections",
        },
        prepare({ eyebrow, sectionId, sections }) {
            const parts = [];
            if (eyebrow) parts.push(eyebrow);
            if (sectionId) parts.push(`ID: ${sectionId}`);
            
            const count = sections?.length || 0;
            const subtitle = count > 0 ? `${count} section${count !== 1 ? 's' : ''}` : "No sections";
            
            return {
                title: eyebrow || "Text Only",
                subtitle: parts.length > 0 ? `${subtitle} · ${parts.join(" · ")}` : subtitle,
            };
        },
    },
});
