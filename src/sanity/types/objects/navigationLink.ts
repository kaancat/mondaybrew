import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigationLink",
  title: "Navigation Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description: "Optional helper text shown in mega menu panels.",
    }),
    defineField({
      name: "reference",
      title: "Internal reference",
      type: "reference",
      to: [{ type: "page" }, { type: "post" }, { type: "caseStudy" }],
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: "href",
      title: "External URL",
      type: "string",
      description: "Used if no internal reference is selected (accepts absolute or relative URLs).",
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value) return true;
      const hasRef = Boolean(value.reference);
      const hasHref = Boolean(value.href);
      return hasRef || hasHref || "Select a reference or provide an external URL";
    }),
  preview: {
    select: {
      title: "label",
      subtitle: "href",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle || "Internal link",
      };
    },
  },
});
