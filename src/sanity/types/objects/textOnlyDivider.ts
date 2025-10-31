import { defineType, defineField } from "sanity";

export default defineType({
  name: "textOnlyDivider",
  title: "Divider Line",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Solid Line", value: "solid" },
          { title: "Dashed Line", value: "dashed" },
          { title: "Dotted Line", value: "dotted" },
        ],
        layout: "radio",
      },
      initialValue: "solid",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "Constrained (same as text)", value: "constrained" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: {
      style: "style",
      width: "width",
    },
    prepare({ style, width }) {
      const lineChar = style === "dashed" ? "- - - - -" : style === "dotted" ? "· · · · ·" : "━━━━━";
      const widthLabel = width === "constrained" ? " (constrained)" : "";
      return {
        title: `Divider Line${widthLabel}`,
        subtitle: lineChar,
      };
    },
  },
});

