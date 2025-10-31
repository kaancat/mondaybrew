import { defineType, defineField } from "sanity";
import GridPositionInputComponent from "../../components/GridPositionInput";

export default defineType({
  name: "gridPosition",
  title: "Grid Position",
  type: "object",
  components: {
    input: GridPositionInputComponent,
  },
  fields: [
    defineField({
      name: "columnStart",
      title: "Column Start",
      type: "number",
      description: "Starting column (1+)",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "columnSpan",
      title: "Column Span",
      type: "number",
      description: "Number of columns to span (1+)",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "rowStart",
      title: "Row Start",
      type: "number",
      description: "Starting row (1+)",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "rowSpan",
      title: "Row Span",
      type: "number",
      description: "Number of rows to span (1+)",
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      columnStart: "columnStart",
      columnSpan: "columnSpan",
      rowStart: "rowStart",
      rowSpan: "rowSpan",
    },
    prepare({ columnStart, columnSpan, rowStart, rowSpan }) {
      if (!columnStart) return { title: "Not set" };
      return {
        title: `Col ${columnStart}-${columnStart + (columnSpan || 1) - 1} × Row ${rowStart}-${rowStart + (rowSpan || 2) - 1}`,
        subtitle: `${columnSpan || 1}×${rowSpan || 2} grid cells`,
      };
    },
  },
});

