import { defineType, defineField } from "sanity";

const homeIcon = () => "🏠";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "isHome",
      title: "Homepage",
      type: "boolean",
      description: "Markér hvis dette er forsiden.",
      initialValue: false,
    }),
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
        { type: "pillars" },
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title", isHome: "isHome" },
    prepare({ title, isHome }: { title?: string; isHome?: boolean }) {
      return {
        title,
        subtitle: isHome ? "Homepage" : undefined,
        media: isHome ? homeIcon : undefined,
      };
    },
  },
});
