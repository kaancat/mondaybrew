import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesSplitPillar",
  title: "Services pillar",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Tab label",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "headline",
      title: "Headline (shown when this tab is active)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Supporting paragraph",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "servicesSplitService" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "label",
      count: "services.length",
    },
    prepare({ title, count }: { title?: string; count?: number }) {
      return {
        title: title || "Pillar",
        subtitle: count ? `${count} services` : "No services",
      };
    },
  },
});
