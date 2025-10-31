import { defineType, defineField } from "sanity";

export default defineType({
  name: "bentoGallery",
  title: "Bento Grid Gallery",
  type: "object",
  fields: [
    defineField({
      name: "sectionId",
      title: "Section ID (for navigation)",
      type: "slug",
      description: "Optional ID for this section. Used by breadcrumb navigation.",
      options: {
        maxLength: 50,
      },
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      description: "Add 1-20 images. Use the visual grid picker to set exact positions, or leave empty for automatic placement.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "imageWithAlt",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "position",
              title: "Grid Position",
              type: "gridPosition",
              description: "Click and drag on the grid to set exact position. Leave empty for automatic placement.",
            }),
          ],
          preview: {
            select: {
              media: "image.image",
              alt: "image.alt",
              colStart: "position.columnStart",
              colSpan: "position.columnSpan",
              rowStart: "position.rowStart",
              rowSpan: "position.rowSpan",
            },
            prepare({ media, alt, colStart, colSpan, rowStart, rowSpan }) {
              let positionLabel = "Auto position";
              if (colStart) {
                positionLabel = `Col ${colStart}-${colStart + (colSpan || 1) - 1} × Row ${rowStart}-${rowStart + (rowSpan || 2) - 1}`;
              }
              return {
                title: alt || "Gallery Image",
                subtitle: positionLabel,
                media: media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(20),
    }),
  ],
  preview: {
    select: {
      images: "images",
    },
    prepare({ images }) {
      const count = images?.length || 0;
      return {
        title: "Bento Grid Gallery",
        subtitle: `${count} image${count !== 1 ? 's' : ''} • 5 columns (fixed)`,
      };
    },
  },
});

