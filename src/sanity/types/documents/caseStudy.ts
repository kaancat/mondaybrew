import { defineType, defineField } from "sanity";

export default defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    {
      name: "listing",
      title: "📋 Listing Card (shown on /cases)",
      default: true,
    },
    {
      name: "individual",
      title: "📄 Individual Page (shown on /cases/[slug])",
    },
    {
      name: "settings",
      title: "⚙️ Settings",
    },
  ],
  fields: [
    // ==========================================
    // LISTING CARD FIELDS (shown on /cases)
    // ==========================================
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main title shown on the card",
      group: "listing",
    }),
    defineField({
      name: "client",
      title: "Client Name",
      type: "string",
      description: "Client/brand name shown on the card",
      group: "listing",
    }),
    defineField({
      name: "excerpt",
      title: "Card Description",
      type: "text",
      rows: 3,
      description: "Short teaser text shown on the sticky scroll card (2-3 sentences recommended)",
      validation: (Rule) => Rule.max(200),
      group: "listing",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags shown as badges on the card (max 3 displayed)",
      options: {
        layout: "tags",
      },
      group: "listing",
    }),
    defineField({
      name: "media",
      title: "Card Background Media",
      type: "servicesSplitMedia",
      description: "Image or video background for the sticky scroll card. Video preferred if both are present.",
      group: "listing",
    }),

    // ==========================================
    // INDIVIDUAL PAGE FIELDS
    // ==========================================
    defineField({
      name: "summary",
      title: "Page Summary",
      type: "text",
      rows: 4,
      description: 'Longer description shown in the "About This Project" section on the individual page',
      group: "individual",
    }),
    defineField({
      name: "pageBlocks",
      title: "Page Content Sections",
      description: "Build out the case study page by adding content blocks below the hero section",
      type: "array",
      of: [
        { type: "hero" },
        { type: "heroPage" },
        { type: "textOnly" },
        { type: "textImage" },
        { type: "mediaShowcase" },
        { type: "bentoGallery" },
        { type: "servicesSplit" },
        { type: "aboutSection" },
        { type: "caseStudyCarousel" },
        { type: "clientsSection" },
        { type: "faq" },
        { type: "testimonialsMarquee" },
      ],
      group: "individual",
    }),

    // ==========================================
    // SETTINGS
    // ==========================================
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: 'The URL path (e.g., "rains" becomes /cases/rains)',
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: "settings",
    }),
    defineField({
      name: "locale",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Danish", value: "da" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      initialValue: "da",
      group: "settings",
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      description: "Controls the order of cases (most recent first)",
      initialValue: () => new Date().toISOString(),
      group: "settings",
    }),
    defineField({
      name: "seo",
      title: "SEO & Social Sharing",
      type: "seo",
      description: "Meta tags for search engines and social media",
      group: "settings",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "media.image.image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Case Study",
        subtitle: subtitle || "No client",
        media: media,
      };
    },
  },
});
