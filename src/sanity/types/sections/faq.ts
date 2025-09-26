import { defineType, defineField } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "items", type: "array", of: [{
      type: "object",
      fields: [
        { name: "q", title: "Question", type: "string" },
        { name: "a", title: "Answer", type: "text" },
      ]
    }] }),
  ],
});

