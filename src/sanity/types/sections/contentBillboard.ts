import { defineType, defineField } from "sanity";

/**
 * Content Billboard section
 * A large rectangular surface that can host flexible content
 * with either a themed background or an image.
 */
export default defineType({
  name: "contentBillboard",
  title: "Content Billboard",
  type: "object",
  fields: [
    defineField({ name: "sectionId", title: "Section ID (for navigation)", type: "string" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "backgroundMode",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "Theme color", value: "tone" },
          { title: "Image", value: "image" },
        ],
        layout: "radio",
      },
      initialValue: "tone",
    }),
    defineField({
      name: "tone",
      title: "Billboard color",
      type: "string",
      description: "Choose one of the predefined site tones",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Light Alt", value: "lightAlt" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => parent?.backgroundMode !== "tone",
      initialValue: "primary",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.backgroundMode !== "image",
    }),

    // Content model — focus on common use-cases now
    defineField({
      name: "contentType",
      title: "Content Type",
      type: "string",
      options: {
        list: [
          { title: "Quote", value: "quote" },
          { title: "Rich text", value: "richText" },
          { title: "CTA group", value: "ctas" },
          { title: "Newsletter (simple)", value: "newsletter" },
        ],
        layout: "radio",
      },
      initialValue: "quote",
    }),

    // Quote
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, hidden: ({ parent }) => parent?.contentType !== "quote" }),
    defineField({ name: "author", title: "Name", type: "string", hidden: ({ parent }) => parent?.contentType !== "quote" }),
    defineField({ name: "role", title: "Title / Role", type: "string", hidden: ({ parent }) => parent?.contentType !== "quote" }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt", hidden: ({ parent }) => parent?.contentType !== "quote" }),

    // Rich text
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: { decorators: [{ title: "Italic", value: "em" }, { title: "Strong", value: "strong" }] },
        },
      ],
      hidden: ({ parent }) => parent?.contentType !== "richText",
    }),

    // CTAs
    defineField({
      name: "ctas",
      title: "CTAs",
      type: "array",
      of: [{ type: "button" }],
      options: { sortable: true },
      hidden: ({ parent }) => parent?.contentType !== "ctas",
      validation: (Rule) => Rule.max(3),
    }),

    // Newsletter — simple heading/description; implement provider later
    defineField({ name: "heading", title: "Heading", type: "string", hidden: ({ parent }) => parent?.contentType !== "newsletter" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2, hidden: ({ parent }) => parent?.contentType !== "newsletter" }),
  ],
  preview: {
    select: { title: "eyebrow", mode: "backgroundMode", tone: "tone", ct: "contentType" },
    prepare({ title, mode, tone, ct }) {
      const subtitle = `${mode === "image" ? "Image" : tone || "primary"} · ${ct || "quote"}`;
      return { title: title || "Content Billboard", subtitle };
    },
  },
});

