import { defineType, defineField } from "sanity";

export default defineType({
  name: "pricing",
  title: "Pricing",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "plans", type: "array", of: [{
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "price", type: "string" },
        { name: "features", type: "array", of: [{ type: "string" }] },
        { name: "cta", type: "button" },
      ]
    }] }),
    defineField({ name: "note", type: "string" }),
  ],
});

