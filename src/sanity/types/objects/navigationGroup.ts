import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigationGroup",
  title: "Group",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Links",
      type: "array",
      of: [{ type: "navigationLink" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});

