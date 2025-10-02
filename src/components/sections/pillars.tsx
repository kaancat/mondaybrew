"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  PillarLinkReference,
  PillarsGroup,
  PillarsSectionData,
  PillarsServiceItem,
} from "./pillars.types";

type DisplayItem = {
  key: string;
  label: string;
  href?: string;
};

type DisplayGroup = {
  key: string;
  title: string;
  description: string;
  chips: string[];
  listLabel: string;
  items: DisplayItem[];
};

type PillarsSectionProps = PillarsSectionData & {
  locale?: "da" | "en";
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
): DisplayItem | null {
  const label = item?.label?.trim();
  if (!label) return null;

  const manualHref = item?.href?.trim();
  const referenceHref = resolveReferenceHref(item?.reference);
  const href = referenceHref || manualHref || undefined;

  return {
    key: `${groupIndex}-${itemIndex}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label,
    href,
  };
}

function normalizeGroup(group: PillarsGroup, index: number): DisplayGroup | null {
  if (!group) return null;

  const title = group.headline?.trim();
  const description = group.description?.trim();
  const listLabel = group.listLabel?.trim();

  if (!title || !description || !listLabel) return null;

  const chips = (group.chips || [])
    .map((chip) => chip?.trim())
    .filter((chip): chip is string => Boolean(chip));

  const items = (group.items || [])
    .map((item, itemIndex) => normalizeServiceItem(item, index, itemIndex))
    .filter((value): value is DisplayItem => Boolean(value));

  if (!chips.length || !items.length) return null;

  return {
    key: group.key?.trim() || `pillar-${index}`,
    title,
    description,
    chips,
    listLabel,
    items,
  };
}

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

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const marketingGroup = displayGroups[0];
  const webGroup = displayGroups[1];
  const trailingGroups = displayGroups.slice(2);
  const overlayActive = Boolean(
    marketingGroup &&
      webGroup &&
      isDesktop &&
      !shouldReduceMotion,
  );

  if (!displayGroups.length) {
    return null;
  }

  return (
    <section ref={sectionRef} className="layout-section layout-section-lg relative">
      <div className="layout-container space-y-12">
        {sectionTitle ? (
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            {sectionTitle}
          </p>
        ) : null}

        {overlayActive ? (
          <div className="relative isolate">
            <div className="relative isolate rounded-[5px] border border-black/8 bg-white/85 px-6 py-10 shadow-[0_45px_120px_rgba(73,68,75,0.14)] backdrop-blur lg:sticky lg:top-[88px] lg:px-10 lg:py-14">
              <div className="min-h-[clamp(90vh,120vh,140vh)]">
                <motion.div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    opacity: marketingOpacity,
                    y: marketingY,
                    pointerEvents: marketingPointer,
                  }}
                >
                  <PillarLayout data={marketingGroup} />
                </motion.div>

                <motion.div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    opacity: webOpacity,
                    y: webY,
                    pointerEvents: webPointer,
                  }}
                >
                  <PillarLayout data={webGroup} />
                </motion.div>
              </div>
            </div>
            {trailingGroups.length ? (
              <div className="mt-16 space-y-12">
                {trailingGroups.map((group) => (
                  <div
                    key={group.key}
                    className="rounded-[5px] border border-black/8 bg-white/85 px-6 py-10 shadow-[0_35px_90px_rgba(73,68,75,0.14)] backdrop-blur lg:px-10 lg:py-14"
                  >
                    <PillarLayout data={group} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-12">
            {displayGroups.map((group) => (
              <div
                key={group.key}
                className="rounded-[5px] border border-black/8 bg-white/85 px-6 py-10 shadow-[0_35px_90px_rgba(73,68,75,0.14)] backdrop-blur lg:px-10 lg:py-14"
              >
                <PillarLayout data={group} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug overlay – uncomment while tuning */}
      {/* <DebugBar progress={scrollYProgress} peA={marketingPointer} peB={webPointer} /> */}
    </section>
  );
}

function PillarLayout({ data }: { data: DisplayGroup }) {
  return (
    <div className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-14">
      <div className="max-w-[52ch] space-y-6">
        <h2 className="text-balance text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.05] text-[#1b1720]">
          {data.title}
        </h2>
        <p className="text-[clamp(1rem,1.6vw,1.25rem)] text-[#49444b]/80">
          {data.description}
        </p>
        <ul className="flex flex-wrap gap-3 pt-2">
          {data.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-[5px] bg-[#1b1720]/[0.06] px-4 py-2 text-[0.95rem] font-medium text-[#1b1720]/80"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <div className="right-list">
        <div className="mb-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#1b1720]/55">
          {data.listLabel}
        </div>
        <ul className="divide-y divide-black/10 rounded-[5px] bg-white/92">
          {data.items.map((item) => (
            <li key={item.key}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-6 px-2 py-4 text-left text-[clamp(1.35rem,2.4vw,2rem)] font-semibold text-[#1b1720]"
                  aria-label={`Open ${item.label}`}
                >
                  <span className="leading-tight">{item.label}</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#1b1720]/[0.05] text-[#1b1720]/75 transition-transform duration-150 ease-out group-hover:translate-x-1 group-hover:text-[#1b1720]">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </Link>
              ) : (
                <span
                  className="flex cursor-default items-center justify-between gap-6 px-2 py-4 text-[clamp(1.35rem,2.4vw,2rem)] font-semibold text-[#1b1720]/65"
                  aria-disabled="true"
                >
                  <span className="leading-tight">{item.label}</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#1b1720]/[0.04] text-[#1b1720]/40">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
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
