import { defineType, defineField } from "sanity";

export default defineType({
  name: "imageWithAlt",
  title: "Image with Alt",
  type: "object",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "alt", type: "string" }),
  ],
});

