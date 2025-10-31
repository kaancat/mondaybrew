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
      name: "columns",
      title: "Number of Columns",
      type: "number",
      description: "How many columns the grid should have (1-15)",
      validation: (Rule) => Rule.required().min(1).max(15),
      initialValue: 5,
    }),
    defineField({
      name: "rows",
      title: "Number of Rows",
      type: "number",
      description: "How many rows the grid should have (1-25)",
      validation: (Rule) => Rule.required().min(1).max(25),
      initialValue: 10,
    }),
    defineField({
      name: "showGridLines",
      title: "Show Grid Lines",
      type: "boolean",
      description: "Show red grid lines overlay to visualize rows and columns",
      initialValue: true,
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
      columns: "columns",
      rows: "rows",
    },
    prepare({ images, columns, rows }) {
      const count = images?.length || 0;
      return {
        title: "Bento Grid Gallery",
        subtitle: `${count} image${count !== 1 ? 's' : ''} • ${columns || 5}×${rows || 10} grid`,
      };
    },
  },
});

