import { defineField, defineType } from "sanity";

type ParentContext = {
  linkType?: "reference" | "manual";
};

type ImageValue = {
  image?: unknown;
};

export default defineType({
  name: "heroFeatureItem",
  title: "Hero feature item",
  type: "object",
  fieldsets: [
    { name: "content", title: "Content" },
    { name: "link", title: "Link" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "linkType",
      title: "Link type",
      type: "string",
      fieldset: "link",
      initialValue: "reference",
      options: {
        layout: "radio",
        list: [
          { title: "Link to CMS entry", value: "reference" },
          { title: "Manual URL", value: "manual" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reference",
      title: "Linked content",
      type: "reference",
      to: [{ type: "page" }, { type: "post" }, { type: "caseStudy" }],
      weak: true,
      fieldset: "link",
      hidden: ({ parent }) => (parent as ParentContext)?.linkType !== "reference",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const linkType = (context.parent as ParentContext | undefined)?.linkType;
          if (linkType === "reference" && !value) {
            return "Choose the document to link to.";
          }
          return true;
        }),
    }),
    defineField({
      name: "href",
      title: "Manual URL",
      type: "string",
      description: "Use for external or bespoke URLs. Include protocol for external links (https://).",
      fieldset: "link",
      hidden: ({ parent }) => (parent as ParentContext)?.linkType !== "manual",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const linkType = (context.parent as ParentContext | undefined)?.linkType;
          if (linkType !== "manual") return true;
          if (!value) {
            return "Provide a URL for manual cards.";
          }
          const normalized = value.trim();
          const allowed =
            normalized.startsWith("http://") ||
            normalized.startsWith("https://") ||
            normalized.startsWith("mailto:") ||
            normalized.startsWith("tel:") ||
            normalized.startsWith("/") ||
            normalized.startsWith("#");
          if (!allowed) {
            return "Start with https://, mailto:, tel:, /, or # for manual links.";
          }
          return true;
        }),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Shown on the card. For linked content, leave blank to inherit the document title.",
      fieldset: "content",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const linkType = (context.parent as ParentContext | undefined)?.linkType;
          if (linkType === "manual" && !value) {
            return "Title is required for manual cards.";
          }
          return true;
        }),
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      title: "Description",
      description: "Short supporting copy. Falls back to the linked document summary when left blank.",
      fieldset: "content",
    }),
    defineField({
      name: "metaLabel",
      type: "string",
      title: "Meta label",
      description: "Small label under the copy (e.g. ‘Latest entries’).",
      fieldset: "meta",
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      title: "Card image",
      description: "Upload to override the linked document image or provide art for manual cards.",
      validation: (Rule) =>
        Rule.custom((value: ImageValue | undefined, context) => {
          const linkType = (context.parent as ParentContext | undefined)?.linkType;
          if (linkType === "manual" && !value?.image) {
            return "Manual cards need an uploaded image.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      fallbackTitle: "reference.title",
      media: "image.image",
      metaLabel: "metaLabel",
      linkType: "linkType",
    },
    prepare(selection) {
      const { title, fallbackTitle, media, metaLabel, linkType } = selection as {
        title?: string;
        fallbackTitle?: string;
        metaLabel?: string;
        linkType?: string;
        media?: unknown;
      };
      return {
        title: title || fallbackTitle || "Untitled feature",
        subtitle: metaLabel || (linkType === "manual" ? "Manual" : "Linked content"),
        media,
      };
    },
  },
});
