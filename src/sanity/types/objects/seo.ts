import { defineType, defineField } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", description: "Page title override." }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Open Graph image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAlt",
      title: "OG image alt text",
      type: "string",
      description: "Accessibility text for social previews.",
    }),
    defineField({
      name: "imageTitle",
      title: "OG image title",
      type: "string",
      description: "Optional override for social cards (Twitter title).",
    }),
    defineField({ name: "canonical", type: "url" }),
    defineField({ name: "noindex", type: "boolean" }),
  ],
});
