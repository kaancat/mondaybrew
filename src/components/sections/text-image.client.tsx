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
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-6 md:gap-10">
            {/* Text panel box */}
            <motion.div className={cn(textOrder)} {...animateText}>
                <div
                    className={cn(
                        // Add mobile inner padding so content isn't edge-to-edge
                        "h-full rounded-none p-4 md:rounded-[5px] md:p-6 services-card-surface text-image-card shadow-[var(--shadow-elevated-md)]"
                    )}
                    style={{ minHeight: 520 }}
                >
                    {eyebrow && (
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] services-card-eyebrow">{eyebrow}</span>
                    )}
                    {title && (<h2 data-ti-headline className="mt-2 font-semibold">{title}</h2>)}
                    <div className="my-6 h-[1px] w-full services-card-divider" />
                    {body && (
                        <p className="services-card-body text-[length:var(--font-body)] leading-relaxed">{body}</p>
                    )}
                    {cta && (
                        <div className="mt-6">
                            <Button asChild variant={cta.variant} size="lg" className="self-start">
                                <Link href={cta.href}>{cta.label}</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Image panel */}
            {image?.url && (
                <motion.div className={cn(imageOrder)} {...animateImage}>
                    <div
                        className={cn(
                            "relative h-full rounded-[5px] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.4)]",
                            image ? "bg-black/5" : "bg-transparent",
                            // Mobile image height set to 500px, desktop taller
                            "min-h-[500px] md:min-h-[520px]"
                        )}
                    >
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
