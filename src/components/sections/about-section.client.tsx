"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AboutSectionResolvedImage = {
  src?: string | null;
  alt?: string | null;
  blurDataURL?: string | null;
  width?: number;
  height?: number;
};

export type AboutSectionResolvedStat = {
  value?: string | null;
  label?: string | null;
  icon?: AboutSectionResolvedImage | null;
};

type AboutSectionClientProps = {
  eyebrow?: string | null;
  headline?: string | null;
  subheading?: string | null;
  image?: AboutSectionResolvedImage | null;
  stats?: AboutSectionResolvedStat[];
  cta?: {
    label?: string | null;
    href?: string | null;
    variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  } | null;
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const overlayVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.35, ease: EASE_OUT },
  },
} as const;

const headlineVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
} as const;

// No per-stat entrance needed for the simplified static panel.

export function AboutSectionClient({ eyebrow, headline, subheading, image, stats = [], cta }: AboutSectionClientProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const overlayControls = useAnimation();
  const headlineControls = useAnimation();
  const prefersReducedMotionSetting = useReducedMotion();
  const prefersReducedMotion = prefersReducedMotionSetting ?? false;
  const isInView = useInView(sectionRef, { once: true, amount: 0.55 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parallax should affect the image only – not the overlay/content.
  // We therefore apply the mask + transform to an inner image layer instead of the container.
  // Disabled on mobile for better performance and to prevent gaps
  const imageLayerMotionStyle = prefersReducedMotion || isMobile
    ? undefined
    : ({ y: parallaxY } as const);

  useEffect(() => {
    if (isInView) {
      overlayControls.start("visible");
      headlineControls.start("visible");
    }
  }, [isInView, overlayControls, headlineControls]);

  // (removed) gridCols helper not used after mobile redesign

  return (
    <div ref={sectionRef} className="relative flex flex-col gap-[var(--flow-space)]">
      <motion.div
        variants={headlineVariants}
        initial="hidden"
        animate={headlineControls}
        className="flex flex-col gap-[calc(var(--flow-space)/1.4)] w-full lg:max-w-[78ch] xl:max-w-[82ch]"
      >
        {eyebrow ? (
          <p className="eyebrow text-[length:var(--font-tight)] uppercase tracking-[0.3em] text-[color:var(--eyebrow-color,var(--accent))]">
            {eyebrow}
          </p>
        ) : null}
        {headline ? (
          <h2 className="text-balance text-[color:var(--foreground)]">
            {headline}
          </h2>
        ) : null}
        {subheading ? (
          <p className="max-w-[78ch] text-[length:var(--font-body)] leading-[1.7] text-muted-foreground">
            {subheading}
          </p>
        ) : null}
      </motion.div>

      <div className={cn("relative isolate", isMobile ? "full-bleed" : undefined)}>
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-[5px]",
            // Side/bottom-only depth to avoid top halo or colored edges
            "drop-shadow-[0_36px_110px_rgba(8,6,20,0.28)]",
          )}
        >
          <div className="aspect-[4/3] md:aspect-[16/6]" />

          {/* Image layer with its own mask and parallax (prevents the bottom fade from affecting overlay text) */}
          {image?.src ? (
            <motion.div
              aria-hidden
              style={imageLayerMotionStyle}
              className="absolute inset-0 w-full h-full md:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]"
            >
              <Image
                src={image.src!}
                alt={image.alt || "About us hero"}
                fill
                loading="lazy"
                placeholder={image.blurDataURL ? "blur" : undefined}
                blurDataURL={image.blurDataURL || undefined}
                sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 92vw"
                className="object-cover md:object-center object-[55%_center] scale-100 md:scale-100"
                priority={false}
              />
            </motion.div>
          ) : null}
          {!prefersReducedMotion && !isMobile ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, transparent 40%, color-mix(in_oklch,var(--card)_55%, white 45%) 47%, transparent 55%)",
                backgroundSize: "250% 250%",
              }}
              animate={{ backgroundPosition: ["-180% 50%", "120% 50%", "-180% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}

          {/* Overlay moved outside (see below) to allow covering both image and the spacer container */}
        </motion.div>
        {/* Stats glass bar anchored at image bottom (matches Media Showcase styling) */}
        {stats.length ? (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={overlayControls}
            className="z-10"
          >
            {/* Mobile: stack stats in responsive grid (matches media showcase) */}
            <div className="about-stats-panel block md:hidden w-full pt-4">
              <div className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2">
                {stats.map((stat, i) => (
                  <div
                    key={`${stat.label || stat.value || i}`}
                    className="rounded-[10px] bg-[color:var(--about-stats-mobile-surface)] px-4 py-3 backdrop-blur-[14px]"
                  >
                    {stat.value ? (
                      <div data-stat-value className="text-[length:var(--font-h3)] font-bold leading-none text-primary">{stat.value}</div>
                    ) : null}
                    {stat.label ? <div data-stat-label className="text-muted-foreground mt-1">{stat.label}</div> : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: full-width glass bar attached to image bottom */}
            <div className="about-stats-panel hidden md:block md:absolute md:inset-x-0 md:bottom-0">
              <div
                className={cn(
                  "w-full rounded-t-0 rounded-b-[5px] border border-t md:border md:border-t border-[color:var(--nav-shell-border)]",
                  "bg-[color-mix(in_oklch,var(--nav-shell-bg)_68%,transparent)] backdrop-blur-[12px]",
                  "px-8 py-4 drop-shadow-[0_18px_38px_rgba(8,6,20,0.18)]",
                )}
                style={{ boxShadow: "var(--nav-shell-shadow)" }}
              >
                <dl
                  className={cn(
                    "grid gap-x-6 gap-y-2",
                    stats.length >= 4
                      ? "grid-cols-4"
                      : stats.length === 3
                        ? "grid-cols-3"
                        : stats.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-1",
                  )}
                >
                  {stats.map((stat, i) => (
                    <div key={`${stat.label || stat.value || i}`} className="flex items-start gap-3 flex-col items-center text-center">
                      {stat.value ? (
                        <div data-stat-value className="text-[length:var(--font-h3)] leading-none text-primary">{stat.value}</div>
                      ) : null}
                      {stat.label ? <div data-stat-label className="text-muted-foreground">{stat.label}</div> : null}
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>

      {cta?.label && cta?.href ? (
        <div>
          <Button asChild variant={cta.variant ?? "default"}>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// Removed animated/stat formatting utilities — values render static like Media Showcase
