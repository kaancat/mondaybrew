import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigationSection",
  title: "Navigation Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Type",
      type: "string",
      initialValue: "link",
      options: {
        list: [
          { title: "Simple link", value: "link" },
          { title: "Mega menu", value: "mega" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "navigationLink",
      hidden: ({ parent }) => parent?.variant !== "link",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const variant = (context.parent as { variant?: string } | undefined)?.variant;
          if (variant === "link" && !value) {
            return "Select a link";
          }
          return true;
        }),
    }),
    defineField({
      name: "groups",
      title: "Groups",
      type: "array",
      of: [{ type: "navigationGroup" }],
      hidden: ({ parent }) => parent?.variant !== "mega",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const variant = (context.parent as { variant?: string } | undefined)?.variant;
          if (variant === "mega" && (!value || value.length === 0)) {
            return "Add at least one group";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
    },
    prepare({ title, variant }) {
      return {
        title,
        subtitle: variant === "mega" ? "Mega menu" : "Link",
      };
    },
  },
});
