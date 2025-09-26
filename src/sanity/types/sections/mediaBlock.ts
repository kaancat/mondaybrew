import { defineType, defineField } from "sanity";

export default defineType({
  name: "mediaBlock",
  title: "Media Block",
  type: "object",
  fields: [
    defineField({ name: "media", type: "videoAsset" }),
    defineField({ name: "caption", type: "string" }),
  ],
});

