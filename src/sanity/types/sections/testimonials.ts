import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonials",
  title: "Testimonials",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "items", type: "array", of: [{
      type: "object",
      fields: [
        { name: "quote", type: "text" },
        { name: "author", type: "string" },
        { name: "role", type: "string" },
      ]
    }] }),
  ],
});

