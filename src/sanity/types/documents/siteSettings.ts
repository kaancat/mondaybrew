import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "logo", type: "image" }),
    defineField({
      name: "logoOnDark",
      title: "Logo (dark backgrounds)",
      type: "image",
      description: "Optional logo variant optimized for dark UI surfaces like the header.",
    }),
    defineField({ name: "favicon", type: "image", description: "Shown in the browser tab." }),
    defineField({ name: "seo", type: "seo" }),
    defineField({
      name: "mainNavigation",
      title: "Main Navigation",
      type: "array",
      description: "Links shown in the header (left to right).",
      of: [{ type: "navigationSection" }],
    }),
    defineField({
      name: "headerCta",
      title: "Header CTA",
      type: "navigationLink",
      description: "Primary action button on the right side of the header.",
    }),
    defineField({ name: "footer", type: "array", of: [{ type: "button" }] }),
  ],
});
