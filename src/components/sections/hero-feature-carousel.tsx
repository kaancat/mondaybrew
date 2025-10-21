"use client";

import { useMemo, useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
        .filter((item) => item.href || item.title || item.excerpt || item.image?.url),
    [items],
  );
  const [index, setIndex] = useState(0);

  if (!normalized.length) return null;

  const goNext = () => setIndex((prev) => (prev + 1) % normalized.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);

  return (
    <div
      className="group absolute bottom-4 left-6 right-6 text-white sm:bottom-6 sm:left-10 sm:right-10 md:bottom-10 md:left-auto md:right-10 md:w-full md:max-w-[27.5rem]"
      style={{ zIndex: 10 }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-4 scale-[1.05] rounded-[5px] bg-[radial-gradient(circle_at_18%_20%,rgba(134,118,255,0.32),transparent_74%)] blur-[36px]" />
      </div>

      <div className="relative rounded-[5px] bg-gradient-to-br from-white/36 via-white/14 to-white/4 p-[1px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-white/16 bg-[rgba(14,12,26,0.42)] shadow-[var(--shadow-glass-lg)] backdrop-blur-[22px]">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {normalized.map((item, itemIndex) => {
                const cardHref = item.href?.trim();
                const isLink = Boolean(cardHref);
                const CardWrapper: ElementType = isLink ? Link : "div";

                return (
                  <article className="w-full shrink-0 p-[6px]" key={item.key || itemIndex}>
                    <CardWrapper
                      {...(isLink ? { href: cardHref } : {})}
                      className={cn(
                        "flex h-full overflow-hidden rounded-[5px] text-left outline-none",
                        "flex-row md:flex-col", // 2-column on mobile, single column on desktop
                        isLink &&
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                      )}
                    >
                      {/* Image - left side on mobile, top on desktop */}
                      {item.image?.url ? (
                        <div className="relative w-[45%] md:w-full aspect-square md:aspect-[4/3] shrink-0 overflow-hidden rounded-[5px]">
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || item.title || "Hero feature"}
                            fill
                            sizes="(max-width: 768px) 45vw, 600px"
                            placeholder={item.image.lqip ? "blur" : undefined}
                            blurDataURL={item.image.lqip}
                            className="object-cover"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-[5px] bg-gradient-to-b from-white/12 via-transparent to-black/42" />
                          {itemIndex === index ? (
                            <div className="absolute right-2 top-2 md:right-3 md:top-3 flex h-6 md:h-7 min-w-[2.8rem] md:min-w-[3.2rem] items-center justify-center rounded-full bg-black/35 px-2 md:px-3 text-[0.65rem] md:text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/85 leading-none">
                              {String(index + 1).padStart(2, "0")} / {String(normalized.length).padStart(2, "0")}
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {/* Text content - right side on mobile, bottom on desktop */}
                      <div className="flex flex-1 flex-col justify-between gap-2 px-3 py-3 md:gap-3 md:px-6 md:pb-6 md:pt-4">
                        <div className="flex flex-col gap-1 md:gap-2">
                          {item.title ? (
                            <h3 className="text-[0.9rem] sm:text-[1rem] md:text-[1.5rem] font-semibold leading-tight tracking-tight text-white line-clamp-2">
                              {item.title}
                            </h3>
                          ) : null}
                          {item.excerpt ? (
                            <p className="text-[0.75rem] sm:text-[0.85rem] md:text-[1.08rem] text-white/78 line-clamp-2 md:line-clamp-3">{item.excerpt}</p>
                          ) : null}
                        </div>
                        
                        {/* Navigation buttons - shown in text column on mobile only */}
                        {normalized.length > 1 && itemIndex === index ? (
                          <div className="flex justify-end md:hidden">
                            <div className="flex items-center gap-0 rounded-full border border-white/22 bg-white/12 p-[4px] backdrop-blur-sm">
                              <div className="flex items-center overflow-hidden rounded-full bg-black/24">
                                <button
                                  type="button"
                                  onClick={goPrev}
                                  aria-label="Previous hero feature"
                                  className="inline-flex h-5 w-7 items-center justify-center text-white/70 transition hover:text-white"
                                >
                                  <ArrowLeft className="size-[11px]" aria-hidden="true" />
                                </button>
                                <div className="h-4 w-px bg-white/18" aria-hidden="true" />
                                <button
                                  type="button"
                                  onClick={goNext}
                                  aria-label="Next hero feature"
                                  className="inline-flex h-5 w-7 items-center justify-center text-white transition hover:text-white"
                                >
                                  <ArrowRight className="size-[11px]" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CardWrapper>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Desktop navigation buttons only */}
          {normalized.length > 1 ? (
            <div className="hidden md:flex justify-end px-6 pb-6">
              <div className="flex items-center gap-0 rounded-full border border-white/22 bg-white/12 p-[4px] backdrop-blur-sm">
                <div className="flex items-center overflow-hidden rounded-full bg-black/24">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous hero feature"
                    className="inline-flex h-6 w-8 items-center justify-center text-white/70 transition hover:text-white"
                  >
                    <ArrowLeft className="size-[12px]" aria-hidden="true" />
                  </button>
                  <div className="h-5 w-px bg-white/18" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next hero feature"
                    className="inline-flex h-6 w-8 items-center justify-center text-white transition hover:text-white"
                  >
                    <ArrowRight className="size-[12px]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
