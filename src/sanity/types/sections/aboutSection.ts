import { defineField, defineType } from "sanity";

const mockStats = [
  { _key: "stat-experience", label: "Digital specialists on the core team", value: "15+" },
  { _key: "stat-products", label: "Products launched across Europe", value: "120" },
  { _key: "stat-nps", label: "Average client NPS over the past year", value: "72" },
];

export default defineType({
  name: "aboutSection",
  title: "About (Glass overlay)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required().min(6).warning("Consider a descriptive headline."),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(24).warning("Write at least a short paragraph."),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text", validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      validation: (Rule) => Rule.min(1).max(4),
      of: [
        defineField({
          name: "stat",
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "icon",
              title: "Icon (optional)",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
            }),
          ],
          preview: {
            select: { label: "label", value: "value" },
            prepare({ label, value }) {
              return {
                title: value || "Stat",
                subtitle: label,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA (optional)",
      type: "button",
      description: "Optional call-to-action rendered below the image.",
    }),
  ],
  preview: {
    select: { headline: "headline", eyebrow: "eyebrow", stats: "stats" },
    prepare({ headline, eyebrow, stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      return {
        title: headline || "About section",
        subtitle: [eyebrow, count ? `${count} stats` : null].filter(Boolean).join(" • "),
      };
    },
  },
  initialValue: {
    eyebrow: "About mondaybrew",
    headline: "We build digital experiences that move the metrics you care about",
    subheading:
      "Strategy, engineering, design, and growth sit under one roof—so we can translate your ambition into experiments, launches, and optimizations that compound over time.",
    stats: mockStats,
  },
});
