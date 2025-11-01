"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { CaseStudy } from "@/types/caseStudy";
import { buildSanityImage } from "@/lib/sanity-image";

type CasesStickyScrollProps = {
    cases: CaseStudy[];
};

function resolveCaseStudyMedia(media: CaseStudy["media"] | null | undefined, fallbackAlt?: string) {
    if (!media) return undefined;
    const posterSource = media.poster ?? undefined;
    const imageSource = media.image ?? undefined;

    const built = buildSanityImage(
        posterSource
            ? {
                alt: posterSource.alt ?? fallbackAlt ?? undefined,
                image: posterSource.image ?? undefined,
            }
            : imageSource
                ? {
                    alt: imageSource.alt ?? fallbackAlt ?? undefined,
                    image: imageSource.image ?? undefined,
                }
                : undefined,
        { width: 2000, quality: 85 },
    );

    if (!built.src) return undefined;
    return {
        src: built.src,
        alt: built.alt ?? fallbackAlt,
        blurDataURL: built.blurDataURL,
    };
}

// Individual card component with scroll-based animations
function StickyCard({
    caseStudy,
    index,
    totalCards,
}: {
    caseStudy: CaseStudy;
    index: number;
    totalCards: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);

    // Track scroll progress for this card
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start start", "end start"],
    });

    // Calculate scale and blur based on scroll position
    // Each card scales down and blurs as it gets covered by the next card
    const scale = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [1, 0.95, 0.85]
    );

    const blur = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ["blur(0px)", "blur(3px)", "blur(6px)"]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.8, 1],
        [1, 1, 1]
    );

    // Parallax effect for background
    const backgroundY = useTransform(
        scrollYProgress,
        [0, 1],
        [0, -30]
    );

    const imageMeta = resolveCaseStudyMedia(caseStudy.media, caseStudy.title);
    const videoSrc = caseStudy.media?.videoFile?.asset?.url || caseStudy.media?.videoUrl;
    const href = caseStudy.slug ? `/cases/${caseStudy.slug}` : "#";

    // Placeholder colors for cases without images
    const placeholderColors = [
        "bg-[#FF6B35]", // Orange
        "bg-[#4ECDC4]", // Teal
        "bg-[#45B7D1]", // Blue
        "bg-[#FFA07A]", // Salmon
        "bg-[#98D8C8]", // Mint
        "bg-[#F7DC6F]", // Yellow
        "bg-[#BB8FCE]", // Purple
    ];
    const placeholderColor = placeholderColors[index % placeholderColors.length];

    // All cards stick at the same position for consistent stacking
    const CARD_STICK_POSITION = 80; // All cards pin at this position from top

    return (
        <div
            ref={cardRef}
            className="relative w-full"
            style={{
                height: "100vh",
                paddingBottom: "0px",
            }}
        >
            <motion.section
                className="sticky top-0 w-full flex items-center overflow-hidden px-[var(--container-gutter)] rounded-[5px]"
                style={{
                    top: `${CARD_STICK_POSITION}px`,
                    height: "80vh",
                    scale,
                    opacity,
                    filter: blur,
                    zIndex: totalCards - index,
                }}
            >
                {/* Background with parallax effect */}
                <motion.div
                    ref={backgroundRef}
                    className="absolute inset-0 w-full h-full overflow-hidden rounded-[5px]"
                    style={{
                        y: backgroundY,
                    }}
                >
                    {videoSrc ? (
                        <video
                            src={videoSrc}
                            poster={imageMeta?.src}
                            preload="metadata"
                            playsInline
                            muted
                            loop
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                    ) : imageMeta?.src ? (
                        <Image
                            src={imageMeta.src}
                            alt={imageMeta.alt || caseStudy.title}
                            fill
                            className="object-cover"
                            placeholder={imageMeta.blurDataURL ? "blur" : undefined}
                            blurDataURL={imageMeta.blurDataURL}
                            sizes="100vw"
                            priority={index === 0}
                        />
                    ) : (
                        <div className={`w-full h-full ${placeholderColor}`} />
                    )}

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-2xl py-32 pl-6">
                    {/* Tags */}
                    {caseStudy.tags && caseStudy.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {caseStudy.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                    key={`${tag}-${tagIndex}`}
                                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {caseStudy.title}
                    </h2>

                    {/* Client */}
                    {caseStudy.client && (
                        <p className="text-white/80 text-lg mb-4">{caseStudy.client}</p>
                    )}

                    {/* Excerpt */}
                    {caseStudy.excerpt && (
                        <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                            {caseStudy.excerpt}
                        </p>
                    )}

                    {/* CTA */}
                    <Link
                        href={href}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground rounded-[5px] font-medium hover:bg-white/90 transition-colors"
                    >
                        View Case
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}

export function CasesStickyScroll({ cases }: CasesStickyScrollProps) {
    const hasCases = Array.isArray(cases) && cases.length > 0;

    if (!hasCases) {
        return (
            <div className="py-32 text-center">
                <p className="text-muted-foreground">No cases found.</p>
            </div>
        );
    }

    return (
        <div
            className="w-full"
            style={{
                marginTop: "2rem",
            }}
        >
            {cases.map((caseStudy, index) => (
                <StickyCard
                    key={caseStudy._id}
                    caseStudy={caseStudy}
                    index={index}
                    totalCards={cases.length}
                />
            ))}
        </div>
    );
}
