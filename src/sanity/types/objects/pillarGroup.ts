import { defineType, defineField } from "sanity";

export default defineType({
  name: "pillarGroup",
  title: "Pillar group",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Identifier",
      type: "string",
      description: "Used internally to keep track of the pillar. Example: marketing or web.",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "description",
      title: "Paragraph",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: "chips",
      title: "Service chips",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
    defineField({
      name: "listLabel",
      title: "Right column label",
      type: "string",
      description: "Displayed above the list (e.g. MARKETING).",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "items",
      title: "Service list",
      type: "array",
      of: [{ type: "pillarServiceLink" }],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
  ],
  preview: {
    select: {
      title: "headline",
      subtitle: "listLabel",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || subtitle || "Pillar",
        subtitle,
      };
    },
  },
});
