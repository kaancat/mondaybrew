import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroFeature",
  title: "Hero feature card",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "href", type: "string" }),
    defineField({ name: "metaLabel", type: "string" }),
    defineField({ name: "image", type: "imageWithAlt" }),
  ],
});
