import { defineType, defineField } from "sanity";

export default defineType({
  name: "clientLogo",
  title: "Client Logo",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      options: { collapsible: true, collapsed: false },
    }),
  ],
  preview: {
    select: { title: "title", media: "image.image" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare(sel: any) {
      return { title: sel?.title || "Client Logo", media: sel?.media } as { title: string } & Record<string, unknown>;
    },
  },
});
