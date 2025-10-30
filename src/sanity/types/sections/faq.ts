import { defineType, defineField } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading for the FAQ section",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
      description: "Supporting text below the title",
    }),
    defineField({
      name: "titleAlignment",
      title: "Title & Subheading Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
      description: "Choose how the title and subheading are aligned",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Category Label",
              type: "string",
              description: "The name of this category (e.g., 'Marketing', 'Web')",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "id",
              title: "Category ID",
              type: "slug",
              description: "Unique identifier for this category (auto-generated from label)",
              options: {
                source: "label",
                maxLength: 50,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "questions",
              title: "Questions",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "question",
                      title: "Question",
                      type: "string",
                      description: "The question text",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "answer",
                      title: "Answer",
                      type: "text",
                      rows: 4,
                      description: "The answer text that appears when the question is expanded",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "cta",
                      title: "CTA Button",
                      type: "button",
                      description: "Optional call-to-action button inside the answer",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "question",
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.min(1).error("At least one question is required"),
            }),
          ],
          preview: {
            select: {
              title: "label",
              questions: "questions",
            },
            prepare({ title, questions }) {
              const questionCount = questions?.length || 0;
              return {
                title: title || "Unnamed Category",
                subtitle: `${questionCount} ${questionCount === 1 ? "question" : "questions"}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error("At least one category is required"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      categories: "categories",
    },
    prepare({ title, categories }) {
      const categoryCount = categories?.length || 0;
      return {
        title: title || "FAQ",
        subtitle: `${categoryCount} ${categoryCount === 1 ? "category" : "categories"}`,
      };
    },
  },
});

