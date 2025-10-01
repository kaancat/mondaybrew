import { defineType, defineField } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({
      name: "background",
      title: "Background media",
      type: "heroBackground",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
          ],
          lists: [],
          marks: {
            annotations: [],
            decorators: [
              { title: "Italic", value: "em" },
              { title: "Strong", value: "strong" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().max(1),
    }),
    defineField({ name: "subheading", type: "text" }),
    defineField({ name: "helper", type: "string" }),
    defineField({ name: "cta", title: "CTA", type: "button" }),
    defineField({
      name: "feature",
      title: "Feature card",
      type: "heroFeature",
    }),
    // Legacy fields kept for backward compatibility with older hero content.
    defineField({ name: "primary", type: "button", hidden: true }),
    defineField({ name: "secondary", type: "button", hidden: true }),
    defineField({ name: "media", type: "imageWithAlt", hidden: true }),
  ],
});
