import { defineType, defineField } from "sanity";

export default defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "href", type: "string" }),
    defineField({
      name: "reference",
      title: "Internal reference",
      type: "reference",
      to: [{ type: "page" }, { type: "post" }, { type: "caseStudy" }],
      options: { disableNew: true },
    }),
    defineField({ name: "variant", type: "string", initialValue: "default" }),
  ],
});
