import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "avatar", type: "image" }),
    defineField({ name: "bio", type: "text" }),
  ],
});

