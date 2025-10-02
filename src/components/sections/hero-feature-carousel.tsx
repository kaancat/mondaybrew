"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type SlideDirection = { direction: 1 | -1 };

const cardVariants: Variants = {
  enter: ({ direction }: SlideDirection) => ({
    x: direction > 0 ? 36 : -36,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: "easeOut" },
  },
  exit: ({ direction }: SlideDirection) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    scale: 0.985,
    transition: { duration: 0.26, ease: "easeIn" },
  }),
};

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
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    setIndex(0);
  }, [normalized.length]);

  if (!normalized.length) return null;

  const safeIndex = Math.min(index, normalized.length - 1);
  const active = normalized[safeIndex];

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % normalized.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);
  };

  const cardHref = active.href?.trim();
  const isLink = Boolean(cardHref);
  const CardWrapper: ElementType = isLink ? Link : "div";
  const cardMetaLabel = active.metaLabel?.trim() || "Last entries";

  return (
    <div className="group relative w-full max-w-[18rem] text-white sm:max-w-[19.5rem] md:absolute md:bottom-10 md:right-10">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-4 scale-[1.05] rounded-[6px] bg-[radial-gradient(circle_at_22%_16%,rgba(134,118,255,0.32),transparent_70%)] blur-[32px]" />
      </div>

      <AnimatePresence initial={false} custom={{ direction }}>
        <motion.div
          key={active.key}
          custom={{ direction }}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative rounded-[6px] bg-gradient-to-br from-white/32 via-white/10 to-white/0 p-[0.9px]"
        >
          <div className="relative flex h-full flex-col overflow-hidden rounded-[6px] border border-white/14 bg-[rgba(14,12,26,0.38)] shadow-[0_28px_80px_rgba(6,5,16,0.3)] backdrop-blur-[22px]">
            <CardWrapper
              {...(isLink ? { href: cardHref } : {})}
              className={cn(
                "relative flex h-full flex-col outline-none transition duration-300",
                isLink &&
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white/55",
              )}
            >
              {active.image?.url ? (
                <div className="px-3 pb-2 pt-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px]">
                    <Image
                      src={active.image.url}
                      alt={active.image.alt || active.title || "Hero feature"}
                      fill
                      sizes="(max-width: 768px) 100vw, 460px"
                      placeholder={active.image.lqip ? "blur" : undefined}
                      blurDataURL={active.image.lqip}
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[8px] bg-gradient-to-b from-white/12 via-transparent to-black/45" />
                  </div>
                  {normalized.length > 1 ? (
                    <div className="absolute right-5 top-6 rounded-full bg-black/28 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/85">
                      {String(safeIndex + 1).padStart(2, "0")} / {String(normalized.length).padStart(2, "0")}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-1.5 sm:px-5 sm:pb-6 sm:pt-2.5">
                {active.title ? (
                  <h3 className="text-[1.2rem] font-semibold leading-tight tracking-tight text-white">
                    {active.title}
                  </h3>
                ) : null}
                {active.excerpt ? (
                  <p className="text-[0.92rem] text-white/76 sm:text-[0.98rem] line-clamp-3">{active.excerpt}</p>
                ) : null}

                <div className="mt-auto flex flex-col gap-3 pt-2">
                  <div className="flex flex-col gap-1 text-xs font-medium text-white/68">
                    <span>{cardMetaLabel}</span>
                    {normalized.length > 1 ? (
                      <span className="text-[0.58rem] uppercase tracking-[0.28em] text-white/42">
                        {String(safeIndex + 1).padStart(2, "0")} — {String(normalized.length).padStart(2, "0")}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-px flex-1 rounded-full bg-white/16" aria-hidden="true" />
                    {normalized.length > 1 ? (
                      <div className="ml-3 flex items-center gap-0 rounded-full border border-white/20 bg-white/12 p-[1px] backdrop-blur-sm">
                        <div className="flex items-center overflow-hidden rounded-full border border-white/16 bg-black/24">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              goPrev();
                            }}
                            aria-label="Previous hero feature"
                            className={cn(
                              "inline-flex h-6 w-8 items-center justify-center text-white/70 transition",
                              "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                            )}
                          >
                            <ArrowLeft className="size-[12px]" aria-hidden="true" />
                          </button>
                          <div className="h-5 w-px bg-white/18" aria-hidden="true" />
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              goNext();
                            }}
                            aria-label="Next hero feature"
                            className={cn(
                              "inline-flex h-6 w-8 items-center justify-center text-white transition",
                              "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                            )}
                          >
                            <ArrowRight className="size-[12px]" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardWrapper>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
