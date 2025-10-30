"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CaseStudy } from "@/types/caseStudy";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Carousel, { Slide, PrevButton, NextButton } from "@/components/carousel/Carousel";

export interface CaseStudyCarouselProps {
  items: CaseStudy[];
  initialIndex?: number;
  exploreHref?: string;
  exploreLabel?: string;
  eyebrow?: string;
  headlineText?: string;
  intro?: string;
}

export function CaseStudyCarousel({ items, initialIndex = 0, exploreHref, exploreLabel = "Explore all cases", eyebrow, headlineText, intro }: CaseStudyCarouselProps) {
  const clampedInitial = Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0));
  const frameRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<import("embla-carousel").EmblaCarouselType | null>(null);
  const [perView, setPerView] = useState(1);
  const [gapPx, setGapPx] = useState(24);
  const [peekPx, setPeekPx] = useState(80);
  const [slideWidthPx, setSlideWidthPx] = useState<number | null>(null);

  // Compute sizing in JS for robustness (no CSS var dependency)
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const compute = (w: number) => {
      const pv = w >= 1200 ? 3 : w >= 768 ? 2 : 1;
      const gap = w >= 1200 ? 32 : 24;
      const peek = Math.min(Math.round(w * 0.1), 120);
      const usable = Math.max(0, w - peek - (pv - 1) * gap);
      const slideW = Math.floor(usable / pv);
      setPerView(pv);
      setGapPx(gap);
      setPeekPx(peek);
      setSlideWidthPx(slideW);
      apiRef.current?.reInit();
    };
    const ro = new ResizeObserver(([entry]) => compute(entry.contentRect.width));
    ro.observe(el);
    // initial
    compute(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const [selected, setSelected] = useState(0);
  const announcement = useMemo(() => {
    const idx = Math.min(Math.max(selected, 0), Math.max(items.length - 1, 0));
    const current = items[idx];
    return current ? `Showing ${current.title}` : "";
  }, [selected, items]);

  return (
    <div className="group/section">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="eyebrow text-xs uppercase tracking-[0.25em] text-[color:var(--eyebrow-color,currentColor)] mb-2">{eyebrow}</div>
          ) : null}
          <h2 className="text-foreground break-words">
            {headlineText || "Our work"}
          </h2>
          {intro ? (
            <p className="mt-2 max-w-prose body-text">{intro}</p>
          ) : null}
        </div>
        {exploreHref && (
          <a href={exploreHref} className="text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring rounded-[5px] px-2 py-1 whitespace-nowrap self-start">
            {exploreLabel}
          </a>
        )}
      </div>

      <div ref={frameRef} className="relative" aria-roledescription="carousel" tabIndex={0}
        onKeyDown={(e) => {
          const api = apiRef.current;
          if (!api) return;
          const sel = api.selectedScrollSnap();
          if (e.key === "ArrowLeft") api.scrollTo(Math.max(0, sel - perView));
          if (e.key === "ArrowRight") api.scrollTo(Math.min(api.scrollSnapList().length - 1, sel + perView));
        }}
        style={{ paddingRight: `${peekPx}px` }}
      >
        <Carousel
          options={{ loop: false, align: "start", containScroll: "trimSnaps" }}
          className="overflow-hidden"
          pauseOnDrawer={false}
          // Peek pattern: viewport gets right padding, container gets negative right margin
          viewportStyle={{ paddingRight: `${peekPx}px` }}
          containerStyle={{ marginRight: `-${peekPx}px`, gap: `${gapPx}px` }}
          onReady={(embla) => {
            // Scroll to initial index on mount
            const snap = Math.min(Math.max(clampedInitial, 0), Math.max(items.length - 1, 0));
            embla.scrollTo(snap, false);
            apiRef.current = embla;
            // no-op in production; devs can inspect via __emblaCase if needed
            try {
              // @ts-expect-error debug handle only in dev
              if (typeof window !== "undefined") (window).__emblaCase = embla;
            } catch {}
            setSelected(embla.selectedScrollSnap());
            const onSelect = () => {
              setSelected(embla.selectedScrollSnap());
            };
            embla.on("select", onSelect);
            embla.on("scroll", onSelect);
            embla.on("reInit", onSelect);
            // Ensure snaps match final layout after initial paint
            if (typeof window !== "undefined") {
              requestAnimationFrame(() => embla.reInit());
            }
          }}
          overlay={
            <div className="mt-6 flex items-center justify-end gap-2">
              <PrevButton
                by={perView}
                ariaLabel="Scroll left"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
                  "dark:text-[color:var(--brand-ink-strong)]",
                  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                <ArrowLeftIcon />
              </PrevButton>
              <NextButton
                by={perView}
                ariaLabel="Scroll right"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
                  "dark:text-[color:var(--brand-ink-strong)]",
                  "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                <ArrowRightIcon />
              </NextButton>
            </div>
          }
        >
          {items.map((item, i) => (
            <Slide
              key={item._id || i}
              className="px-0"
              style={{
                width: slideWidthPx ? `${slideWidthPx}px` : undefined,
                minWidth: slideWidthPx ? `${slideWidthPx}px` : undefined,
                flex: slideWidthPx ? `0 0 ${slideWidthPx}px` : undefined,
                marginRight: `${gapPx}px`,
              }}
            >
              <CaseCard item={item} />
            </Slide>
          ))}
        </Carousel>
      </div>
      {/* Controls now rendered via Carousel overlay inside provider */}
      {/* polite announcement for screen readers */}
      <div aria-live="polite" className="sr-only" role="status">{announcement}</div>
    </div>
  );
}

function CaseCard({ item }: { item: CaseStudy }) {
  const href = item.slug ? `/cases/${item.slug}` : "/cases";
  const tags = (item.tags || []).slice(0, 3);
  const media = item.media;

  const poster = media?.poster?.image?.asset?.url || media?.image?.image?.asset?.url;
  const imageAlt = media?.image?.alt || item.title;
  const videoSrc = media?.videoFile?.asset?.url || media?.videoUrl || undefined;

  return (
    <a
      href={href}
      aria-label={`Open ${item.title}`}
      className="group block focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring rounded-[5px]"
    >
      <div className="relative rounded-[5px] shadow-[var(--shadow-card,0_24px_48px_rgba(0,0,0,0.12))] overflow-hidden">
        <div className="bg-muted/20 h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] xl:h-[420px] relative">
          {videoSrc ? (
            <VideoAuto src={videoSrc} poster={poster} />
          ) : poster ? (
            <Image
              src={poster}
              alt={imageAlt || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
      <div className="mt-4">
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="bg-muted/40 text-muted-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="text-foreground text-[1.25rem] font-semibold leading-snug">{item.title}</div>
        {item.excerpt && <p className="body-text mt-2 line-clamp-3">{item.excerpt}</p>}
      </div>
    </a>
  );
}

function VideoAuto({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // Respect reduced motion: no autoplay
    let observer: IntersectionObserver | null = null;
    const onVisible = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!el) return;
      if (entry.isIntersecting) {
        el.muted = true;
        el.play().catch(() => { });
      } else {
        el.pause();
      }
    };
    observer = new IntersectionObserver(onVisible, { rootMargin: "0px", threshold: 0.35 });
    observer.observe(el);
    return () => observer?.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="metadata"
      playsInline
      muted
      loop
      autoPlay
      className="h-full w-full object-cover"
    />
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
