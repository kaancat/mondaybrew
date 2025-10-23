import { defineType, defineField } from "sanity";

export default defineType({
    name: "textImage",
    title: "Text & Image",
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
            name: "variant",
            title: "Variant",
            type: "string",
            options: {
                list: [
                    { title: "Default (no tabs)", value: "default" },
                    { title: "Tabbed", value: "tabs" },
                ],
                layout: "radio",
            },
            initialValue: "default",
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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "body",
            title: "Body text",
            type: "text",
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "imageWithAlt",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "tabs",
            title: "Tabs",
            type: "array",
            description: "Optional list of tabs shown in the text panel. Shown only when variant is 'Tabbed'.",
            hidden: ({ parent }) => parent?.variant !== "tabs",
            of: [
                defineField({
                    type: "object",
                    name: "tab",
                    fields: [
                        defineField({ name: "label", title: "Tab Label", type: "string", validation: (Rule) => Rule.required() }),
                        defineField({ name: "title", title: "Title", type: "string" }),
                        defineField({ name: "body", title: "Body", type: "text", rows: 4 }),
                    ],
                    preview: {
                        select: { title: "label" },
                        prepare({ title }) { return { title: title || "Tab" }; },
                    },
                }),
            ],
        }),
        defineField({
            name: "imagePosition",
            title: "Image Position",
            type: "string",
            options: {
                list: [
                    { title: "Left", value: "left" },
                    { title: "Right", value: "right" },
                ],
                layout: "radio",
            },
            initialValue: "left",
        }),
        defineField({
            name: "cta",
            title: "Call to Action",
            type: "button",
            description: "Optional call to action button",
        }),
    ],
    preview: {
        select: {
            title: "title",
            sectionId: "sectionId.current",
            eyebrow: "eyebrow",
            media: "image.image",
        },
        prepare({ title, sectionId, eyebrow, media }) {
            const parts = [];
            if (eyebrow) parts.push(eyebrow);
            if (sectionId) parts.push(`ID: ${sectionId}`);
            
            return {
                title: title || "Text & Image",
                subtitle: parts.length > 0 ? parts.join(" · ") : "No Section ID set",
                media: media,
            };
        },
    },
});
