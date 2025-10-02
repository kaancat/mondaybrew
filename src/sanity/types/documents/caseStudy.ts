import { defineType, defineField } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({ name: "client", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "locale", type: "string", options: { list: ["da", "en"] }, initialValue: "da" }),
    defineField({ name: "summary", type: "text" }),
    defineField({
      name: "sections",
      title: "Sections",
      description: "Structured content blocks coming soon — use the summary field for now.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
});
