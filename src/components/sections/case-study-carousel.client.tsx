"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CaseStudy } from "@/types/caseStudy";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const frameRef = useRef<HTMLDivElement>(null); // non-scrolling frame
  const scrollerRef = useRef<HTMLDivElement>(null); // scrollable track
  const [index, setIndex] = useState(clampedInitial);
  const [perView, setPerView] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Responsive items per view
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // Align with site breakpoints and enforce larger cards:
      // 1 on mobile (< 768), 2 on tablet (>= 768), 3 on desktop (>= 1200)
      const next = w >= 1200 ? 3 : w >= 768 ? 2 : 1;
      setPerView(next);
      setContainerWidth(Math.floor(w));
    });
    ro.observe(el);
    // Fallback for browsers where RO may not fire as expected
    const update = () => {
      const w = el.getBoundingClientRect().width;
      const next = w >= 1200 ? 3 : w >= 768 ? 2 : 1;
      setPerView(next);
      setContainerWidth(Math.floor(w));
    };
    window.addEventListener("resize", update);
    update();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Layout constants derived from container width
  const gapPx = useMemo(() => (containerWidth >= 1200 ? 32 : 24), [containerWidth]); // lg:gap-8, base:gap-6
  const peekPx = useMemo(() => {
    if (!containerWidth) return 0;
    const pct = Math.round(containerWidth * 0.1); // 10% of visible width
    return Math.min(pct, 120); // cap at 120px
  }, [containerWidth]);

  // Derived card width and paging math
  const cardWidth = useMemo(() => {
    if (!containerWidth || perView < 1) return 0;
    // cardW = (Wv - P - (C-1)*G) / C
    const w = (containerWidth - peekPx - (perView - 1) * gapPx) / perView;
    return Math.max(0, Math.floor(w));
  }, [containerWidth, perView, gapPx, peekPx]);

  const totalWidth = useMemo(() => (items.length * cardWidth) + Math.max(0, items.length - 1) * gapPx, [items.length, cardWidth, gapPx]);
  const maxOffset = useMemo(() => Math.max(0, totalWidth - containerWidth), [totalWidth, containerWidth]);

  // Keep index clamped if layout changes
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const approx = Math.round((el.scrollLeft || 0) / Math.max(cardWidth + gapPx, 1));
    setIndex(approx);
  }, [cardWidth, gapPx]);

  // Arrows use scrollToIndex; no standalone prev/next needed

  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []);

  // Arrow chunk scroll (nudge)
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const sl = el.scrollLeft;
    const eps = 1;
    setCanPrev(sl > eps);
    setCanNext(max - sl > eps);
    const approx = Math.round(sl / Math.max(cardWidth + gapPx, 1));
    setIndex((prev) => (approx === prev ? prev : approx));
  }, [cardWidth, gapPx]);

  const scrollByChunk = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const one = cardWidth + gapPx;
    const chunk = Math.max(one, containerWidth - one);
    const next = Math.min(Math.max(0, Math.round(el.scrollLeft + dir * chunk)), Math.round(maxOffset));
    el.scrollTo({ left: next, behavior: prefersReduced ? "auto" : "smooth" });
  }, [cardWidth, gapPx, containerWidth, maxOffset, prefersReduced]);

  const announcement = useMemo(() => {
    const clamped = Math.min(Math.max(index, 0), Math.max(items.length - 1, 0));
    const current = items[clamped];
    if (!current) return "";
    return `Showing ${current.title}`;
  }, [index, items]);

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

      <div
        ref={frameRef}
        className="relative"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") scrollByChunk(-1);
          if (e.key === "ArrowRight") scrollByChunk(1);
        }}
        aria-roledescription="carousel"
        tabIndex={0}
      >
        <div
          ref={scrollerRef}
          className="no-scrollbar overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x"
          onScroll={() => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => updateEdges());
          }}
        >
          <ul
            className="flex"
            style={{ gap: `${gapPx}px`, width: `${Math.max(totalWidth, containerWidth)}px` }}
            aria-live="polite"
          >
            {items.map((item, i) => (
              <li key={item._id || i} className="shrink-0" style={{ width: `${cardWidth}px` }}>
                <CaseCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Controls bar below, fixed (not inside scroller) */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByChunk(-1)}
          disabled={!canPrev}
          aria-label="Scroll left"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
            "dark:text-[color:var(--brand-ink-strong)]",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => scrollByChunk(1)}
          disabled={!canNext}
          aria-label="Scroll right"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
            "dark:text-[color:var(--brand-ink-strong)]",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          <ArrowRightIcon />
        </button>
      </div>
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
