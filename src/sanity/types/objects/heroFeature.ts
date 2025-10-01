import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroFeature",
  title: "Hero feature",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Cards",
      description:
        "Add one or more featured cards. Each card can link to CMS content or a manual URL, and you can override the image, title, and copy per card.",
      type: "array",
      of: [{ type: "heroFeatureItem" }],
      options: {
        layout: "grid",
        sortable: true,
      },
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
  ],
});
