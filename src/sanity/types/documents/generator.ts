import { defineType, defineField } from "sanity";

export default defineType({
  name: "generator",
  title: "Programmatic Generator",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "collection", type: "string" }),
    defineField({ name: "dimensions", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "template", type: "array", of: [
      { type: "hero" }, { type: "richText" }, { type: "faq" }, { type: "ctaBanner" }
    ] }),
  ],
});

