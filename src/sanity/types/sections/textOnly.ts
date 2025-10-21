import { defineType, defineField } from "sanity";

export default defineType({
    name: "textOnly",
    title: "Text Only",
    type: "object",
    fields: [
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
            subtitle: "eyebrow",
        },
        prepare({ title, subtitle }) {
            return {
                title: title || "Text Only",
                subtitle: subtitle ? `${subtitle}` : "No eyebrow",
            };
        },
    },
});
