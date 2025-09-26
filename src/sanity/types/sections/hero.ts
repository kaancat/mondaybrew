import { defineType, defineField } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text" }),
    defineField({ name: "primary", type: "button" }),
    defineField({ name: "secondary", type: "button" }),
    defineField({ name: "media", type: "videoAsset" }),
  ],
});

