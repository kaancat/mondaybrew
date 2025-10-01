import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroFeature",
  title: "Hero feature",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "heroFeatureItem" }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "title",
      type: "string",
      hidden: ({ parent }) => Boolean(parent?.items?.length),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      hidden: ({ parent }) => Boolean(parent?.items?.length),
    }),
    defineField({
      name: "href",
      type: "string",
      hidden: ({ parent }) => Boolean(parent?.items?.length),
    }),
    defineField({
      name: "metaLabel",
      type: "string",
      hidden: ({ parent }) => Boolean(parent?.items?.length),
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      hidden: ({ parent }) => Boolean(parent?.items?.length),
    }),
    defineField({
      name: "reference",
      title: "Linked content",
      type: "reference",
      to: [{ type: "page" }, { type: "post" }, { type: "caseStudy" }],
      weak: true,
      hidden: ({ parent }) => Boolean(parent?.items?.length),
    }),
  ],
});
