"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AboutSectionResolvedImage = {
  url?: string | null;
  alt?: string | null;
  lqip?: string | null;
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

const statVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.5 + index * 0.18 },
  }),
} as const;

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

  const gridCols = useMemo(() => {
    if (!stats?.length) return "";
    if (stats.length >= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    if (stats.length === 3) return "grid-cols-1 md:grid-cols-3";
    if (stats.length === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1";
  }, [stats]);

  return (
    <div ref={sectionRef} className="flex flex-col gap-[var(--flow-space)]">
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
            "relative overflow-hidden rounded-[5px] shadow-[var(--shadow-hero)]",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--accent)_15%,transparent)_0%,transparent_60%)]",
          )}
        >
          <div className="aspect-[4/3] md:aspect-[16/6]" />

          {/* Image layer with its own mask and parallax (prevents the bottom fade from affecting overlay text) */}
          {image?.url ? (
            <motion.div
              aria-hidden
              style={imageLayerMotionStyle}
              className="absolute inset-0 w-full h-full md:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_70%,rgba(0,0,0,0)_100%)]"
            >
              <Image
                src={image.url}
                alt={image.alt || "About us hero"}
                fill
                loading="lazy"
                placeholder={image.lqip ? "blur" : undefined}
                blurDataURL={image.lqip || undefined}
                sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 92vw"
                className="object-cover md:object-center object-[55%_center] scale-100 md:scale-100"
                priority={false}
              />
            </motion.div>
          ) : null}
          {!prefersReducedMotion ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, transparent 40%, color-mix(in_oklch,var(--card)_26%, var(--accent)_12%) 47%, transparent 55%)",
                backgroundSize: "250% 250%",
              }}
              animate={{ backgroundPosition: ["-180% 50%", "120% 50%", "-180% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}

          {/* Overlay moved outside (see below) to allow covering both image and the spacer container */}
        </motion.div>
        {/* Mobile-only spacer container that touches the image */}
        <div className="md:hidden h-[84px] bg-[color:var(--background)]" />

        {stats.length ? (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={overlayControls}
            className={cn(
              "about-stats absolute z-10 inset-x-0 bottom-0 flex flex-col justify-end",
              // Full-width bar spanning into the spacer container and ~lower third of image
              "mx-0 w-full",
              "overflow-hidden shadow-[0_-12px_60px_rgba(8,6,20,0.24)] backdrop-blur-[10px]",
              // Rounded only on the top so it fuses with the spacer edge
              "rounded-t-[14px] rounded-b-0",
              // Glass gradient: stronger opacity near bottom, settles by ~2/3 height, then fades out
              // Multi-stop gradient to avoid hard banding
              "bg-[linear-gradient(to_top,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_30%,rgba(255,255,255,0.74)_66%,rgba(255,255,255,0.45)_82%,rgba(255,255,255,0.0)_100%)]",
              // Desktop keeps original recipe by reducing width/position via md: classes
              "md:rounded-b-[5px] md:rounded-t-none md:inset-y-auto md:bottom-0 md:w-auto md:self-start md:bg-white/70",
            )}
          >
            {/* Accent chip and micro-label for mobile only */}
            <div className="md:hidden px-5 pt-2.5">
              <div className="h-[2px] w-12 rounded-full bg-[color:var(--accent)]/85 drop-shadow-[0_0_6px_var(--accent)]" />
            </div>
            <div className="px-5 pb-[max(env(safe-area-inset-bottom,8px),10px)] pt-1.5 md:px-[clamp(28px,5vw,60px)] md:py-[clamp(32px,5.5vh,52px)]">
              <dl
                className={cn(
                  "grid w-full gap-y-2 gap-x-3 md:gap-y-[clamp(18px,3.2vh,26px)] md:gap-x-[clamp(16px,3vw,36px)]",
                  "text-left place-items-start md:text-center md:place-items-center",
                  gridCols,
                  "md:[&>div]:px-[min(2.2vw,36px)]",
                  "md:[&>div:not(:first-child)]:border-l md:[&>div:not(:first-child)]:border-l-white/20",
                )}
              >
                {stats.map((stat, index) => (
                  <AnimatedStat
                    key={`${stat.label || stat.value || index}`}
                    index={index}
                    stat={stat}
                    isActive={isInView}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </dl>
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

type AnimatedStatProps = {
  stat: AboutSectionResolvedStat;
  index: number;
  isActive: boolean;
  prefersReducedMotion: boolean;
};

function AnimatedStat({ stat, index, isActive, prefersReducedMotion }: AnimatedStatProps) {
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = useState(() => stat.value?.trim() || "");
  const [typedLabel, setTypedLabel] = useState<string>("");

  useEffect(() => {
    const raw = stat.value?.trim();
    if (!raw) {
      setDisplayValue("");
      return;
    }

    const parsed = parseNumericValue(raw);
    if (!parsed || prefersReducedMotion || !isActive) {
      setDisplayValue(raw);
      return;
    }

    const { number, suffix } = parsed;
    const controls = animate(0, number, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate(latest) {
        setDisplayValue(`${formatNumber(latest)}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [stat.value, prefersReducedMotion, isActive]);

  // Typewriter effect for the label on mobile; simple progressive reveal
  useEffect(() => {
    const label = stat.label?.trim() || "";
    if (!label || prefersReducedMotion || !isActive) {
      setTypedLabel(label);
      return;
    }
    setTypedLabel("");
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setTypedLabel(label.slice(0, idx));
      if (idx >= label.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [stat.label, prefersReducedMotion, isActive]);

  useEffect(() => {
    if (isActive) {
      controls.start("visible");
    }
  }, [isActive, controls]);

  const icon = stat.icon;
  const label = stat.label?.trim();

  return (
    <motion.div
      variants={statVariants}
      initial="hidden"
      animate={controls}
      custom={index}
      className="flex w-full flex-col items-start md:items-center justify-center gap-1 md:gap-[10px] px-1 py-0.5 md:px-2 md:py-1 text-left md:text-center"
    >
      <dd className="text-balance text-[clamp(1.25rem,3.8vw,1.5rem)] md:text-[clamp(3rem,5vw,4.8rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-[color:var(--foreground)] dark:text-white">
        {displayValue || "—"}
      </dd>
      <dt className="about-stats-label mt-0.5 md:mt-2 inline-flex items-center gap-1.5 text-[11px] md:text-[clamp(0.75rem,1.5vw,1rem)] uppercase tracking-[0.06em] text-[color:var(--foreground)]/70 dark:text-white/80">
        {icon?.url ? (
          <Image
            src={icon.url}
            alt={icon.alt || ""}
            width={icon.width ? Math.min(44, Math.round(icon.width)) : 36}
            height={icon.height ? Math.min(44, Math.round(icon.height)) : 36}
            className="h-3 w-3 md:h-7 md:w-7 shrink-0 object-contain opacity-80"
            placeholder={icon.lqip ? "blur" : undefined}
            blurDataURL={icon.lqip || undefined}
            aria-hidden={icon.alt ? undefined : true}
          />
        ) : null}
        <span>{typedLabel || label || "Stat"}</span>
        {label && displayValue ? (
          <span className="sr-only">{`${displayValue} ${label.toLowerCase()}`}</span>
        ) : null}
      </dt>
    </motion.div>
  );
}

type ParsedNumeric = { number: number; suffix: string } | null;

function parseNumericValue(raw: string): ParsedNumeric {
  const match = raw.match(/^(\d+\.?\d*)(.*)$/);
  if (!match) return null;
  const number = Number(match[1]);
  if (Number.isNaN(number)) return null;
  const suffix = match[2] || "";
  return { number, suffix };
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: rounded % 1 === 0 ? 0 : 2 }).format(rounded);
}
