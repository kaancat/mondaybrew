import React from "react";
import { Section } from "@/components/layout/section";
import Image from "next/image";

export type HeroPageData = {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    media?: {
        mediaType?: "image" | "video";
        image?: {
            asset?: {
                url?: string;
            };
            alt?: string;
        };
        videoFile?: {
            asset?: {
                url?: string;
            };
        };
        videoUrl?: string;
        poster?: {
            asset?: {
                url?: string;
            };
        };
    };
    breadcrumbs?: Array<{
        _key: string;
        label?: string;
        anchor?: string;
    }>;
};

type Props = HeroPageData;

/**
 * Hero Page component - Full-viewport hero section with eyebrow, heading, subheading,
 * page-specific breadcrumbs, and a media container (image or video).
 * 
 * The layout ensures the entire hero fits within viewport height on load,
 * with the media container dynamically filling remaining space.
 * 
 * Mobile: breadcrumbs move below media, media goes full-width with no border radius.
 * Desktop: breadcrumbs next to paragraph, media has container padding and border radius.
 */
export function HeroPage({ eyebrow, heading, subheading, media, breadcrumbs }: Props) {
    const videoSrc = media?.videoFile?.asset?.url || media?.videoUrl;
    const imageSrc = media?.image?.asset?.url;
    const posterSrc = media?.poster?.asset?.url;
    const imageAlt = media?.image?.alt || "Hero image";

    // Breadcrumbs component to avoid duplication
    const BreadcrumbsNav = () => (
        breadcrumbs && breadcrumbs.length > 0 ? (
            <nav aria-label="Page sections" className="flex-shrink-0">
                <ol className="flex items-center gap-5 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb._key}>
                            <li>
                                <a
                                    href={`#${crumb.anchor || ""}`}
                                    className="hover:text-foreground transition-colors text-muted-foreground font-medium whitespace-nowrap"
                                >
                                    {crumb.label}
                                </a>
                            </li>
                            {index < breadcrumbs.length - 1 && (
                                <li
                                    aria-hidden="true"
                                    className="h-4 w-px bg-[color:var(--mb-accent)] opacity-30"
                                ></li>
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </nav>
        ) : null
    );

    return (
        <Section>
            <div
                className="flex flex-col pt-20 lg:pt-0 h-[calc(100vh-var(--section-padding)-var(--container-gutter)-5rem)] lg:h-[calc(100vh-var(--section-padding)-var(--container-gutter))]"
                style={{
                    gap: "var(--container-gutter)"
                } as React.CSSProperties}
            >
                {/* Text content block */}
                <div className="flex flex-col" style={{ gap: "1em" } as React.CSSProperties}>
                    {eyebrow && (
                        <span
                            className="eyebrow text-sm uppercase tracking-[0.2em] text-[color:var(--eyebrow-color,currentColor)] block"
                            style={{ lineHeight: "1" }}
                        >
                            {eyebrow}
                        </span>
                    )}

                    {heading && (
                        <h1 style={{ lineHeight: "1", margin: 0 }}>
                            {heading}
                        </h1>
                    )}

                    <div className="flex items-center justify-between gap-4">
                        {subheading && (
                            <p
                                className="text-muted-foreground max-w-2xl"
                                style={{ lineHeight: "1.5", margin: 0 }}
                            >
                                {subheading}
                            </p>
                        )}

                        {/* Breadcrumbs */}
                        <BreadcrumbsNav />
                    </div>
                </div>

                {/* Media container */}
                <div
                    className="flex-1 overflow-hidden relative"
                    style={{
                        borderRadius: "5px",
                        minHeight: "300px"
                    } as React.CSSProperties}
                >
                    {videoSrc ? (
                        <video
                            src={videoSrc}
                            poster={posterSrc}
                            preload="metadata"
                            playsInline
                            muted
                            loop
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                    ) : imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            <span>Media placeholder</span>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}

/**
 * Type guard to check if a section is a Hero Page section
 */
export function isHeroPage(section: unknown): section is HeroPageData & { _type: "heroPage" } {
    return (section as { _type?: string })?._type === "heroPage";
}

