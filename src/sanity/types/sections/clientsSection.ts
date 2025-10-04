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
      name: "logos",
      title: "Logos",
      type: "array",
      of: [{ type: "clientLogo" }],
      validation: (Rule) => Rule.min(8).max(60),
    }),
    defineField({ name: "version", type: "string", initialValue: "v1", hidden: true, readOnly: true }),
  ],
  preview: {
    select: { headline: "headline", count: "logos.length" },
    prepare({ headline, count }: { headline?: string; count?: number }) {
      return { title: headline || "Clients / Partners", subtitle: `${count || 0} logos` };
    },
  },
});

