import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonialCard",
  title: "Testimonial Card",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Image only", value: "image" },
          { title: "Quote only", value: "quote" },
          { title: "Image + Quote", value: "imageQuote" },
        ],
        layout: "radio",
      },
      initialValue: "quote",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "background", title: "Background color", type: "string", description: "Hex or CSS color. Leave empty to auto-pick a brand/neutral.", options: { list: ["#FF914D", "#F5F7FD", "#49444B", "#111111", "white"] } }),
    defineField({ name: "logo", title: "Logo (top-right)", type: "imageWithAlt" }),
    defineField({ name: "image", title: "Main image", type: "imageWithAlt" }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
    defineField({ name: "author", title: "Name", type: "string" }),
    defineField({ name: "role", title: "Title / Role", type: "string" }),
    defineField({ name: "cta", title: "CTA", type: "button" }),
  ],
  preview: {
    select: { title: "author", subtitle: "role", media: "logo.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Testimonial", subtitle, media };
    },
  },
});

