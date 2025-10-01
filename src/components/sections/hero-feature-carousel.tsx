"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
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
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-8 scale-110 rounded-[32px] bg-[radial-gradient(circle_at_30%_20%,rgba(118,105,255,0.38),transparent_60%)] blur-3xl" />
      </div>
      <div className="relative rounded-[28px] bg-gradient-to-br from-white/55 via-white/15 to-white/5 p-[1px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] border border-white/15 bg-[rgba(20,18,28,0.85)] shadow-[0_40px_80px_rgba(8,6,20,0.45)] backdrop-blur-2xl">
          <CardWrapper
            {...(isLink ? { href: cardHref } : {})}
            className={cn(
              "relative flex h-full flex-col outline-none transition duration-300",
              isLink &&
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60",
            )}
          >
            {active.image?.url ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={active.image.url}
                  alt={active.image.alt || active.title || "Hero feature"}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  placeholder={active.image.lqip ? "blur" : undefined}
                  blurDataURL={active.image.lqip}
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60" />
                <div className="absolute left-6 top-6 flex size-10 items-center justify-center rounded-full bg-white/14 backdrop-blur-md ring-1 ring-white/35">
                  <span className="text-base font-semibold leading-none text-white/90">{"//"}</span>
                </div>
                {normalized.length > 1 ? (
                  <div className="absolute right-6 top-6 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                    {String(safeIndex + 1).padStart(2, "0")} / {String(normalized.length).padStart(2, "0")}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-1 flex-col gap-4 px-7 pb-7 pt-6 sm:px-9 sm:pb-9 sm:pt-7">
              {active.title ? (
                <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white">
                  {active.title}
                </h3>
              ) : null}
              {active.excerpt ? (
                <p className="text-base text-white/80 sm:text-lg line-clamp-3">{active.excerpt}</p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-3">
                <div className="flex flex-col gap-1 text-sm font-medium text-white/70">
                  <span>{cardMetaLabel}</span>
                  {normalized.length > 1 ? (
                    <span className="text-xs uppercase tracking-[0.24em] text-white/45">
                      {String(safeIndex + 1).padStart(2, "0")} — {String(normalized.length).padStart(2, "0")}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  {normalized.length > 1 ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          goPrev();
                        }}
                        aria-label="Previous hero feature"
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition",
                          "hover:border-white/35 hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                        )}
                      >
                        <ArrowLeft className="size-4" aria-hidden="true" />
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
                          "inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white transition",
                          "hover:border-white/40 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                        )}
                      >
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}
                  <span
                    className={cn(
                      "inline-flex size-12 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white transition",
                      isLink
                        ? "group-hover:border-white/35 group-hover:bg-white/20"
                        : "text-white/50",
                    )}
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-5" />
                  </span>
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
