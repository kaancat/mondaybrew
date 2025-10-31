import { defineType, defineField } from "sanity";

export default defineType({
  name: "textOnlyCta2",
  title: "CTA - 2 Buttons",
  type: "object",
  fields: [
    defineField({
      name: "button1",
      title: "First Button",
      type: "button",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "button2",
      title: "Second Button",
      type: "button",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      label1: "button1.label",
      label2: "button2.label",
    },
    prepare({ label1, label2 }) {
      return {
        title: `CTA: ${label1 || "Button 1"} + ${label2 || "Button 2"}`,
        subtitle: "2 buttons",
      };
    },
  },
});

