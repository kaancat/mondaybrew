"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cardVariants = {
  enter: { opacity: 0.45, y: 18, scale: 0.99 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.2, 0.9, 0.25, 1] },
  },
  exit: {
    opacity: 0.45,
    y: -16,
    scale: 0.995,
    transition: { duration: 0.55, ease: [0.55, 0, 0.1, 1] },
  },
} as const;

const imageVariants = {
  enter: { opacity: 0.65, y: 16, scale: 1.02 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
  },
  exit: {
    opacity: 0.5,
    y: -14,
    scale: 0.997,
    transition: { duration: 0.55, ease: [0.55, 0, 0.1, 1] },
  },
} as const;

const contentVariants = {
  enter: { opacity: 0, y: 14 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.19, 1, 0.22, 1], delay: 0.08 },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.38, ease: [0.55, 0, 0.1, 1] },
  },
} as const;

export type HeroFeatureDisplayItem = {
  key: string;
  title?: string | null;
  excerpt?: string | null;
  href: string;
  metaLabel?: string | null;
  image?: {
    url?: string;
    alt?: string;
    lqip?: string;
  } | null;
};

type Props = {
  items: HeroFeatureDisplayItem[];
};

export function HeroFeatureCarousel({ items }: Props) {
  const normalized = useMemo(
    () =>
      items
        .filter((item): item is HeroFeatureDisplayItem => Boolean(item))
        .map((item) => ({
          ...item,
          href: item.href?.trim() || undefined,
        }))
        .filter((item) => item.href || item.title || item.excerpt || item.image?.url || item.metaLabel),
    [items],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [normalized.length]);

  if (!normalized.length) return null;

  const safeIndex = Math.min(index, normalized.length - 1);
  const active = normalized[safeIndex];

  const goNext = () => setIndex((prev) => (prev + 1) % normalized.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);

  const cardHref = active.href?.trim();
  const isLink = Boolean(cardHref);
  const CardWrapper: ElementType = isLink ? Link : "div";
  const cardMetaLabel = active.metaLabel?.trim() || "Last entries";

  return (
    <div className="group relative w-full max-w-lg text-white sm:max-w-md md:absolute md:bottom-16 md:right-16">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-85 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-6 scale-[1.1] rounded-[6px] bg-[radial-gradient(circle_at_20%_12%,rgba(134,118,255,0.32),transparent_72%)] blur-[44px]" />
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={active.key}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          layout
          className="relative rounded-[6px] bg-gradient-to-br from-white/38 via-white/14 to-white/0 p-[1.2px]"
        >
          <div className="relative flex h-full flex-col overflow-hidden rounded-[6px] border border-white/14 bg-[rgba(14,12,26,0.38)] shadow-[0_46px_120px_rgba(8,7,18,0.38)] backdrop-blur-[32px]">
            <CardWrapper
              {...(isLink ? { href: cardHref } : {})}
              className={cn(
                "relative flex h-full flex-col outline-none transition duration-300",
                isLink &&
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/55",
              )}
            >
              {active.image?.url ? (
                <motion.div
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[6px] px-5 pb-3 pt-5"
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  layout
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[10px]">
                    <Image
                      src={active.image.url}
                      alt={active.image.alt || active.title || "Hero feature"}
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      placeholder={active.image.lqip ? "blur" : undefined}
                      blurDataURL={active.image.lqip}
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-b from-white/14 via-transparent to-black/45" />
                  </div>
                  {normalized.length > 1 ? (
                    <motion.div
                      className="absolute right-7 top-7 rounded-full bg-black/32 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90"
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}
                    >
                      {String(safeIndex + 1).padStart(2, "0")} / {String(normalized.length).padStart(2, "0")}
                    </motion.div>
                  ) : null}
                </motion.div>
              ) : null}

              <motion.div
                className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-3 sm:px-8 sm:pb-9 sm:pt-4"
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {active.title ? (
                  <h3 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-white">
                    {active.title}
                  </h3>
                ) : null}
                {active.excerpt ? (
                  <p className="text-base text-white/78 sm:text-lg line-clamp-3">{active.excerpt}</p>
                ) : null}

                <div className="mt-auto flex flex-col gap-3 pt-3">
                  <div className="flex flex-col gap-1 text-sm font-medium text-white/72">
                    <span>{cardMetaLabel}</span>
                    {normalized.length > 1 ? (
                      <span className="text-[0.68rem] uppercase tracking-[0.28em] text-white/52">
                        {String(safeIndex + 1).padStart(2, "0")} — {String(normalized.length).padStart(2, "0")}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-px flex-1 rounded-full bg-white/14" aria-hidden="true" />
                    {normalized.length > 1 ? (
                      <div className="ml-3 flex items-center gap-0 rounded-full border border-white/22 bg-white/12 p-[2px] backdrop-blur-sm">
                        <div className="flex items-center overflow-hidden rounded-full border border-white/14 bg-black/24">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              goPrev();
                            }}
                            aria-label="Previous hero feature"
                            className={cn(
                              "inline-flex h-10 w-16 items-center justify-center border-r border-white/18 text-white/70 transition",
                              "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                            )}
                          >
                            <ArrowLeft className="size-[18px]" aria-hidden="true" />
                          </button>
                          <div className="h-full w-px bg-white/20" aria-hidden="true" />
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              goNext();
                            }}
                            aria-label="Next hero feature"
                            className={cn(
                              "inline-flex h-10 w-16 items-center justify-center text-white transition",
                              "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                            )}
                          >
                            <ArrowRight className="size-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </CardWrapper>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
