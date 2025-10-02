import { defineField, defineType } from "sanity";

const marketingServicesInitial = [
  {
    _key: "marketing-full-funnel",
    title: "Full-Funnel Performance",
    summary:
      "Campaign architecture that follows your customer from awareness to retention with measurable milestones along the way.",
    description:
      "We design experiments and reporting loops that connect every stage of the funnel, so we can re-invest in what compounds.",
    media: { mode: "image" },
    ctas: [
      { _key: "marketing-full-funnel-primary", label: "Explore marketing", href: "#", variant: "default" },
      { _key: "marketing-full-funnel-secondary", label: "Book intro call", href: "#", variant: "secondary" },
    ],
  },
  {
    _key: "marketing-paid-search",
    title: "Paid Search",
    summary:
      "High-intent capture on Google and Microsoft Ads with creative testing, negative keyword hygiene, and live dashboards.",
    description:
      "From keyword mining to smart bidding calibration, we keep your account efficient while scaling profitable conversions.",
    media: { mode: "image" },
    ctas: [{ _key: "marketing-paid-search-primary", label: "Start a campaign", href: "#", variant: "default" }],
  },
  {
    _key: "marketing-paid-social",
    title: "Paid Social",
    summary:
      "Stories and feeds that convert. We iterate fast across Meta, TikTok, and LinkedIn with creative sprints and cohort reporting.",
    description:
      "Lean into creative volume and audience insights to keep your acquisition curve healthy across every platform.",
    media: { mode: "image" },
    ctas: [{ _key: "marketing-paid-social-primary", label: "See social playbook", href: "#", variant: "default" }],
  },
  {
    _key: "marketing-email",
    title: "E-Mail Marketing",
    summary:
      "Lifecycle flows, broadcast campaigns, and segmentation that keeps customers moving without feeling spammed.",
    description:
      "Automations and newsletters tuned for retention—mixing personalization, testing, and deliverability best practice.",
    media: { mode: "image" },
    ctas: [{ _key: "marketing-email-primary", label: "Review lifecycle", href: "#", variant: "default" }],
  },
];

const webServicesInitial = [
  {
    _key: "web-sites",
    title: "Hjemmesider",
    summary:
      "Conversion-first marketing sites built with Next.js, tuned for performance, localization, and a design system you can scale.",
    description:
      "Launch a flagship experience with CMS workflows, modular sections, and analytics wired in from day one.",
    media: { mode: "image" },
    ctas: [
      { _key: "web-sites-primary", label: "Plan your build", href: "#", variant: "default" },
      { _key: "web-sites-secondary", label: "See case studies", href: "#", variant: "secondary" },
    ],
  },
  {
    _key: "web-crm",
    title: "CRM",
    summary:
      "Implementations and automations that keep your pipeline visible and optimised across marketing and sales teams.",
    description:
      "We audit, migrate, and extend tools like HubSpot and Salesforce so your data syncs cleanly across the stack.",
    media: { mode: "image" },
    ctas: [{ _key: "web-crm-primary", label: "Map your CRM", href: "#", variant: "default" }],
  },
  {
    _key: "web-ai",
    title: "AI",
    summary:
      "Pragmatic AI integrations powered by your real workflows—assistants, automation, and data loops that actually save time.",
    description:
      "Experiment quickly with prototypes, then harden the winners into production features with clear guardrails.",
    media: { mode: "image" },
    ctas: [{ _key: "web-ai-primary", label: "Workshop ideas", href: "#", variant: "default" }],
  },
  {
    _key: "web-ecommerce",
    title: "eCommerce",
    summary:
      "Composable commerce experiences with fast product discovery, checkout clarity, and analytics wired in from day one.",
    description:
      "Optimise merchandising, PDP storytelling, and retention journeys with a modern commerce stack.",
    media: { mode: "image" },
    ctas: [{ _key: "web-ecommerce-primary", label: "Optimise store", href: "#", variant: "default" }],
  },
];

export default defineType({
  name: "servicesSplit",
  title: "Services split",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "marketing",
      title: "Marketing tab",
      type: "servicesSplitPillar",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "web",
      title: "Web tab",
      type: "servicesSplitPillar",
      validation: (Rule) => Rule.required(),
    }),
  ],
  initialValue: {
    eyebrow: "Our Pillars",
    title: "Expert care tailored to how your brand grows.",
    description:
      "Two teams, one partnership. Switch between Marketing and Web to explore the specialist services we bring together.",
    marketing: {
      label: "Marketing",
      headline: "We help brands grow across the full funnel.",
      description: "From acquisition to retention, we plan and optimize the touchpoints that matter.",
      services: marketingServicesInitial,
    },
    web: {
      label: "Web",
      headline: "We design and ship fast, resilient web experiences.",
      description: "Websites, products, and commerce—built to scale and easy to maintain.",
      services: webServicesInitial,
    },
  },
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title?: string }) {
      return {
        title: title || "Services split",
        subtitle: "Marketing & Web",
      };
    },
  },
});
