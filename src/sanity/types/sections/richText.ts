import { defineType } from "sanity";

export default defineType({
  name: "richText",
  title: "Rich Text",
  type: "object",
  fields: [
    { name: "content", type: "array", of: [{ type: "block" }] },
  ],
});

