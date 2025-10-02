import { defineType, defineField } from "sanity";

export default defineType({
  name: "pillarServiceLink",
  title: "Service link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required().min(2).error("Add a label for the service"),
    }),
    defineField({
      name: "href",
      title: "Manual URL",
      type: "url",
      description: "Optional external or internal URL to open when the item is clicked.",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }).warning(
          "Use a valid URL or link to existing content.",
        ),
    }),
    defineField({
      name: "reference",
      title: "Link to content",
      type: "reference",
      to: [{ type: "page" }, { type: "post" }, { type: "caseStudy" }],
      description: "Pick a page, post, or case study to link to instead of a manual URL.",
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value) return true;
      if (value.href || value.reference) {
        return true;
      }
      return "Add a manual URL or pick content";
    }),
  preview: {
    select: {
      title: "label",
      referenceTitle: "reference.title",
    },
    prepare({ title, referenceTitle }) {
      return {
        title: title || referenceTitle || "Service",
        subtitle: referenceTitle ? "Links to CMS content" : undefined,
      };
    },
  },
});
