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
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
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
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT, delay: 0.25 + index * 0.08 },
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
  const imageMotionStyle = prefersReducedMotion
    ? undefined
    : {
        y: parallaxY,
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
      } as const;

  useEffect(() => {
    if (isInView) {
      overlayControls.start("visible");
      headlineControls.start("visible");
    }
  }, [isInView, overlayControls, headlineControls]);

  const gridCols = useMemo(() => {
    if (!stats?.length) return "";
    if (stats.length >= 4) return "sm:grid-cols-2 lg:grid-cols-4";
    if (stats.length === 3) return "sm:grid-cols-2 lg:grid-cols-3";
    if (stats.length === 2) return "sm:grid-cols-2";
    return "";
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
          <p className="text-[length:var(--font-tight)] uppercase tracking-[0.3em] text-[color:var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        {headline ? (
          <h2 className="text-balance text-[clamp(32px,6vw,58px)] font-semibold leading-[1.03] tracking-tight text-[color:var(--foreground)]">
            {headline}
          </h2>
        ) : null}
        {subheading ? (
          <p className="max-w-[78ch] text-[length:var(--font-body)] leading-[1.7] text-muted-foreground">
            {subheading}
          </p>
        ) : null}
      </motion.div>

      <div className="relative isolate">
        <motion.div
          style={imageMotionStyle}
          className={cn(
            "relative overflow-hidden rounded-[5px] shadow-[var(--shadow-hero)]",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--accent)_15%,transparent)_0%,transparent_60%)]",
          )}
        >
          <div className="aspect-[16/6]" />
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || "About us hero"}
              fill
              loading="lazy"
              placeholder={image.lqip ? "blur" : undefined}
              blurDataURL={image.lqip || undefined}
              sizes="(min-width: 1280px) 1100px, (min-width: 1024px) 960px, (min-width: 768px) 720px, 92vw"
              className="object-cover"
              priority={false}
            />
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
        </motion.div>

        {stats.length ? (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={overlayControls}
            className={cn(
              "relative z-10 mt-[calc(var(--flow-space)*0.4)] w-full",
              "flex flex-col gap-[clamp(16px,2.4vw,26px)] overflow-hidden rounded-[10px]",
              "border border-[color:var(--nav-shell-border)]",
              "shadow-[var(--nav-shell-shadow)] backdrop-blur-[20px]",
              "bg-[color-mix(in_oklch,var(--nav-shell-bg)_60%,transparent)]",
              "px-[clamp(24px,4vw,48px)] py-[clamp(28px,5vh,44px)]",
              "md:-translate-y-[22%] lg:-translate-y-[26%]",
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 26%, rgba(0,0,0,0.18) 100%)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[1px] opacity-70"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)",
              }}
            />
            <dl
              className={cn(
                "grid w-full gap-y-[clamp(18px,3.6vh,26px)] gap-x-[clamp(16px,3vw,36px)] relative z-10",
                "place-items-center text-center",
                gridCols,
                "lg:[&>div]:px-[min(2vw,32px)]",
                "lg:[&>div:not(:first-child)]:border-l lg:[&>div:not(:first-child)]:border-l-[color:color-mix(in_oklch,var(--border)_55%,transparent)]",
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
      className="flex w-full flex-col items-center justify-center gap-[10px] px-2 py-1 text-center"
    >
      <dd className="text-balance text-[clamp(3rem,5vw,4.8rem)] font-semibold leading-[1.02] text-[color:var(--foreground)]">
        {displayValue || "—"}
      </dd>
      <dt className="mt-2 flex items-center justify-center gap-2 text-[clamp(0.75rem,1.5vw,1rem)] uppercase tracking-[0.05em] text-muted-foreground">
        {icon?.url ? (
          <Image
            src={icon.url}
            alt={icon.alt || ""}
            width={icon.width ? Math.min(44, Math.round(icon.width)) : 36}
            height={icon.height ? Math.min(44, Math.round(icon.height)) : 36}
            className="h-7 w-7 shrink-0 object-contain opacity-80"
            placeholder={icon.lqip ? "blur" : undefined}
            blurDataURL={icon.lqip || undefined}
            aria-hidden={icon.alt ? undefined : true}
          />
        ) : null}
        <span>{label || "Stat"}</span>
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
