import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "locale", type: "string", options: { list: ["da", "en"] }, initialValue: "da" }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "date", type: "datetime" }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", type: "seo" }),
  ],
});

