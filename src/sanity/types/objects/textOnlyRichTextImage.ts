import { defineType, defineField } from "sanity";

export default defineType({
  name: "textOnlyRichTextImage",
  title: "Rich Text + Image",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional title shown on the left side",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "string",
      options: {
        list: [
          { title: "Text first, then image", value: "textFirst" },
          { title: "Image first, then text", value: "imageFirst" },
        ],
        layout: "radio",
      },
      initialValue: "textFirst",
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
      rows: 6,
      description: "Main content text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      description: "Image shown in the same column as the text",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      body: "body",
      media: "image.image",
      order: "order",
    },
    prepare({ title, body, media, order }) {
      const orderLabel = order === "imageFirst" ? "🖼️ → 📝" : "📝 → 🖼️";
      return {
        title: title || "Rich Text + Image",
        subtitle: `${orderLabel} ${body ? body.substring(0, 40) + "..." : ""}`,
        media: media,
      };
    },
  },
});

