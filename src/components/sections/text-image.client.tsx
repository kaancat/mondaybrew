"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TextImageResolvedImage = {
    url: string;
    alt: string | null;
    lqip: string | null;
    width?: number;
    height?: number;
};

type TextImageClientProps = {
    eyebrow?: string;
    title?: string;
    body?: string;
    image: TextImageResolvedImage | null;
    imagePosition: "left" | "right";
    cta?: {
        label: string;
        href: string;
        variant: "default" | "secondary" | "outline" | "ghost" | "link";
    } | null;
};

// Animation constants
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Client-side Text and Image Component
 * 
 * Why: Handles the visual rendering and responsive layout of text + image blocks.
 * Supports left/right image placement with automatic text flow.
 * Image always goes below text on mobile for better reading flow.
 */
export function TextImageClient({
    eyebrow,
    title,
    body,
    image,
    imagePosition,
    cta,
}: TextImageClientProps) {
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

    // Determine grid order based on image position
    const imageOrder = imagePosition === "right" ? "md:order-2" : "md:order-1";
    const textOrder = imagePosition === "right" ? "md:order-1" : "md:order-2";

    // Animation directions based on image position
    const imageSlideFrom = imagePosition === "left" ? -60 : 60;
    const textSlideFrom = imagePosition === "left" ? 60 : -60;

    // Skip animations if reduced motion is preferred or on mobile
    const animateImage = shouldReduceMotion || isMobile ? {} : {
        initial: { opacity: 0, x: imageSlideFrom },
        animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imageSlideFrom },
        transition: { duration: 0.7, ease: EASE_OUT },
    };

    const animateText = shouldReduceMotion || isMobile ? {} : {
        initial: { opacity: 0, x: textSlideFrom },
        animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: textSlideFrom },
        transition: { duration: 0.7, ease: EASE_OUT },
    };

    return (
        <div 
            ref={sectionRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 md:items-center min-h-[500px]"
        >
            {/* Text Content - All animated together as one block */}
            <motion.div
                className={cn("flex flex-col h-full justify-center relative", textOrder)}
                {...animateText}
            >
                {/* Decorative gradient blur orb in background */}
                <div className="absolute -left-20 top-20 w-64 h-64 bg-[color:var(--accent)] opacity-[0.03] blur-[80px] rounded-full pointer-events-none" />

                {/* Text content - tightly spaced */}
                <div className="flex flex-col gap-3">
                    {/* Eyebrow - Small yellow label */}
                    {eyebrow && (
                        <span className="eyebrow">
                            {eyebrow}
                        </span>
                    )}

                    {/* Title - Large and Bold */}
                    {title && (
                        <h2 className="text-[color:var(--foreground)]">
                            {title}
                        </h2>
                    )}

                    {/* Body Text - Normal size and weight */}
                    {body && (
                        <p className="body-text">
                            {body}
                        </p>
                    )}

                    {/* CTA Button */}
                    {cta && (
                        <Button asChild variant={cta.variant} size="lg" className="self-start">
                            <Link href={cta.href}>{cta.label}</Link>
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Image */}
            {image?.url && (
                <motion.div
                    className={cn("relative w-full aspect-[4/3] md:aspect-auto md:h-[500px] lg:h-[600px]", imageOrder)}
                    {...animateImage}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-[5px] shadow-[0_20px_60px_rgb(0,0,0,0.4)]">
                        <Image
                            src={image.url}
                            alt={image.alt || ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            placeholder={image.lqip ? "blur" : "empty"}
                            blurDataURL={image.lqip || undefined}
                            priority={false}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

