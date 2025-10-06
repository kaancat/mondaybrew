import { defineType, defineField } from "sanity";

export default defineType({
  name: "clientsSection",
  title: "Clients / Partners",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 3 }),
    defineField({
      name: "forceBlackLogos",
      title: "Force monochrome black logos",
      type: "boolean",
      description: "Applies a filter so uploaded logos render as solid black regardless of original color.",
      initialValue: true,
    }),
    defineField({
      name: "more",
      title: "More link (final cell)",
      type: "button",
      description: "Controls the final 'Many more' cell. Leave empty to hide it.",
      initialValue: { label: "+ Many more →", href: "/cases", variant: "link" },
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [{ type: "clientLogo" }],
      validation: (Rule) => Rule.min(8).max(60),
    }),
    defineField({ name: "version", type: "string", initialValue: "v1", hidden: true, readOnly: true }),
  ],
  preview: {
    select: { headline: "headline", count: "logos.length", force: "forceBlackLogos" },
    prepare({ headline, count, force }: { headline?: string; count?: number; force?: boolean }) {
      const tone = force ? "• black logos" : "• original colors";
      return { title: headline || "Clients / Partners", subtitle: `${count || 0} logos ${tone}` };
    },
  },
});
