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
    defineField({
      name: "megaMenuHeadline",
      title: "Mega Menu Headline",
      type: "string",
      description: "Main headline shown at the top of the mega menu (desktop only)",
      placeholder: "e.g., HIGHLIGHT FEATURE",
      hidden: ({ parent }) => parent?.variant !== "mega",
    }),
    defineField({
      name: "megaMenuDescription",
      title: "Mega Menu Description",
      type: "string",
      description: "Description text shown below the headline (desktop only)",
      placeholder: "e.g., Performance på tværs af hele funnel'en.",
      hidden: ({ parent }) => parent?.variant !== "mega",
    }),
    defineField({
      name: "featuredCases",
      title: "Featured Cases",
      type: "array",
      description: "Case studies to showcase in the mega menu carousel (desktop only, max 3 recommended)",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      hidden: ({ parent }) => parent?.variant !== "mega",
      validation: (Rule) => Rule.max(5),
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
