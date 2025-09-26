import { defineType, defineField } from "sanity";

export default defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text" }),
    defineField({ name: "primary", type: "button" }),
    defineField({ name: "secondary", type: "button" }),
  ],
});

