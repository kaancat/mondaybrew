import { defineType, defineField } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "locale", type: "string", options: { list: ["da", "en"] }, initialValue: "da" }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        { type: "hero" },
        { type: "featureGrid" },
        { type: "logoCloud" },
        { type: "splitContent" },
        { type: "stats" },
        { type: "testimonials" },
        { type: "pricing" },
        { type: "faq" },
        { type: "richText" },
        { type: "mediaBlock" },
        { type: "ctaBanner" },
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
});

