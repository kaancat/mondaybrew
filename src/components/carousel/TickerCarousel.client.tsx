"use client";

import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

type TickerProps = React.PropsWithChildren<{ options?: EmblaOptionsType; className?: string }>;

export default function TickerCarousel({ children, options, className }: TickerProps) {
  const [emblaRef] = useEmblaCarousel(
    useMemo(() => ({ loop: true, dragFree: true, align: "start", containScroll: false, ...options }), [options])
  );

  return (
    <div ref={emblaRef} className={className} style={{ touchAction: 'pan-y pinch-zoom' }}>
      <div className="embla__container flex">
        {/* Duplicate children to ensure gapless loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
