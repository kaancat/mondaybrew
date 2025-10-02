import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesSplit",
  title: "Services split",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Paragraph",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tabs",
      title: "Pillars",
      type: "array",
      of: [{ type: "servicesSplitTab" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      firstTab: "tabs.0.label",
    },
    prepare({ title, firstTab }: { title?: string; firstTab?: string }) {
      return {
        title: title || "Services split",
        subtitle: firstTab ? `Starts with ${firstTab}` : "Configure pillars",
      };
    },
  },
});
