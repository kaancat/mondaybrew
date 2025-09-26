import { defineType, defineField } from "sanity";

export default defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "href", type: "string" }),
    defineField({ name: "variant", type: "string", initialValue: "default" }),
  ],
});

