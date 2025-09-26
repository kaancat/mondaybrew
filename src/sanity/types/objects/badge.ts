import { defineType, defineField } from "sanity";

export default defineType({
  name: "badge",
  title: "Badge",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
  ],
});

