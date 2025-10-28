"use client";

import React, { useEffect, useMemo, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

type CarouselProps = React.PropsWithChildren<{
  options?: EmblaOptionsType;
  className?: string;
  onReady?: (api: EmblaCarouselType) => void;
  /** Pause drag/autoplay when mobile drawer is open (reads body[data-mobile-nav-open]) */
  pauseOnDrawer?: boolean;
}>;

export function Carousel({ options, className, children, onReady, pauseOnDrawer = true }: CarouselProps) {
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
    if (!emblaApi) return;
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
  }, [emblaApi, pauseOnDrawer, mergedOptions]);

  return (
    <div ref={(node) => { viewportRef.current = node; emblaRef(node as HTMLDivElement); }} className={className}>
      <div className="embla__container flex">
        {children}
      </div>
    </div>
  );
}

export function Slide({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={"embla__slide shrink-0 " + (className ?? "")}>
      {children}
    </div>
  );
}

export default Carousel;
