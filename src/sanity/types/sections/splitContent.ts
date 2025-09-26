import { defineType, defineField } from "sanity";

export default defineType({
  name: "splitContent",
  title: "Split Content",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "media", type: "imageWithAlt" }),
    defineField({ name: "cta", type: "button" }),
  ],
});

