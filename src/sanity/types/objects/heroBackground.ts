import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroBackground",
  title: "Hero background",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Optional MP4/Mux playback URL. If provided, it will play over the image.",
    }),
    defineField({
      name: "poster",
      title: "Video poster",
      type: "imageWithAlt",
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Accessibility description for the background media when needed.",
    }),
  ],
});
