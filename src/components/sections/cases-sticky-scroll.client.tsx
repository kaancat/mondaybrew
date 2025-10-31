"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { CaseStudy } from "@/types/caseStudy";
import { buildSanityImage } from "@/lib/sanity-image";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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

export function CasesStickyScroll({ cases }: CasesStickyScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lenisRef = useRef<Lenis | null>(null);

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.0, // Smooth scroll duration (lower = snappier, higher = slower)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for cinematic feel
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.2, // Scroll sensitivity (higher = more responsive)
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update ScrollTrigger when Lenis scrolls
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value?: number) {
                if (value !== undefined) {
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
        });

        ScrollTrigger.addEventListener("refresh", () => lenis.resize());

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    // Generate placeholder colors for cases without images
    const placeholderColors = [
        "bg-[#FF6B35]", // Orange
        "bg-[#4ECDC4]", // Teal
        "bg-[#45B7D1]", // Blue
        "bg-[#FFA07A]", // Salmon
        "bg-[#98D8C8]", // Mint
        "bg-[#F7DC6F]", // Yellow
        "bg-[#BB8FCE]", // Purple
    ];

    const hasCases = Array.isArray(cases) && cases.length > 0;

    // STACKING CARDS ON SCROLL EFFECT
    // Setup GSAP ScrollTrigger animations for stacked cards
    useEffect(() => {
        const containerEl = containerRef.current;
        if (!containerEl || cardRefs.current.length === 0) return;

        // ========================================
        // CONFIGURATION: Adjust these values
        // ========================================

        // PIN OFFSET: Fixed vertical position where cards pin and fade (pixels from top)
        // All cards will pin at this exact position for consistent overlaying
        // Adjust to align with eyebrow/title position (typically 100-150px)
        const PIN_OFFSET = 120; // pixels from top of viewport

        // CARD GAP: Space between cards before they start overlaying (pixels)
        // This gap is visible at the bottom of the viewport before next card overlays
        // Adjust: 32-64px typical (2-4rem)
        // const CARD_GAP = 48; // pixels (3rem)

        // ========================================
        // Setup animations for each card
        // ========================================

        cardRefs.current.forEach((cardElement, index) => {
            if (!cardElement) return;

            const cardSection = cardElement.querySelector("section");
            if (!cardSection) return;

            const isLast = index === cardRefs.current.length - 1;

            // Z-INDEX STACKING ORDER
            // Higher index cards have higher z-index so they appear on top
            // Card 0 = z-index 1, Card 1 = z-index 2, etc.
            const zIndex = index + 1;

            // Set initial state
            // All cards at same vertical position
            gsap.set(cardSection, {
                zIndex,
            });

            // PIN CARD: Make card stick at fixed position as you scroll
            // All cards pin at PIN_OFFSET from top
            // Last card stays pinned indefinitely
            ScrollTrigger.create({
                trigger: cardElement,
                start: `top top+=${PIN_OFFSET}`, // When card reaches PIN_OFFSET from top
                end: isLast ? "+=0" : `bottom top+=${PIN_OFFSET}`, // Last card stays pinned, others unpin when next arrives
                pin: cardSection, // Pin this card section
                pinSpacing: false, // Don't add extra space
                markers: false, // Set to true for debugging
            });

            // FADE OUT ANIMATION
            // Card blurs and scales down as next card overlays it
            // Creates a 3D carousel depth effect
            if (!isLast) {
                const nextCardElement = cardRefs.current[index + 1];

                const fadeTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: nextCardElement,
                        start: "top bottom",
                        end: `top top+=${PIN_OFFSET}`, // Animation completes when next card reaches pin position
                        scrub: 0.5, // Smoother scroll-linked animation (lower = more responsive, higher = smoother/laggy)
                        markers: false,
                        onEnter: () => {
                            // Start blur animation - make card visible
                            gsap.set(cardSection, { visibility: "visible" });
                        },
                        onLeave: () => {
                            // Next card has fully covered this one - hide it completely
                            gsap.set(cardSection, { visibility: "hidden" });
                        },
                        onEnterBack: () => {
                            // Scrolling back up - make card visible again
                            gsap.set(cardSection, { visibility: "visible" });
                        },
                        onLeaveBack: () => {
                            // Scrolling back up past this card - keep visible
                            gsap.set(cardSection, { visibility: "visible" });
                        },
                    },
                });

                fadeTimeline.to(cardSection, {
                    filter: "blur(6px)", // Blur effect only (adjust: 4-8px)
                    opacity: 1, // Keep fully opaque - no transparency
                    scale: 0.85, // Scale down more for 3D carousel effect (adjust: 0.8 = more dramatic, 0.9 = subtle)
                    pointerEvents: "none", // Disable interaction when blurred
                });
            }


            // PARALLAX EFFECT on background
            const background = cardSection.querySelector(".card-background");
            if (background) {
                gsap.to(background, {
                    y: -30,
                    scrollTrigger: {
                        trigger: cardElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1, // Parallax animation speed (lower = more responsive)
                        markers: false,
                    },
                });
            }
        });

        // Refresh ScrollTrigger to recalculate positions
        ScrollTrigger.refresh();

        // Cleanup: Remove all ScrollTriggers when component unmounts
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => {
                const triggerElement = trigger.vars?.trigger;
                if (
                    triggerElement &&
                    typeof triggerElement !== "string" &&
                    !Array.isArray(triggerElement) &&
                    "parentElement" in triggerElement &&
                    triggerElement.parentElement === containerEl
                ) {
                    trigger.kill();
                }
            });
        };
    }, [cases]);

    return (
        <div
            ref={containerRef}
            className="w-full"
            style={{
                marginTop: "2rem",
            }}
        >
            {!hasCases ? (
                <div className="py-32 text-center">
                    <p className="text-muted-foreground">No cases found.</p>
                </div>
            ) : (
            cases.map((caseStudy, index) => {
                const imageMeta = resolveCaseStudyMedia(caseStudy.media, caseStudy.title);
                const videoSrc = caseStudy.media?.videoFile?.asset?.url || caseStudy.media?.videoUrl;
                const placeholderColor = placeholderColors[index % placeholderColors.length];
                const href = caseStudy.slug ? `/cases/${caseStudy.slug}` : "#";

                return (
                    // ========================================
                    // WRAPPER DIV: Positions card at its scroll position
                    // ========================================
                    // Each wrapper is 100vh tall and positions the card in the scroll flow
                    // position: relative so card positions relative to this wrapper
                    <div
                        key={caseStudy._id}
                        ref={(el) => {
                            cardRefs.current[index] = el;
                        }}
                        className="w-full"
                        style={{
                            position: "relative",
                            height: "100vh",
                            minHeight: "100vh",
                            paddingBottom: "48px", // Add consistent gap spacing below each card (3rem)
                        }}
                    >
                        {/* ========================================
                            CARD SECTION: Card that gets pinned and overlaid
                            ======================================== */}
                        {/* GSAP pins this card and applies animations */}
                        <section
                            className="w-full flex items-center overflow-hidden px-[var(--container-gutter)] rounded-[5px]"
                            style={{
                                height: "80vh", // Shorter cards to show gap at bottom before next card overlays
                            }}
                        >
                            {/* Background - full width within content window */}
                            {/* Add 'card-background' class for parallax effect */}
                            <div className="card-background absolute inset-0 w-full h-full overflow-hidden rounded-[5px]">
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
                            </div>

                            {/* Content - left aligned with padding from card edge */}
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
                        </section>
                    </div>
                );
            }))}
        </div>
    );
}
