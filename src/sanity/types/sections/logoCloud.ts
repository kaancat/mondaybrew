import { defineType, defineField } from "sanity";

export default defineType({
  name: "logoCloud",
  title: "Logo Cloud",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "logos", type: "array", of: [{ type: "imageWithAlt" }] }),
  ],
});

