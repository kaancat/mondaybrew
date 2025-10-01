"use client";

import { useMemo, useState } from "react";
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
  const normalized = useMemo(() => items.filter((item) => item.href), [items]);
  const [index, setIndex] = useState(0);

  if (!normalized.length) return null;

  const active = normalized[Math.min(index, normalized.length - 1)];

  const goNext = () => setIndex((prev) => (prev + 1) % normalized.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + normalized.length) % normalized.length);

  return (
    <div className="group relative w-full max-w-md text-white sm:max-w-sm md:mt-0 md:max-w-xs lg:max-w-sm xl:max-w-md md:absolute md:bottom-12 md:right-12">
      <Link
        href={active.href}
        className="block rounded-[5px] border border-white/18 bg-[rgba(24,24,24,0.52)] shadow-[0_40px_90px_rgba(11,8,20,0.45)] backdrop-blur-[18px] transition-all duration-300 hover:border-white/28 hover:bg-[rgba(24,24,24,0.62)]"
      >
        {active.image?.url ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[5px]">
            <Image
              src={active.image.url}
              alt={active.image.alt || active.title || "Hero feature"}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              placeholder={active.image.lqip ? "blur" : undefined}
              blurDataURL={active.image.lqip}
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
          </div>
        ) : null}
        <div className="flex flex-col gap-3 px-6 py-7">
          {active.title ? <h3 className="text-lg font-semibold leading-tight text-white">{active.title}</h3> : null}
          {active.excerpt ? (
            <p className="text-sm text-white/80 line-clamp-3">{active.excerpt}</p>
          ) : null}
          <div className="mt-4 flex items-center justify-between text-xs font-medium text-white/70">
            <span>{active.metaLabel}</span>
            {normalized.length > 1 ? (
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous hero feature"
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full border border-white/18 bg-white/8 transition",
                    "hover:border-white/28 hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
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
                    "inline-flex size-9 items-center justify-center rounded-full border border-white/18 bg-white/12 transition",
                    "hover:border-white/32 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
                  )}
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </span>
            ) : (
              <ArrowRight className="size-4" aria-hidden="true" />
            )}
          </div>
        </div>
      </Link>
      {normalized.length > 1 ? (
        <div className="absolute right-6 top-6 text-xs font-medium text-white/70">
          {String(index + 1).padStart(2, "0")}/{String(normalized.length).padStart(2, "0")}<span className="sr-only"> hero feature cards</span>
        </div>
      ) : null}
    </div>
  );
}
