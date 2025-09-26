import { defineType, defineField } from "sanity";

export default defineType({
  name: "videoAsset",
  title: "Video (Mux)",
  type: "object",
  fields: [
    defineField({ name: "muxAsset", type: "mux.video" }),
    defineField({ name: "poster", type: "image", options: { hotspot: true } }),
    defineField({ name: "captionVtt", type: "file" }),
  ],
});

