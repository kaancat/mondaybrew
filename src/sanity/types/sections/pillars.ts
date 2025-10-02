import { defineType, defineField } from "sanity";

const DEFAULT_GROUPS = [
  {
    key: "marketing",
    headline: "We help brands grow across the full funnel.",
    description: "From acquisition to retention, we plan and optimize the touchpoints that matter.",
    chips: ["Full-Funnel Performance", "Paid Search", "Paid Social", "E-Mail Marketing"],
    listLabel: "MARKETING",
    items: [
      { label: "Full-Funnel Performance", href: "/services#full-funnel" },
      { label: "Paid Search", href: "/services#paid-search" },
      { label: "Paid Social", href: "/services#paid-social" },
      { label: "E-Mail Marketing", href: "/services#email" },
    ],
  },
  {
    key: "web",
    headline: "We design and ship fast, resilient web experiences.",
    description: "Websites, products, and commerce—built to scale and easy to maintain.",
    chips: ["Hjemmesider", "Digital Products", "AI", "eCommerce"],
    listLabel: "WEB",
    items: [
      { label: "Hjemmesider", href: "/services#web" },
      { label: "Digital Products", href: "/services#digital-products" },
      { label: "AI", href: "/services#ai" },
      { label: "eCommerce", href: "/services#ecommerce" },
    ],
  },
];

export default defineType({
  name: "pillars",
  title: "Pillars — Marketing & Web",
  type: "object",
  fields: [
    defineField({
      name: "sectionTitle",
      title: "Section title",
      type: "string",
      description: "Optional overline displayed above the content.",
      initialValue: "Our Pillars — Marketing & Web",
    }),
    defineField({
      name: "groups",
      title: "Pillars",
      type: "array",
      of: [{ type: "pillarGroup" }],
      validation: (Rule) => Rule.required().min(2).max(2),
    }),
  ],
  initialValue: {
    sectionTitle: "Our Pillars — Marketing & Web",
    groups: DEFAULT_GROUPS,
  },
  preview: {
    select: {
      title: "sectionTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Pillars section",
        subtitle: "Marketing & Web",
      };
    },
  },
});
