import { defineType, defineField } from "sanity";

export default defineType({
  name: "stats",
  title: "Stats",
  type: "object",
  fields: [
    defineField({ name: "items", type: "array", of: [{
      type: "object",
      fields: [
        { name: "label", type: "string" },
        { name: "value", type: "string" },
      ]
    }] }),
  ],
});

