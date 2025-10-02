"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-5 scale-[1.08] rounded-[5px] bg-[radial-gradient(circle_at_18%_14%,rgba(118,105,255,0.28),transparent_72%)] blur-[42px]" />
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={active.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[5px] bg-gradient-to-br from-white/28 via-white/8 to-white/0 p-[1.2px]"
        >
          <div className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-white/10 bg-[rgba(18,16,28,0.45)] shadow-[0_36px_100px_rgba(8,7,18,0.35)] backdrop-blur-[28px]">
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
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[5px] px-4 pt-4"
                  initial={{ opacity: 0.65, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.45, scale: 0.995 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  layout
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[5px]">
                    <Image
                      src={active.image.url}
                      alt={active.image.alt || active.title || "Hero feature"}
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      placeholder={active.image.lqip ? "blur" : undefined}
                      blurDataURL={active.image.lqip}
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[5px] bg-gradient-to-b from-white/10 via-transparent to-black/48" />
                  </div>
                  {normalized.length > 1 ? (
                    <motion.div
                      className="absolute right-6 top-6 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/85"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {String(safeIndex + 1).padStart(2, "0")} / {String(normalized.length).padStart(2, "0")}
                    </motion.div>
                  ) : null}
                </motion.div>
              ) : null}

              <motion.div
                className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-3 sm:px-8 sm:pb-8 sm:pt-4"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              >
                {active.title ? (
                  <h3 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-white">
                    {active.title}
                  </h3>
                ) : null}
                {active.excerpt ? (
                  <p className="text-base text-white/78 sm:text-lg line-clamp-3">{active.excerpt}</p>
                ) : null}

                <div className="mt-auto flex flex-col gap-3 pt-2">
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
                      <div className="ml-3 flex items-center gap-1.5 rounded-full border border-white/18 bg-white/12 px-1 py-0.5 backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            goPrev();
                          }}
                          aria-label="Previous hero feature"
                          className={cn(
                            "inline-flex size-10 items-center justify-center rounded-full border border-white/16 bg-black/30 text-white/90 transition",
                            "hover:border-white/26 hover:bg-black/42 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                          )}
                        >
                          <ArrowLeft className="size-[18px]" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            goNext();
                          }}
                          aria-label="Next hero feature"
                          className={cn(
                            "inline-flex size-11 items-center justify-center rounded-full border border-white/16 bg-white/20 text-white transition",
                            "hover:border-white/28 hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                          )}
                        >
                          <ArrowRight className="size-5" aria-hidden="true" />
                        </button>
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
