import { defineType } from "sanity";

export default defineType({
  name: "caseStudyCarousel",
  title: "Case Study Carousel",
  type: "object",
  fields: [],
  preview: {
    prepare() {
      return { title: "Case Study Carousel" };
    },
  },
});

