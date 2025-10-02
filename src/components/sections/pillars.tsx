"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
import type {
  PillarLinkReference,
  PillarsGroup,
  PillarsSectionData,
  PillarsServiceItem,
} from "./pillars.types";

const TRANSITION_EASE = [0.22, 0.61, 0.36, 1] as const;

const chipsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.055,
      ease: TRANSITION_EASE,
    },
  },
};

const chipItemVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.18, ease: TRANSITION_EASE },
  },
};

const listContainerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: TRANSITION_EASE,
      staggerChildren: 0.06,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: TRANSITION_EASE },
  },
};

type DisplayServiceItem = {
  key: string;
  label: string;
  href?: string;
};

type DisplayGroup = {
  key: string;
  headline: string;
  description: string;
  chips: string[];
  listLabel: string;
  items: DisplayServiceItem[];
};

function resolveReferenceHref(reference?: PillarLinkReference | null): string | undefined {
  if (!reference?._type) return undefined;
  const slug = reference.slug?.replace(/^\/+|\/+$/g, "") || "";
  const locale = reference.locale || "da";

  switch (reference._type) {
    case "post":
      return slug ? `${locale === "en" ? "/en/blog/" : "/blog/"}${slug}` : locale === "en" ? "/en/blog" : "/blog";
    case "caseStudy":
      return slug
        ? `${locale === "en" ? "/en/cases/" : "/cases/"}${slug}`
        : locale === "en" ? "/en/cases" : "/cases";
    case "page": {
      if (!slug || slug === "home") {
        return locale === "en" ? "/en" : "/";
      }
      return `${locale === "en" ? "/en/" : "/"}${slug}`.replace(/\/+$/g, "");
    }
    default:
      return undefined;
  }
}

