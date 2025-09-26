import { defineType, defineField } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "canonical", type: "url" }),
    defineField({ name: "noindex", type: "boolean" }),
  ],
});

