import { defineType, defineField } from "sanity";

export default defineType({
  name: "ctaBanner",
  title: "CTA Banner",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text" }),
    defineField({ name: "cta", type: "button" }),
  ],
});

