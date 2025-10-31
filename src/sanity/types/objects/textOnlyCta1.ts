import { defineType, defineField } from "sanity";

export default defineType({
  name: "textOnlyCta1",
  title: "CTA - 1 Button",
  type: "object",
  fields: [
    defineField({
      name: "button",
      title: "Button",
      type: "button",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      label: "button.label",
      href: "button.href",
    },
    prepare({ label, href }) {
      return {
        title: `CTA: ${label || "No label"}`,
        subtitle: href || "No link",
      };
    },
  },
});

