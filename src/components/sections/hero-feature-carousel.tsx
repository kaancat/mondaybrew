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
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-5 scale-[1.08] rounded-[5px] bg-[radial-gradient(circle_at_18%_14%,rgba(118,105,255,0.26),transparent_70%)] blur-[38px]" />
      </div>
      <div className="relative rounded-[5px] bg-gradient-to-br from-white/30 via-white/10 to-white/0 p-[1px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-white/12 bg-[rgba(20,18,28,0.58)] shadow-[0_32px_80px_rgba(8,6,20,0.35)] backdrop-blur-[22px]">
          <CardWrapper
            {...(isLink ? { href: cardHref } : {})}
            className={cn(
              "relative flex h-full flex-col outline-none transition duration-300",
              isLink &&
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60",
            )}
          >
            {active.image?.url ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[5px]">
                <Image
                  src={active.image.url}
                  alt={active.image.alt || active.title || "Hero feature"}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  placeholder={active.image.lqip ? "blur" : undefined}
                  blurDataURL={active.image.lqip}
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-t-[5px] bg-gradient-to-b from-white/12 via-transparent to-black/50" />
                {normalized.length > 1 ? (
                  <div className="absolute right-6 top-6 rounded-full bg-black/28 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                    {String(safeIndex + 1).padStart(2, "0")} / {String(normalized.length).padStart(2, "0")}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
              {active.title ? (
                <h3 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-white">
                  {active.title}
                </h3>
              ) : null}
              {active.excerpt ? (
                <p className="text-base text-white/78 sm:text-lg line-clamp-3">{active.excerpt}</p>
              ) : null}
              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                <div className="flex flex-col gap-1 text-sm font-medium text-white/72">
                  <span>{cardMetaLabel}</span>
                  {normalized.length > 1 ? (
                    <span className="text-[0.7rem] uppercase tracking-[0.28em] text-white/50">
                      {String(safeIndex + 1).padStart(2, "0")} — {String(normalized.length).padStart(2, "0")}
                    </span>
                  ) : null}
                </div>
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
                        "inline-flex size-10 items-center justify-center rounded-full border border-white/18 bg-white/14 text-white transition",
                        "hover:border-white/30 hover:bg-white/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
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
                        "inline-flex size-11 items-center justify-center rounded-full border border-white/18 bg-white/16 text-white transition",
                        "hover:border-white/32 hover:bg-white/24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/65",
                      )}
                    >
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
