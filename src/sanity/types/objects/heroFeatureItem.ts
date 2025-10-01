import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroFeatureItem",
  title: "Hero feature item",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "href", type: "string" }),
    defineField({ name: "metaLabel", type: "string" }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({
      name: "reference",
      title: "Linked content",
      type: "reference",
      to: [{ type: "page" }, { type: "post" }, { type: "caseStudy" }],
      weak: true,
    }),
  ],
});
