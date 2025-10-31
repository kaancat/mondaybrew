import { defineType, defineField } from "sanity";

export default defineType({
  name: "textOnlyRichText",
  title: "Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional title shown on the left side",
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
      rows: 6,
      description: "Main content text shown on the right side",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      body: "body",
    },
    prepare({ title, body }) {
      return {
        title: title || "Rich Text",
        subtitle: body ? `${body.substring(0, 60)}...` : "No content",
      };
    },
  },
});

