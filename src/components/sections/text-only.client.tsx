"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TextOnlyClientProps = {
    eyebrow?: string;
    title?: string;
    subheading?: string;
    body?: string;
    cta?: {
        label: string;
        href: string;
        variant: "default" | "secondary" | "outline" | "ghost" | "link";
    } | null;
    cta2?: {
        label: string;
        href: string;
        variant: "default" | "secondary" | "outline" | "ghost" | "link";
    } | null;
};

// Animation constants
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Client-side Text Only Component
 * 
 * Why: Handles the visual rendering of text-only content blocks
 * Two-column layout with title and accent line above
 */
export function TextOnlyClient({
    eyebrow,
    title,
    subheading,
    body,
    cta,
    cta2,
}: TextOnlyClientProps) {
    // Animation setup
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -200px 0px" });
    const shouldReduceMotion = useReducedMotion();

    // Animation config
    const animateContent = shouldReduceMotion ? {} : {
        initial: { opacity: 0, y: 20 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        transition: { duration: 0.7, ease: EASE_OUT },
    };

    return (
        <motion.div
            ref={sectionRef}
            {...animateContent}
            className="relative"
        >
            <div className="relative">
                {/* Mobile title section - shown only on small screens */}
                <div className="md:hidden mb-8 flex flex-col gap-4">
                    {eyebrow && (
                        <span className="eyebrow block">
                            {eyebrow}
                        </span>
                    )}
                    {title && (
                        <h3 className="text-2xl">
                            {title}
                        </h3>
                    )}
                </div>

                {/* Horizontal divider line */}
                <div className="w-full border-b border-[color:color-mix(in_oklch,var(--foreground)_18%,var(--background)_82%)] mb-12" />

                {/* Two column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 md:items-start">
                    {/* Left column - Title section (desktop only) */}
                    <div className="hidden md:flex flex-col gap-4">
                        {/* Eyebrow - Small label */}
                        {eyebrow && (
                            <span className="eyebrow block">
                                {eyebrow}
                            </span>
                        )}

                        {/* Title - Smaller size for left column */}
                        {title && (
                            <h3 className="text-2xl md:text-3xl">
                                {title}
                            </h3>
                        )}
                    </div>

                    {/* Right column - Body text and CTA */}
                    <div className="relative flex flex-col gap-6">
                        {/* Vertical accent bar hidden for now */}
                        {/* <div className="absolute -left-8 top-0 bottom-0 w-[2px] bg-[color:var(--mb-accent)]" /> */}

                        {/* Body text - offset to align with title */}
                        {body && (
                            <p className="body-text mt-8">
                                {body}
                            </p>
                        )}

                        {/* CTA Buttons */}
                        {(cta || cta2) && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {cta && (
                                    <Link
                                        href={cta.href}
                                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-6 py-[0.65rem] text-sm font-semibold leading-[1.05] transition-colors bg-[color:var(--foreground)] text-[color:var(--background)] hover:bg-[color:var(--foreground)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                                    >
                                        {cta.label}
                                    </Link>
                                )}
                                {cta2 && (
                                    <Link
                                        href={cta2.href}
                                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-6 py-[0.65rem] text-sm font-semibold leading-[1.05] transition-colors bg-[color:var(--cta-primary-bg)] text-[color:var(--cta-primary-text)] hover:bg-[color:var(--cta-primary-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                                    >
                                        {cta2.label}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

