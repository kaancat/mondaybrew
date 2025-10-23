import { defineType, defineField } from "sanity";

/**
 * Hero Page section schema
 * 
 * Full-viewport hero section with eyebrow, heading, subheading, breadcrumbs, and media.
 * The breadcrumbs are page-specific navigation links that can be connected to H2 anchors
 * on the page (section IDs in future content blocks).
 */
export const heroPage = defineType({
    name: "heroPage",
    title: "Hero Page",
    type: "object",
    fields: [
        defineField({
            name: "eyebrow",
            title: "Eyebrow",
            type: "string",
            description: "Small text above the heading (e.g., 'Web', 'Marketing')",
        }),
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            description: "Main heading (H1)",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "text",
            rows: 3,
            description: "Supporting text below the heading",
        }),
        defineField({
            name: "media",
            title: "Media",
            type: "object",
            description: "Image or video for the hero section",
            fields: [
                {
                    name: "mediaType",
                    title: "Media Type",
                    type: "string",
                    options: {
                        list: [
                            { title: "Image", value: "image" },
                            { title: "Video", value: "video" },
                        ],
                        layout: "radio",
                    },
                    initialValue: "image",
                },
                {
                    name: "image",
                    title: "Image",
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        {
                            name: "alt",
                            title: "Alt Text",
                            type: "string",
                        },
                    ],
                    hidden: ({ parent }) => parent?.mediaType !== "image",
                },
                {
                    name: "videoFile",
                    title: "Video File",
                    type: "file",
                    description: "Upload a video file",
                    options: {
                        accept: "video/*",
                    },
                    hidden: ({ parent }) => parent?.mediaType !== "video",
                },
                {
                    name: "videoUrl",
                    title: "Video URL",
                    type: "url",
                    description: "Or provide a video URL",
                    hidden: ({ parent }) => parent?.mediaType !== "video",
                },
                {
                    name: "poster",
                    title: "Video Poster",
                    type: "image",
                    description: "Thumbnail/poster image for the video",
                    hidden: ({ parent }) => parent?.mediaType !== "video",
                },
            ],
        }),
        defineField({
            name: "breadcrumbs",
            title: "Breadcrumbs / Page Navigation",
            type: "array",
            description: "Page-specific navigation links. The anchor should match H2 IDs in content sections below (e.g., 'overview', 'process', 'tech').",
            of: [
                {
                    type: "object",
                    name: "breadcrumb",
                    title: "Breadcrumb",
                    fields: [
                        {
                            name: "label",
                            title: "Label",
                            type: "string",
                            description: "Display text for the link (e.g., 'Overblik', 'Proces')",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "anchor",
                            title: "Anchor / Section ID",
                            type: "string",
                            description: "The ID of the section this links to (without #). Should match an H2 ID in a content block below.",
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                    preview: {
                        select: {
                            title: "label",
                            subtitle: "anchor",
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: title || "Untitled",
                                subtitle: subtitle ? `#${subtitle}` : "",
                            };
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            eyebrow: "eyebrow",
            heading: "heading",
            media: "media.image",
        },
        prepare({ eyebrow, heading, media }) {
            return {
                title: heading || "Hero Page",
                subtitle: eyebrow ? `${eyebrow}` : "Hero Page Section",
                media,
            };
        },
    },
});

