import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesSplitService",
  title: "Service entry",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional alternate title for the detail panel. Defaults to the label.",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "servicesSplitMedia",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "button",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "button",
    }),
  ],
  preview: {
    select: {
      title: "label",
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
