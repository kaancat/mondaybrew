import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonialsMarquee",
  title: "Testimonials — Full Page Marquee",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "What our clients say" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 2 }),
    defineField({
      name: "top",
      title: "Top row items",
      type: "array",
      of: [{ type: "testimonialCard" }],
      validation: (Rule) => Rule.min(3),
    }),
    defineField({
      name: "bottom",
      title: "Bottom row items",
      type: "array",
      of: [{ type: "testimonialCard" }],
      validation: (Rule) => Rule.min(3),
    }),
    defineField({ name: "speedTop", title: "Speed (top)", type: "number", description: "Pixels/second (default 30)", initialValue: 30 }),
    defineField({ name: "speedBottom", title: "Speed (bottom)", type: "number", description: "Pixels/second (default 24)", initialValue: 24 }),
  ],
  preview: {
    select: { headline: "headline", top: "top.length", bottom: "bottom.length" },
    prepare({ headline, top, bottom }) {
      return { title: headline || "Testimonials", subtitle: `${top || 0} + ${bottom || 0} items` };
    },
  },
});

