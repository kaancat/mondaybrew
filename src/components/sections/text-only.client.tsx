"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

type ButtonType = {
    label: string;
    href: string;
    variant: "default" | "secondary" | "outline" | "ghost" | "link";
};

type RichTextItem = {
    _key: string;
    type: "richText";
    title?: string;
    body?: string;
};

type RichTextImageItem = {
    _key: string;
    type: "richTextImage";
    title?: string;
    order: "textFirst" | "imageFirst";
    body?: string;
    image: {
        url: string;
        alt: string;
        lqip?: string;
        width?: number;
        height?: number;
    };
};

type Cta1Item = {
    _key: string;
    type: "cta1";
    button: ButtonType | null;
};

type Cta2Item = {
    _key: string;
    type: "cta2";
    button1: ButtonType | null;
    button2: ButtonType | null;
};

type DividerItem = {
    _key: string;
    type: "divider";
    style: "solid" | "dashed" | "dotted";
    width: "full" | "constrained";
};

type SectionItem = RichTextItem | RichTextImageItem | Cta1Item | Cta2Item | DividerItem;

type TextOnlyClientProps = {
    eyebrow?: string;
    sections: (SectionItem | null)[];
};

// Animation constants
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Client-side Text Only Component
 * 
 * Why: Handles the visual rendering of flexible text-only content blocks
 * Two-column layout with sections that can be rich text, CTAs, or dividers
 */
export function TextOnlyClient({
    eyebrow,
    sections,
}: TextOnlyClientProps) {
    // Animation setup
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -200px 0px" });
    const shouldReduceMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Animation config - disabled on mobile
    const animateContent = shouldReduceMotion || isMobile ? {} : {
        initial: { opacity: 0, y: 20 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        transition: { duration: 0.7, ease: EASE_OUT },
    };

    return (
        <motion.div
            ref={sectionRef}
            {...animateContent}
            className="relative flex flex-col"
        >
            {/* Top horizontal divider line */}
            <div className="w-full border-b border-[color:color-mix(in_oklch,var(--foreground)_18%,var(--background)_82%)] mb-12" />

            {/* Eyebrow below the line */}
            {eyebrow && (
                <span className="eyebrow block mb-8">
                    {eyebrow}
                </span>
            )}

            {/* Content sections with spacing */}
            <div className="flex flex-col gap-12">

            {/* Render each section */}
            {sections.map((section, index) => {
                if (!section) return null;

                switch (section.type) {
                    case "richText":
                        return (
                            <div key={section._key} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                                {/* Left column - Title */}
                                <div className="flex flex-col gap-4">
                                    {section.title && (
                                        <h3 className="text-2xl md:text-3xl">
                                            {section.title}
                                        </h3>
                                    )}
                                </div>

                                {/* Right column - Body text */}
                                <div className="flex flex-col gap-6">
                                    {section.body && (
                                        <p className="body-text whitespace-pre-wrap">
                                            {section.body}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );

                    case "richTextImage":
                        return (
                            <div key={section._key} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                                {/* Left column - Title */}
                                <div className="flex flex-col gap-4">
                                    {section.title && (
                                        <h3 className="text-2xl md:text-3xl">
                                            {section.title}
                                        </h3>
                                    )}
                                </div>

                                {/* Right column - Body text and image */}
                                <div className="flex flex-col gap-6">
                                    {section.order === "textFirst" ? (
                                        <>
                                            {section.body && (
                                                <p className="body-text whitespace-pre-wrap">
                                                    {section.body}
                                                </p>
                                            )}
                                            <div className="relative w-full max-w-xl rounded-lg overflow-hidden bg-muted">
                                                <Image
                                                    src={section.image.url}
                                                    alt={section.image.alt}
                                                    width={section.image.width || 1200}
                                                    height={section.image.height || 675}
                                                    className="w-full h-auto object-contain object-left"
                                                    placeholder={section.image.lqip ? "blur" : undefined}
                                                    blurDataURL={section.image.lqip}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="relative w-full max-w-xl rounded-lg overflow-hidden bg-muted">
                                                <Image
                                                    src={section.image.url}
                                                    alt={section.image.alt}
                                                    width={section.image.width || 1200}
                                                    height={section.image.height || 675}
                                                    className="w-full h-auto object-contain object-left"
                                                    placeholder={section.image.lqip ? "blur" : undefined}
                                                    blurDataURL={section.image.lqip}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            </div>
                                            {section.body && (
                                                <p className="body-text whitespace-pre-wrap">
                                                    {section.body}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );

                    case "cta1":
                        if (!section.button) return null;
                        return (
                            <div key={section._key} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                                {/* Left column - Empty */}
                                <div />
                                
                                {/* Right column - Button */}
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={section.button.href}
                                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-6 py-[0.65rem] text-sm font-normal leading-[1.05] transition-colors bg-[color:var(--foreground)] text-[color:var(--background)] hover:bg-[color:var(--foreground)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                                    >
                                        {section.button.label}
                                    </Link>
                                </div>
                            </div>
                        );

                    case "cta2":
                        if (!section.button1 && !section.button2) return null;
                        return (
                            <div key={section._key} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                                {/* Left column - Empty */}
                                <div />
                                
                                {/* Right column - Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    {section.button1 && (
                                        <Link
                                            href={section.button1.href}
                                            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-6 py-[0.65rem] text-sm font-normal leading-[1.05] transition-colors bg-[color:var(--foreground)] text-[color:var(--background)] hover:bg-[color:var(--foreground)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                                        >
                                            {section.button1.label}
                                        </Link>
                                    )}
                                    {section.button2 && (
                                        <Link
                                            href={section.button2.href}
                                            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[5px] px-6 py-[0.65rem] text-sm font-normal leading-[1.05] transition-colors bg-[color:var(--cta-primary-bg)] text-[color:var(--cta-primary-text)] hover:bg-[color:var(--cta-primary-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                                        >
                                            {section.button2.label}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );

                    case "divider":
                        const borderStyle = section.style === "dashed" ? "border-dashed" : section.style === "dotted" ? "border-dotted" : "border-solid";
                        
                        if (section.width === "constrained") {
                            return (
                                <div key={section._key} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                                    {/* Left column - Empty */}
                                    <div />
                                    
                                    {/* Right column - Constrained divider */}
                                    <div className={`border-b ${borderStyle} border-[color:color-mix(in_oklch,var(--foreground)_18%,var(--background)_82%)]`} />
                                </div>
                            );
                        }
                        
                        return (
                            <div key={section._key} className={`w-full border-b ${borderStyle} border-[color:color-mix(in_oklch,var(--foreground)_18%,var(--background)_82%)]`} />
                        );

                    default:
                        return null;
                }
            })}
            </div>
        </motion.div>
    );
}

