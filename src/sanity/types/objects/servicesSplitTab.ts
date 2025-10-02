import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesSplitTab",
  title: "Services pillar",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
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
