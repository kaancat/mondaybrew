"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { CaseStudy } from "@/types/caseStudy";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

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
  const [perView, setPerView] = useState(1);
  const [peek, setPeek] = useState(0);
  const [gap, setGap] = useState(24);

  // Responsive items per view (1 / 2 / 3) and dynamic peek & gaps
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      // Measure the actual carousel frame width (includes break-out margins)
      const frameWidth = el.getBoundingClientRect().width;
      const pv = frameWidth >= 1200 ? 3 : frameWidth >= 768 ? 2 : 1;
      setPerView(pv);
      const gapSize = frameWidth >= 1200 ? 32 : 24;
      setGap(gapSize);
      // Peek should be visible portion of 4th card (10% of frame width, max 120px)
      const peekSize = Math.min(Math.round(frameWidth * 0.1), 120);
      setPeek(peekSize);
    };
    // Initial update
    update();
    // Observe frame resizes
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Also listen to window resize for viewport changes
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Calculate slide width - ensure 4th card peeks when perView = 3
  const slideWidth = useMemo(() => {
    const el = frameRef.current;
    if (!el) return 300;
    // Get the viewport element (the overflow-hidden div)
    const viewportEl = el.querySelector('[class*="overflow-hidden"]') as HTMLElement;
    if (!viewportEl) return 300;
    // Get the viewport's bounding rect width (includes padding)
    const viewportTotalWidth = viewportEl.getBoundingClientRect().width;
    // Viewport has paddingLeft: 24px and paddingRight: peek
    // Container compensates with marginLeft: -24px, marginRight: -peek
    // So slides can span: viewportTotalWidth (full width including padding, since container compensates)
    // For peek: we want (perView * slideWidth) + ((perView-1) * gap) to be LESS than viewportTotalWidth by 'peek' amount
    // So: (perView * slideWidth) + ((perView-1) * gap) = viewportTotalWidth - peek
    // Therefore: slideWidth = (viewportTotalWidth - peek - (perView-1) * gap) / perView
    return (viewportTotalWidth - peek - (perView - 1) * gap) / perView;
  }, [peek, gap, perView]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: false, // Allow scrolling beyond last slide to show peek
    skipSnaps: false,
    dragFree: false,
  });

  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Scroll to initial index
    emblaApi.scrollTo(clampedInitial, true);
    
    const updateState = () => {
      setSelected(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    
    updateState();
    emblaApi.on("select", updateState);
    emblaApi.on("scroll", updateState);
    emblaApi.on("reInit", updateState);
    
    return () => {
      emblaApi.off("select", updateState);
      emblaApi.off("scroll", updateState);
      emblaApi.off("reInit", updateState);
    };
  }, [emblaApi, clampedInitial]);

  // Reinitialize Embla when dimensions change to ensure proper slide sizing
  useEffect(() => {
    if (!emblaApi || !slideWidth) return;
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      emblaApi.reInit();
    });
  }, [emblaApi, slideWidth, peek, gap, perView]);

  const announcement = useMemo(() => {
    const idx = Math.min(Math.max(selected, 0), Math.max(items.length - 1, 0));
    const current = items[idx];
    return current ? `Showing ${current.title}` : "";
  }, [selected, items]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

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

      {/* Full-width carousel wrapper - completely detached from page constraints */}
      <div
        ref={frameRef}
        className="relative"
        style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
        }}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") scrollPrev();
          if (e.key === "ArrowRight") scrollNext();
        }}
      >
        <div
          className="relative"
          style={{
            paddingLeft: 'var(--container-gutter)',
            paddingRight: 'var(--container-gutter)',
          }}
        >
          <div
            ref={emblaRef}
            className="overflow-hidden"
            style={{
              paddingLeft: '24px',
              paddingRight: `${peek}px`,
              touchAction: "pan-y pinch-zoom",
            }}
          >
            <div
              className="flex"
              style={{
                marginLeft: '-24px',
                marginRight: `-${peek}px`,
                gap: `${gap}px`,
              }}
            >
              {items.map((item, i) => (
                <div
                  key={item._id || i}
                  className="shrink-0"
                  style={{
                    width: slideWidth,
                    minWidth: slideWidth,
                    flex: `0 0 ${slideWidth}px`,
                  }}
                >
                  <CaseCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls bar below, fixed (not inside scroller) */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Scroll left"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
            "dark:text-[color:var(--brand-ink-strong)]",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-opacity",
          )}
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Scroll right"
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-[5px] border bg-card text-foreground shadow-sm",
            "dark:text-[color:var(--brand-ink-strong)]",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-opacity",
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
    if (reduce) return;
    let observer: IntersectionObserver | null = null;
    const onVisible = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!el) return;
      if (entry.isIntersecting) {
        el.muted = true;
        el.play().catch(() => {});
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
