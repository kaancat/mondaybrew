"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

type CarouselProps = React.PropsWithChildren<{
  options?: EmblaOptionsType;
  className?: string; // viewport wrapper
  onReady?: (api: EmblaCarouselType) => void;
  /** Pause drag/autoplay when mobile drawer is open (reads body[data-mobile-nav-open]) */
  pauseOnDrawer?: boolean;
  /** Optional extra class for the inner container (track) */
  containerClassName?: string;
  /** Optional styles to apply to viewport wrapper */
  viewportStyle?: React.CSSProperties;
  /** Optional styles to apply to the inner track container */
  containerStyle?: React.CSSProperties;
}>; 

type Ctx = {
  api: EmblaCarouselType | null;
};

const CarouselCtx = createContext<Ctx>({ api: null });

export function useCarouselApi() {
  return useContext(CarouselCtx).api;
}

export function Carousel({ options, className, viewportStyle, containerClassName, containerStyle, children, onReady, pauseOnDrawer = true }: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mergedOptions = useMemo<EmblaOptionsType>(() => ({ loop: true, align: "start", containScroll: "trimSnaps", ...(options || {}) }), [options]);
  const [emblaRef, emblaApi] = useEmblaCarousel(mergedOptions);

  useEffect(() => {
    if (!emblaApi) return;
    onReady?.(emblaApi);
  }, [emblaApi, onReady]);

  // Keep vertical page scroll smooth while allowing horizontal dragging.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.style.touchAction = "pan-y pinch-zoom"; // prevents vertical-scroll lock
  }, []);

  // Pause when the mobile drawer is open to avoid interaction conflicts.
  useEffect(() => {
    if (!pauseOnDrawer) return;
    const body = document.body;
    const handle = () => {
      const open = body.getAttribute("data-mobile-nav-open") === "true";
      // Disable pointer events on the viewport while the drawer is open to avoid gesture conflicts
      if (viewportRef.current) viewportRef.current.style.pointerEvents = open ? "none" : "auto";
    };
    const mo = new MutationObserver(handle);
    mo.observe(body, { attributes: true, attributeFilter: ["data-mobile-nav-open"] });
    handle();
    return () => mo.disconnect();
  }, [pauseOnDrawer]);

  return (
    <CarouselCtx.Provider value={{ api: emblaApi ?? null }}>
      <div ref={(node) => { viewportRef.current = node; emblaRef(node as HTMLDivElement); }} className={className} style={viewportStyle}>
        <div className={"embla__container flex " + (containerClassName ?? "")} style={containerStyle}>
          {children}
        </div>
      </div>
    </CarouselCtx.Provider>
  );
}

export function Slide({ className, style, children }: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <div className={"embla__slide shrink-0 " + (className ?? "")} style={style}>
      {children}
    </div>
  );
}

export function PrevButton({ by = 1, className, children, ariaLabel = "Previous" }: { by?: number; className?: string; children?: React.ReactNode; ariaLabel?: string }) {
  const api = useCarouselApi();
  const [disabled, setDisabled] = useState(true);
  const update = useCallback(() => {
    if (!api) return;
    setDisabled(!api.canScrollPrev());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api, update]);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        if (!api) return;
        const next = Math.max(0, api.selectedScrollSnap() - by);
        api.scrollTo(next);
      }}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

export function NextButton({ by = 1, className, children, ariaLabel = "Next" }: { by?: number; className?: string; children?: React.ReactNode; ariaLabel?: string }) {
  const api = useCarouselApi();
  const [disabled, setDisabled] = useState(true);
  const update = useCallback(() => {
    if (!api) return;
    setDisabled(!api.canScrollNext());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api, update]);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        if (!api) return;
        const next = Math.min(api.scrollSnapList().length - 1, api.selectedScrollSnap() + by);
        api.scrollTo(next);
      }}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

export function Dots({ className }: { className?: string }) {
  const api = useCarouselApi();
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    setSnaps(api.scrollSnapList());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", () => {
      setSnaps(api.scrollSnapList());
      onSelect();
    });
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  if (!api || snaps.length <= 1) return null;
  return (
    <div className={className} role="tablist" aria-label="Carousel Pagination">
      {snaps.map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === selected}
          aria-label={`Go to slide ${i + 1}`}
          className={"mx-1 h-2 w-2 rounded-full " + (i === selected ? "bg-foreground" : "bg-muted")}
          onClick={() => api.scrollTo(i)}
        />
      ))}
    </div>
  );
}

export default Carousel;
