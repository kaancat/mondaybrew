import { defineType, defineField } from "sanity";

export default defineType({
  name: "caseStudyCarousel",
  title: "Case Study Carousel",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            annotations: [],
            decorators: [
              { title: "Italic", value: "em" },
              { title: "Strong", value: "strong" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Optional short description shown under the heading.",
    }),
    defineField({
      name: "explore",
      title: "Explore link",
      type: "button",
      description: "Optional link shown top‑right (e.g. ‘Explore all cases’).",
    }),
    defineField({
      name: "initialIndex",
      title: "Initial index",
      type: "number",
      description: "Optional deep‑link into a specific slide (0‑based).",
      validation: (Rule) => Rule.min(0),
    }),
    // Optional content area similar to Hero feature cards
    defineField({
      name: "feature",
      title: "Feature card",
      type: "heroFeature",
      description: "Optional content block rendered below the heading and above the carousel.",
    }),
    // Keep a hidden version field for migrations
    defineField({ name: "version", type: "string", initialValue: "v1", hidden: true, readOnly: true }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow" },
    prepare({ headline, eyebrow }: { headline?: Array<{ children?: Array<{ text?: string }> }>; eyebrow?: string }) {
      const first = headline?.[0]?.children?.[0]?.text || "Case Study Carousel";
      return { title: first, subtitle: eyebrow };
    },
  },
});
