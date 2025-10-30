"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TextImageResolvedImage = {
    src: string;
    alt: string | null;
    blurDataURL: string | null;
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
    // Detect when the section is near viewport to prefetch image and raise fetch priority
    const isNear = useInView(sectionRef, { amount: 0, margin: "600px 0px 600px 0px" });
    const shouldReduceMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(true);
    const [imgLoaded, setImgLoaded] = useState(false);

    // Idle prefetch when near viewport to avoid abrupt reveal on mobile
    useEffect(() => {
        if (!isNear || imgLoaded || !image?.src) return;
        if (typeof window === "undefined") return;
        const img = new window.Image();
        try { (img as HTMLImageElement).decoding = "async"; } catch {}
        img.src = image.src;
    }, [isNear, imgLoaded, image?.src]);

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
            {image?.src && (
                <motion.div className={cn(imageOrder)} {...animateImage}>
                    <div
                        className={cn(
                            "relative h-full rounded-[5px] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.4)]",
                            image ? "bg-black/5" : "bg-transparent",
                            // Mobile image height set to 500px, desktop taller
                            "min-h-[500px] md:min-h-[520px]"
                        )}
                        >
                            {/* Progressive reveal: subtle fade once decoded */}
                            <Image
                                src={image.src}
                                alt={image.alt || ""}
                                fill
                                className={cn("object-cover transition-opacity duration-500", imgLoaded ? "opacity-100" : "opacity-0")}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                placeholder={image.blurDataURL ? "blur" : "empty"}
                                blurDataURL={image.blurDataURL || undefined}
                                fetchPriority={isNear ? "high" : "auto"}
                                priority={false}
                                onLoadingComplete={() => setImgLoaded(true)}
                            />
                            {/* Lightweight skeleton to mask abrupt swap when no blur is present */}
                            {!imgLoaded ? (
                              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_0%,transparent_50%,rgba(0,0,0,0.06)_100%)] animate-pulse" />
                            ) : null}
                        </div>
                </motion.div>
            )}
        </div>
    );
}