function normalizeServiceItem(
  item: PillarsServiceItem,
  groupIndex: number,
  itemIndex: number,
): DisplayServiceItem | null {
  if (!item?.label) return null;
  const label = item.label.trim();
  if (!label) return null;

  const manualHref = item.href?.trim();
  const referenceHref = resolveReferenceHref(item.reference);
  const href = referenceHref || manualHref || undefined;

  return {
    key: `${groupIndex}-${itemIndex}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label,
    href,
  };
}

function normalizeGroup(group: PillarsGroup, index: number): DisplayGroup | null {
  if (!group) return null;

  const headline = group.headline?.trim();
  const description = group.description?.trim();
  const listLabel = group.listLabel?.trim();

  if (!headline || !description || !listLabel) return null;

  const chips = (group.chips || []).filter((chip): chip is string => Boolean(chip?.trim())).map((chip) => chip.trim());
  const items = (group.items || [])
    .map((item, itemIndex) => normalizeServiceItem(item, index, itemIndex))
    .filter((value): value is DisplayServiceItem => Boolean(value));

  if (!chips.length || !items.length) return null;

  return {
    key: group.key?.trim() || `pillar-${index}`,
    headline,
    description,
    chips,
    listLabel,
    items,
  };
}

type PillarsSectionProps = PillarsSectionData & {
  locale?: "da" | "en";
};

export function PillarsSection({ sectionTitle, groups }: PillarsSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const displayGroups = useMemo(() => {
    return (groups || [])
      .map((group, index) => normalizeGroup(group, index))
      .filter((value): value is DisplayGroup => Boolean(value));
  }, [groups]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const marketingOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const marketingY = useTransform(scrollYProgress, [0, 0.55], [0, -24]);
  const marketingPointer = useTransform(scrollYProgress, [0.5, 0.55], ["auto", "none"]);

  const webOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.85], [0, 1, 1]);
  const webY = useTransform(scrollYProgress, [0.3, 0.85], [24, 0]);
  const webPointer = useTransform(scrollYProgress, [0.45, 0.5], ["none", "auto"]);

  const [isMounted, setIsMounted] = useState(false);
  const [shouldOverlay, setShouldOverlay] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const marketingGroup = displayGroups[0];
  const webGroup = displayGroups[1];
  const trailingGroups = displayGroups.slice(2);
  const hasOverlayCandidates = Boolean(marketingGroup && webGroup);

  const hasGroups = displayGroups.length > 0;

  useEffect(() => {
    if (!isMounted) return;
    if (shouldReduceMotion || !hasOverlayCandidates) {
      setShouldOverlay(false);
      return;
    }
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setShouldOverlay(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [hasOverlayCandidates, isMounted, shouldReduceMotion]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!shouldOverlay) return;
    const nextIndex = value < 0.5 ? 0 : 1;
    if (nextIndex !== lastIndexRef.current) {
      lastIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  });

  const commonStyle = {
    willChange: "transform, opacity" as const,
    transform: "translateZ(0)",
  };

  const overlayActive = shouldOverlay && hasOverlayCandidates;

  if (!hasGroups) {
    return null;
  }

  return (
    <Section padding="lg" className="relative">
      <div ref={sectionRef} className="relative">
        <div className="relative">
          <div
            className={cn(
              "isolate rounded-[28px] border border-black/5 bg-white/80 p-8 shadow-[0_45px_120px_rgba(73,68,75,0.12)] backdrop-blur-[36px] sm:p-10 lg:p-12",
              overlayActive ? "lg:sticky lg:top-[88px]" : undefined,
            )}
          >
            {sectionTitle ? (
              <p className="mb-8 text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                {sectionTitle}
              </p>
            ) : null}

            {overlayActive ? (
              <div className="relative min-h-[clamp(90vh,120vh,140vh)]">
                <motion.div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    ...commonStyle,
                    opacity: marketingOpacity,
                    y: marketingY,
                    pointerEvents: marketingPointer,
                  }}
                >
                  {marketingGroup ? (
                    <GroupColumns
                      group={marketingGroup}
                      isActive={activeIndex === 0}
                      overlayMode
                    />
                  ) : null}
                </motion.div>

                <motion.div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    ...commonStyle,
                    opacity: webOpacity,
                    y: webY,
                    pointerEvents: webPointer,
                  }}
                >
                  {webGroup ? (
                    <GroupColumns
                      group={webGroup}
                      isActive={activeIndex === 1}
                      overlayMode
                    />
                  ) : null}
                </motion.div>
              </div>
            ) : (
              <div className="space-y-16">
                {displayGroups.map((group) => (
                  <div
                    key={group.key}
                    className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start"
                  >
                    <GroupColumns group={group} isActive overlayMode={false} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {overlayActive && trailingGroups.length ? (
            <div className="mt-20 space-y-16">
              {trailingGroups.map((group) => (
                <div
                  key={group.key}
                  className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start"
                >
                  <GroupColumns group={group} isActive overlayMode={false} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Debug overlay — uncomment while tuning */}
      {/* <DebugBar progress={scrollYProgress} peA={marketingPointer} peB={webPointer} /> */}
    </Section>
  );
}

function GroupColumns({
  group,
  isActive,
  overlayMode,
}: {
  group: DisplayGroup;
  isActive: boolean;
  overlayMode: boolean;
}) {
  const headingAnimate = overlayMode ? (isActive ? { opacity: 1, y: 0 } : { opacity: 0.6, y: -12 }) : { opacity: 1, y: 0 };
  const bodyAnimate = overlayMode ? (isActive ? { opacity: 1, y: 0 } : { opacity: 0.48, y: -12 }) : { opacity: 1, y: 0 };
  const listAnimate = overlayMode ? (isActive ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 18 }) : { opacity: 1, y: 0 };

  return (
    <>
      <div className="space-y-8 pr-2">
        <motion.h2
          className="text-balance text-[clamp(2.5rem,4vw+1rem,4.5rem)] font-semibold leading-[1.05] text-[#1b1720]"
          initial={false}
          animate={headingAnimate}
          transition={{ duration: 0.22, ease: TRANSITION_EASE }}
        >
          {group.headline}
        </motion.h2>
        <motion.p
          className="max-w-[48ch] text-[clamp(1.05rem,1.3vw+0.8rem,1.3rem)] leading-relaxed text-[#49444b]/80"
          initial={false}
          animate={bodyAnimate}
          transition={{ duration: 0.2, ease: TRANSITION_EASE, delay: overlayMode ? 0.04 : 0 }}
        >
          {group.description}
        </motion.p>

        <motion.ul
          className="flex flex-wrap gap-3"
          variants={chipsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
        >
          {group.chips.map((chip, chipIndex) => (
            <motion.li
              key={`${group.key}-chip-${chipIndex}`}
              variants={chipItemVariants}
              className="rounded-[12px] border border-black/5 bg-white/70 px-4 py-2 text-[0.95rem] font-medium text-[#1b1720]/80 shadow-[0_6px_24px_rgba(73,68,75,0.08)] backdrop-blur"
            >
              {chip}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        className="right-list flex flex-col gap-6 rounded-[20px] border border-black/6 bg-white/70 p-6 shadow-[0_30px_80px_-50px_rgba(73,68,75,0.55)] backdrop-blur"
        initial={false}
        animate={listAnimate}
        transition={{ duration: 0.22, ease: TRANSITION_EASE, delay: overlayMode ? 0.04 : 0 }}
        style={{ transform: "translateZ(0)" }}
      >
        <span className="text-[0.82rem] font-semibold uppercase tracking-[0.42em] text-[#1b1720]/60">
          {group.listLabel}
        </span>
        <motion.ul
          className="divide-y divide-black/10 will-change-transform"
          variants={listContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
        >
          {group.items.map((item) => (
            <motion.li key={item.key} variants={listItemVariants} className="will-change-transform">
              {item.href ? (
                <Link
                  href={item.href}
                  className="group/list block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={`Open ${item.label}`}
                  style={{ transform: "translateZ(0)" }}
                >
                  <div className="flex items-center justify-between gap-6 py-4 text-left transition-colors duration-150 ease-out group-hover/list:bg-black/[0.035]">
                    <span className="text-[clamp(1.35rem,2.2vw+0.5rem,1.8rem)] font-semibold tracking-tight text-[#1b1720]">
                      {item.label}
                    </span>
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#1b1720]/70 transition duration-150 ease-out group-hover/list:-translate-x-[2px] group-hover/list:text-[#1b1720] group-focus-visible/list:-translate-x-[2px]">
                      <ArrowUpRight className="size-5 transition-transform duration-150 ease-out group-hover/list:translate-x-[4px] group-focus-visible/list:translate-x-[4px]" />
                    </span>
                  </div>
                </Link>
              ) : (
                <span
                  className="block cursor-default select-none opacity-75"
                  aria-disabled="true"
                  style={{ transform: "translateZ(0)" }}
                >
                  <div className="flex items-center justify-between gap-6 py-4 text-left">
                    <span className="text-[clamp(1.35rem,2.2vw+0.5rem,1.8rem)] font-semibold tracking-tight text-[#1b1720]/70">
                      {item.label}
                    </span>
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-[#1b1720]/40">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </span>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DebugBar({
  progress,
  peA,
  peB,
}: {
  progress: MotionValue<number>;
  peA: MotionValue<string>;
  peB: MotionValue<string>;
}) {
  const percent = useTransform(progress, [0, 1], [0, 100]);
  const percentText = useTransform(percent, (value) => `${value.toFixed(1)}%`);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        borderRadius: 6,
        padding: "8px 10px",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div>
          progress: <motion.span>{percentText}</motion.span>
        </div>
        <div>
          Marketing pointer: <motion.span>{peA}</motion.span>
        </div>
        <div>
          Web pointer: <motion.span>{peB}</motion.span>
        </div>
      </div>
      <motion.div
        style={{ height: 4, marginTop: 6, background: "#333", borderRadius: 3 }}
      >
        <motion.div
          style={{
            height: 4,
            width: useTransform(percent, (value) => `${value}%`),
            background: "#FF914D",
            borderRadius: 3,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export type { PillarsSectionData };
