import { defineType, defineField } from "sanity";

export default defineType({
    name: "textImage",
    title: "Text & Image",
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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "string",
            description: "Optional subheading below the title",
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
            subtitle: "eyebrow",
            media: "image.image",
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || "Text & Image",
                subtitle: subtitle ? `${subtitle}` : "No eyebrow",
                media: media,
            };
        },
    },
});
