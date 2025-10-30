"use client";

import { useMemo, useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Carousel, { Slide, PrevButton, NextButton } from "@/components/carousel/Carousel";

export type HeroFeatureDisplayItem = {
  key: string;
  title?: string | null;
  excerpt?: string | null;
  href: string;
  metaLabel?: string | null;
  image?: {
    src?: string;
    alt?: string;
    blurDataURL?: string;
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
        .filter((item) => item.href || item.title || item.excerpt || item.image?.src),
    [items],
  );
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);

  if (!normalized.length) return null;

  return (
    <div
      className="group absolute bottom-3 left-4 right-4 text-white sm:bottom-6 sm:left-10 sm:right-10 md:bottom-10 md:left-auto md:right-10 md:w-full md:max-w-[27.5rem]"
      style={{ zIndex: 10 }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 translate-y-4 scale-[1.05] rounded-[5px] bg-[radial-gradient(circle_at_18%_20%,rgba(134,118,255,0.32),transparent_74%)] blur-[36px]" />
      </div>

      <div className="relative rounded-[5px] bg-gradient-to-br from-white/36 via-white/14 to-white/4 p-[1px]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[5px] border border-white/16 bg-[rgba(14,12,26,0.42)] shadow-[var(--shadow-glass-lg)] backdrop-blur-[22px]">
          <Carousel
            options={{ loop: normalized.length > 1, align: "start", containScroll: "trimSnaps" }}
            className="overflow-hidden"
            onReady={(api) => {
              setIndex(api.selectedScrollSnap());
              setLength(api.scrollSnapList().length);
              const onSelect = () => setIndex(api.selectedScrollSnap());
              api.on("select", onSelect);
              api.on("reInit", onSelect);
            }}
          >
            {normalized.map((item, itemIndex) => {
              const cardHref = item.href?.trim();
              const isLink = Boolean(cardHref);
              const CardWrapper: ElementType = isLink ? Link : "div";
              const isActive = itemIndex === index;
              return (
                <Slide key={item.key || itemIndex} className="w-full p-[5px] md:p-[6px]">
                  <CardWrapper
                    {...(isLink ? { href: cardHref } : {})}
                    className={cn(
                      "flex h-full overflow-hidden rounded-[5px] text-left outline-none",
                      "flex-row md:flex-col",
                      isLink &&
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                      isLink &&
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/55",
                    )}
                  >
                    {item.image?.src ? (
                      <div className="relative w-[42%] md:w-full aspect-square md:aspect-[4/3] shrink-0 overflow-hidden rounded-[5px]">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt || item.title || "Hero feature"}
                          fill
                          sizes="(max-width: 768px) 42vw, 600px"
                          placeholder={item.image.blurDataURL ? "blur" : undefined}
                          blurDataURL={item.image.blurDataURL}
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-[5px] bg-gradient-to-b from-white/12 via-transparent to-black/42" />
                        {isActive ? (
                          <div className="absolute right-1.5 top-1.5 md:right-3 md:top-3 flex h-5 md:h-7 min-w-[2.6rem] md:min-w-[3.2rem] items-center justify-center rounded-full bg-black/35 px-1.5 md:px-3 text-[0.6rem] md:text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/85 leading-none">
                            {String(index + 1).padStart(2, "0")} / {String((length || normalized.length)).padStart(2, "0")}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col justify-between gap-1.5 px-2.5 py-2.5 md:gap-3 md:px-6 md:pb-6 md:pt-4">
                      <div className="flex flex-col gap-0.5 md:gap-2">
                        {item.title ? (
                          <h3 className="text-[0.85rem] sm:text-[0.95rem] md:text-[1.5rem] font-semibold leading-tight tracking-tight text-white line-clamp-2">
                            {item.title}
                          </h3>
                        ) : null}
                        {item.excerpt ? (
                          <p className="text-[0.7rem] sm:text-[0.8rem] md:text-[1.08rem] text-white/78 line-clamp-2 md:line-clamp-3 leading-snug">{item.excerpt}</p>
                        ) : null}
                      </div>

                      {normalized.length > 1 && isActive ? (
                        <div className="flex justify-end md:hidden">
                          <div className="flex items-center gap-0 rounded-full border border-white/22 bg-white/12 p-[3px] backdrop-blur-sm">
                            <div className="flex items-center overflow-hidden rounded-full bg-black/24">
                              <PrevButton ariaLabel="Previous hero feature" className="inline-flex h-[18px] w-6 items-center justify-center text-white/70 transition hover:text-white">
                                <ArrowLeft className="size-[10px]" aria-hidden="true" />
                              </PrevButton>
                              <div className="h-3 w-px bg-white/18" aria-hidden="true" />
                              <NextButton ariaLabel="Next hero feature" className="inline-flex h-[18px] w-6 items-center justify-center text-white transition hover:text-white">
                                <ArrowRight className="size-[10px]" aria-hidden="true" />
                              </NextButton>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardWrapper>
                </Slide>
              );
            })}
          </Carousel>

          {normalized.length > 1 ? (
            <div className="hidden md:flex justify-end px-6 pb-6">
              <div className="flex items-center gap-0 rounded-full border border-white/22 bg-white/12 p-[4px] backdrop-blur-sm">
                <div className="flex items-center overflow-hidden rounded-full bg-black/24">
                  <PrevButton ariaLabel="Previous hero feature" className="inline-flex h-6 w-8 items-center justify-center text-white/70 transition hover:text-white">
                    <ArrowLeft className="size-[12px]" aria-hidden="true" />
                  </PrevButton>
                  <div className="h-5 w-px bg-white/18" aria-hidden="true" />
                  <NextButton ariaLabel="Next hero feature" className="inline-flex h-6 w-8 items-center justify-center text-white transition hover:text-white">
                    <ArrowRight className="size-[12px]" aria-hidden="true" />
                  </NextButton>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
