import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesSplitService",
  title: "Service",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Service title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "detailTitle",
      title: "Detail title",
      type: "string",
      description: "Optional title used in the right-hand detail panel. Defaults to the service title.",
    }),
    defineField({
      name: "key",
      title: "Key",
      type: "slug",
      options: {
        source: "title",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
      },
      description: "Used to create stable IDs for the frontend. Leave as generated unless you have a specific requirement.",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Supporting copy",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "servicesSplitMedia",
    }),
    defineField({
      name: "ctas",
      title: "CTAs",
      type: "array",
      of: [{ type: "button" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {
      title: "title",
      summary: "summary",
    },
    prepare({ title, summary }: { title?: string; summary?: string }) {
      return {
        title: title || "Service",
        subtitle: summary || undefined,
      };
    },
  },
});
