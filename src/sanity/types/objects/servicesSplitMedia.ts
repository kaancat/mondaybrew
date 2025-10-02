import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesSplitMedia",
  title: "Service media",
  type: "object",
  fields: [
    defineField({
      name: "mode",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      hidden: ({ parent }) => (parent as { mode?: string } | undefined)?.mode !== "image",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mode?: string } | undefined;
          const media = value as { image?: { asset?: unknown } } | undefined;
          if (parent?.mode === "image" && !media?.image?.asset) {
            return "Select an image";
          }
          return true;
        }),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      hidden: ({ parent }) => (parent as { mode?: string } | undefined)?.mode !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { mode?: string } | undefined;
          const url = value as string | undefined;
          if (parent?.mode === "video" && !url) {
            return "Enter a video URL";
          }
          return true;
        }).uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "imageWithAlt",
      description: "Optional poster image for the video",
      hidden: ({ parent }) => (parent as { mode?: string } | undefined)?.mode !== "video",
    }),
  ],
  preview: {
    select: {
      mode: "mode",
      image: "image.image",
      poster: "poster.image",
    },
    prepare({ mode, image, poster }: { mode?: string; image?: { asset?: { url?: string } }; poster?: { asset?: { url?: string } } }) {
      const title = mode === "video" ? "Video" : "Image";
      const subtitle = mode === "video" ? (poster?.asset?.url ? "Video + poster" : "Video URL") : image?.asset?.url ? "Image selected" : "Image missing";
      return {
        title,
        subtitle,
      };
    },
  },
});
