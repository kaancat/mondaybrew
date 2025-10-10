"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export type TImage = {
  url?: string | null;
  alt?: string | null;
  lqip?: string | null;
  width?: number;
  height?: number;
} | null;

export type TCard = {
  variant: "image" | "quote" | "imageQuote";
  background?: string | null;
  logo?: TImage;
  image?: TImage;
  quote?: string | null;
  author?: string | null;
  role?: string | null;
  cta?: { label?: string | null; href?: string | null } | null;
};

export type TestimonialsClientProps = {
  top: TCard[];
  bottom: TCard[];
  speedTop?: number;
  speedBottom?: number;
};

// simple luminance check to pick ink
function hexToRgb(hex?: string | null) {
  if (!hex) return null;
  const h = hex.replace("#","");
  if (h.length !== 6) return null;
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return { r,g,b };
}
function pickInk(bg?: string | null) {
  const rgb = hexToRgb(bg || "");
  if (!rgb) return "var(--brand-ink-strong)";
  // relative luminance
  const a = [rgb.r, rgb.g, rgb.b].map(v=>{
    const s = v/255;
    return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055,2.4);
  });
  const L = 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
  return L > 0.5 ? "#0a0a0a" : "#ffffff";
}

function Card({ card }: { card: TCard }) {
  const bg = card.background || undefined;
  const ink = pickInk(bg);
  const textClass = ink === "#ffffff" ? "text-white" : "text-[color:var(--brand-ink-strong)]";
  const subClass = ink === "#ffffff" ? "text-white/80" : "text-[color:color-mix(in_oklch,var(--brand-ink-strong)_70%,white_30%)]";

  return (
    <div className="group/card relative min-w-[340px] max-w-[520px] shrink-0">
      <div
        className={cn(
          "card-inner relative flex h-full flex-col rounded-[10px] p-6",
          "shadow-[var(--shadow-elevated-md)] ring-1 ring-black/10 dark:ring-white/10",
          "transition-transform duration-200 ease-out will-change-transform hover:scale-[1.03]",
        )}
        style={{ background: bg ?? "var(--card)", color: ink, transformOrigin: "center" }}
      >
        {card.logo?.url ? (
          <div className="absolute right-4 top-4 h-6 w-24 opacity-90">
            <Image src={card.logo.url} alt={card.logo.alt || ""} fill className="object-contain" />
          </div>
        ) : null}

      {card.variant !== "quote" && card.image?.url ? (
        <div className="mb-4 overflow-hidden rounded-[6px]">
          <Image
            src={card.image.url}
            alt={card.image.alt || ""}
            width={Math.min(card.image.width || 960, 960)}
            height={Math.min(card.image.height || 600, 600)}
            placeholder={card.image.lqip ? "blur" : undefined}
            blurDataURL={card.image.lqip || undefined}
            className="h-40 w-full object-cover"
          />
        </div>
      ) : null}

      {card.variant !== "image" && card.quote ? (
        <blockquote className={cn("text-balance text-xl leading-[1.35]", textClass)}>
          “{card.quote}”
        </blockquote>
      ) : null}

      <div className="mt-4 h-px w-full bg-current/20" />

      <div className={cn("mt-3 text-sm font-medium uppercase tracking-[0.18em]", subClass)}>
        {card.author}
        {card.role ? <span className="opacity-70"> — {card.role}</span> : null}
      </div>

      {card.cta?.label && card.cta?.href ? (
        <div className={cn("mt-4 flex items-center justify-between text-sm", subClass)}>
          <Link href={card.cta.href} className="underline-offset-4 hover:underline">
            {card.cta.label}
          </Link>
          <span aria-hidden>→</span>
        </div>
      ) : null}
      </div>
    </div>
  );
}

function Row({ items, speed = 30, direction = 1 }: { items: TCard[]; speed?: number; direction?: 1 | -1 }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const setRef = useRef<HTMLDivElement | null>(null);
  const baseX = useMotionValue(0);
  const setWidthRef = useRef(0);
  const [setWidth, setSetWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const wrapPosition = (value: number) => {
    const width = setWidthRef.current;
    if (!width) return value;
    let v = value;
    while (v <= -width) v += width;
    while (v > 0) v -= width;
    return v;
  };

  useAnimationFrame((_, delta) => {
    const width = setWidthRef.current;
    if (!width) return;
    const step = (speed * delta) / 1000;
    let next = baseX.get() + (direction === 1 ? -step : step);
    if (next <= -width) next += width;
    if (next > 0) next -= width;
    baseX.set(next);
  });

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        baseX.set(wrapPosition(baseX.get() - e.deltaX));
      }
    };
    vp.addEventListener("wheel", onWheel, { passive: true });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [baseX]);

  useLayoutEffect(() => {
    const setEl = setRef.current;
    const vpEl = viewportRef.current;
    if (!setEl || !vpEl) return;

    const measure = () => {
      const width = setEl.offsetWidth;
      const vw = vpEl.offsetWidth;
      setSetWidth(width);
      setViewportWidth(vw);
      setWidthRef.current = width;
      baseX.set(wrapPosition(baseX.get()));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(setEl);
    observer.observe(vpEl);
    return () => observer.disconnect();
  }, [items, baseX]);

  const repeatCount = useMemo(() => {
    if (!setWidth || !viewportWidth) return 3;
    return Math.max(2, Math.ceil(viewportWidth / setWidth) + 2);
  }, [setWidth, viewportWidth]);

  const repeats = useMemo(() => Array.from({ length: repeatCount }), [repeatCount]);

  return (
    <div ref={viewportRef} className="no-scrollbar relative overflow-hidden">
      <motion.div
        style={{ x: baseX }}
        drag="x"
        dragMomentum
        onDrag={(e, info) => baseX.set(wrapPosition(baseX.get() + info.delta.x))}
        className="flex py-2"
      >
        {repeats.map((_, idx) => (
          <div key={idx} ref={idx === 0 ? setRef : undefined} className="flex gap-6 pr-6">
            {items.map((card, i) => (
              <Card key={`${idx}-${i}`} card={card} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialsMarqueeClient({ top, bottom, speedTop = 30, speedBottom = 24 }: TestimonialsClientProps) {
  return (
    <div className="relative flex flex-1 flex-col justify-end">
      {/* subtle peek of bottom row */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[12vh] bg-gradient-to-t from-background to-transparent" />
      <div className="flex flex-col gap-3 pb-3">
        <Row items={top} speed={speedTop} direction={1} />
        <Row items={bottom} speed={speedBottom} direction={-1} />
      </div>
    </div>
  );
}
