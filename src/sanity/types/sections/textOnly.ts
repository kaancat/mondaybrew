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
            description: "Optional ID for this section. Click 'Generate' to create from title. Used by breadcrumb navigation.",
            options: {
                source: "title",
                maxLength: 50,
            },
        }),
        defineField({
            name: "eyebrow",
            title: "Eyebrow",
            type: "string",
            description: "Small label above the title",
        }),
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            description: "Appears in the left column",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "string",
            description: "Optional subheading in the right column",
        }),
        defineField({
            name: "body",
            title: "Body text",
            type: "text",
            rows: 6,
            description: "Main content text in the right column",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "cta",
            title: "Primary CTA",
            type: "button",
            description: "Primary call to action button",
        }),
        defineField({
            name: "cta2",
            title: "Secondary CTA",
            type: "button",
            description: "Optional secondary call to action button",
        }),
    ],
    preview: {
        select: {
            title: "title",
            sectionId: "sectionId.current",
            eyebrow: "eyebrow",
        },
        prepare({ title, sectionId, eyebrow }) {
            const parts = [];
            if (eyebrow) parts.push(eyebrow);
            if (sectionId) parts.push(`ID: ${sectionId}`);
            
            return {
                title: title || "Text Only",
                subtitle: parts.length > 0 ? parts.join(" · ") : "No Section ID set",
            };
        },
    },
});
