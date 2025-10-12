import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonialCard",
  title: "Testimonial Card",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Image only", value: "image" },
          { title: "Quote only", value: "quote" },
          { title: "Image + Quote", value: "imageQuote" },
        ],
        layout: "radio",
      },
      initialValue: "quote",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ 
      name: "background", 
      title: "Background color", 
      type: "string", 
      description: "Applies behind quote content. Image-only cards ignore this.", 
      options: { list: ["#FF914D", "#F5F7FD", "#49444B", "#111111", "white"] },
      hidden: ({ parent }) => parent?.variant === "image",
    }),
    
    // Logo - Only for quote and imageQuote variants
    defineField({ 
      name: "logo", 
      title: "Logo (quote cards)", 
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.variant === "image",
      description: "Optional mark displayed on quote-based cards",
    }),
    
    // Main image - Only for image and imageQuote variants
    defineField({ 
      name: "image", 
      title: "Main image", 
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.variant === "quote",
      description: "Required for image variants. Left column for Image + Quote, full-bleed for Image only.",
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { variant?: string } | undefined;
        const variant = parent?.variant;
        if ((variant === "image" || variant === "imageQuote") && !value) {
          return "Image is required for this variant";
        }
        return true;
      }),
    }),
    
    // Quote - Only for quote and imageQuote variants
    defineField({ 
      name: "quote", 
      title: "Quote", 
      type: "text", 
      rows: 3,
      hidden: ({ parent }) => parent?.variant === "image",
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { variant?: string } | undefined;
        const variant = parent?.variant;
        if ((variant === "quote" || variant === "imageQuote") && !value) {
          return "Quote is required for this variant";
        }
        return true;
      }),
    }),
    
    // Author - Only for quote and imageQuote variants
    defineField({ 
      name: "author", 
      title: "Name", 
      type: "string",
      hidden: ({ parent }) => parent?.variant === "image",
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as { variant?: string } | undefined;
        const variant = parent?.variant;
        if ((variant === "quote" || variant === "imageQuote") && !value) {
          return "Author name is required for this variant";
        }
        return true;
      }),
    }),
    
    // Role - Only for quote and imageQuote variants
    defineField({ 
      name: "role", 
      title: "Title / Role", 
      type: "string",
      hidden: ({ parent }) => parent?.variant === "image",
    }),
    
    // CTA - Available for all variants
    defineField({ 
      name: "cta", 
      title: "CTA", 
      type: "button",
      description: "Shows at bottom of card for all variants",
    }),
  ],
  preview: {
    select: { 
      title: "author", 
      subtitle: "role", 
      variant: "variant",
      media: "logo.image",
      image: "image.image",
    },
    prepare({ title, subtitle, variant, media, image }) {
      return { 
        title: title || variant === "image" ? "Image Only Card" : "Testimonial", 
        subtitle: subtitle || variant,
        media: media || image,
      };
    },
  },
});
