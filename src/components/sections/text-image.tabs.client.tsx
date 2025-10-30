"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TextImageResolvedImage } from "./text-image.client";
import { useInView } from "framer-motion";

type Tab = { id: string; label: string; title?: string; body?: string };

export function TextImageTabs({
  eyebrow,
  title,
  body,
  image,
  imagePosition,
  tabs,
  cta,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  image: TextImageResolvedImage | null;
  imagePosition: "left" | "right";
  tabs: Tab[];
  cta?: { label: string; href: string; variant: "default" | "secondary" | "outline" | "ghost" | "link" } | null;
}) {
  void cta;
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const leftFirst = imagePosition !== "left"; // text panel first when image is right

  // Grid stretch keeps both panels equal-height, so no JS sync required.

  const BASE_HEIGHT = 520;
  const MOBILE_BASE_HEIGHT = 500;
  const CAP_HEIGHT = Number.POSITIVE_INFINITY;
  const textRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [imgHeight, setImgHeight] = useState(BASE_HEIGHT);

  const [isMobile, setIsMobile] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const syncImageHeight = useCallback(() => {
    // On mobile we don't force equal heights; use a compact fixed baseline
    if (isMobile) {
      setImgHeight(MOBILE_BASE_HEIGHT);
      if (imageRef.current) imageRef.current.style.height = ""; // allow CSS min-height to apply
      return;
    }
    const el = textRef.current;
    if (!el) return;
    const measured = Math.max(BASE_HEIGHT, Math.ceil(el.getBoundingClientRect().height));
    const clamped = Math.min(measured, CAP_HEIGHT);
    setImgHeight(clamped);
    if (imageRef.current) {
      imageRef.current.style.height = `${clamped}px`;
    }
  }, [isMobile, BASE_HEIGHT, MOBILE_BASE_HEIGHT, CAP_HEIGHT]);

  useEffect(() => {
    syncImageHeight();
    const el = textRef.current;
    if (!el) return;
    let ro: ResizeObserver | null = null;
    const handle = () => syncImageHeight();
    if ("ResizeObserver" in (globalThis as unknown as Window)) {
      ro = new ResizeObserver(handle);
      ro.observe(el);
    } else {
      (globalThis as unknown as Window).addEventListener("resize", handle);
    }
    return () => {
      if (ro) ro.disconnect();
      else (globalThis as unknown as Window).removeEventListener("resize", handle);
    };
  }, [syncImageHeight]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Let the DOM update, then sync heights in the next frame
    if (typeof window !== "undefined" && "requestAnimationFrame" in (globalThis as unknown as Window)) {
      (globalThis as unknown as Window).requestAnimationFrame(() => (globalThis as unknown as Window).requestAnimationFrame(syncImageHeight));
    } else {
      setTimeout(syncImageHeight, 0);
    }
  };

  // Near-viewport hint to boost fetch priority & allow idle prefetch
  const tabsRootRef = useRef<HTMLDivElement | null>(null);
  const isNear = useInView(tabsRootRef, { amount: 0, margin: "600px 0px 600px 0px" });

  useEffect(() => {
    if (!isNear || imgLoaded || !image?.src) return;
    if (typeof window === "undefined") return;
    const img = new window.Image();
    try { (img as HTMLImageElement).decoding = "async"; } catch {}
    img.src = image.src;
  }, [isNear, imgLoaded, image?.src]);

  return (
    <div ref={tabsRootRef} className={cn("grid gap-2 md:gap-4", "grid-cols-1 md:grid-cols-2 items-stretch")}> 
      {/* Text panel */}
      <div className={cn(leftFirst ? "order-1" : "order-2", "relative")}> 
        <div
          ref={textRef}
          className={cn(
            // Add mobile inner padding to avoid edge-to-edge content
            "rounded-none p-4 md:rounded-[5px] md:p-6 services-card-surface text-image-card shadow-[var(--shadow-elevated-md)] md:min-h-[520px]"
          )}
          
        >
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] services-card-eyebrow">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 data-ti-headline className="mt-2 font-semibold">{title}</h2>
          ) : null}
          {body ? (
            <p className="mt-3 services-card-body text-[length:var(--font-body)] leading-relaxed">{body}</p>
          ) : null}

          <div className="mt-6 mb-0 h-[1px] w-full services-card-divider" />

          <ul className="pt-2.5 divide-y divide-[color:color-mix(in_oklch,var(--services-ink-strong)_85%,white_15%)] border-b border-[color:color-mix(in_oklch,var(--services-ink-strong)_85%,white_15%)]">
            {tabs.map((t, i) => {
              const active = openIds.has(t.id);
              const num = String(i + 1).padStart(2, "0");
              return (
                <li key={t.id} className="py-1.5">
                  <button
                    type="button"
                    className={cn(
                      "services-card-tab flex w-full items-center justify-between gap-4 py-2.5 text-left transition-colors",
                      active && "font-semibold services-card-tab-active"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(t.id);
                      }
                    }}
                    onClick={() => toggle(t.id)}
                    aria-expanded={active}
                  >
                    <span className="truncate">{t.label || t.title || `Item ${num}`}</span>
                    <span className="tab-number services-card-tab-num text-sm opacity-60">{num}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {active && (t.title || t.body) ? (
                      <motion.div
                        key={`${t.id}-panel`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                        className="overflow-hidden pr-10"
                      >
                        {t.title ? (
                          <h3 className="mt-2 text-[length:var(--font-h4)] font-semibold">{t.title}</h3>
                        ) : null}
                        {t.body ? (
                          <p className="mt-2 services-card-body text-[length:var(--font-body)] leading-relaxed">{t.body}</p>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Image panel */}
      <div className={cn(leftFirst ? "order-2" : "order-1", "relative")}> 
        <div
          className={cn(
            "relative rounded-[5px]",
            image ? "bg-black/5" : "bg-transparent",
            "overflow-hidden min-h-[500px] md:min-h-[520px]"
          )}
          ref={imageRef}
          style={{ height: isMobile ? undefined : imgHeight, transition: "height 240ms cubic-bezier(0.22, 0.61, 0.36, 1)", willChange: "height" }}
        >
          {image?.src ? (
            <div className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt || ""}
                fill
                className={cn("object-cover scale-[1.06] md:scale-[1.08] will-change-transform transition-opacity duration-500", imgLoaded ? "opacity-100" : "opacity-0")}
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={image.blurDataURL ? "blur" : "empty"}
                blurDataURL={image.blurDataURL || undefined}
                fetchPriority={isNear ? "high" : "auto"}
                onLoadingComplete={() => setImgLoaded(true)}
              />
              {!imgLoaded ? (
                <span aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_0%,transparent_50%,rgba(0,0,0,0.06)_100%)] animate-pulse" />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
