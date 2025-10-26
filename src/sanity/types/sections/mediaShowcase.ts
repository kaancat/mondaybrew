import { defineType, defineField } from "sanity";

/**
 * Media Showcase (Video/Image) section
 * - Supports either video (file or URL with optional poster) or image
 * - Renders an optional CTA in a top-center notch
 * - Renders up to four stats below the media
 */
export default defineType({
  name: "mediaShowcase",
  title: "Media Showcase (Video / Image)",
  type: "object",
  fields: [
    defineField({
      name: "sectionId",
      title: "Section ID (for navigation)",
      type: "slug",
      description: "Optional ID for this section. Used by breadcrumbs / in-page links.",
      options: { source: "headline", maxLength: 50 },
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alignment",
      title: "Headline alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "start" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "start",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "servicesSplitMedia",
      description: "Upload an image or a video (file or URL) with optional poster.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "button",
      description: "Shown in the top-center notch of the media card.",
    }),
    defineField({
      name: "stats",
      title: "Stats (max 4)",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "icon", title: "Icon (optional)", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] }),
          ],
          preview: {
            select: { title: "value", subtitle: "label", media: "icon" },
            prepare({ title, subtitle, media }) {
              return { title: title || "Stat", subtitle, media };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: { title: "headline", eyebrow: "eyebrow" },
    prepare({ title, eyebrow }) {
      return { title: title || "Media Showcase", subtitle: eyebrow };
    },
  },
});

