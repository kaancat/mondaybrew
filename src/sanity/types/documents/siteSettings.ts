import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "seo", type: "seo" }),
    defineField({ name: "nav", type: "array", of: [{ type: "button" }] }),
    defineField({ name: "footer", type: "array", of: [{ type: "button" }] }),
  ],
});

