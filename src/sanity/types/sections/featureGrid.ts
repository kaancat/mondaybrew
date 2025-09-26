import { defineType, defineField } from "sanity";

export default defineType({
  name: "featureGrid",
  title: "Feature Grid",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "items", type: "array", of: [{
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "body", type: "text" },
        { name: "icon", type: "string" },
      ]
    }] }),
  ],
});

