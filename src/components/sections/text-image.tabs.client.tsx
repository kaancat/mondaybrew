"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type TabsImage = {
  url: string;
  alt: string | null;
  lqip: string | null;
  width?: number;
  height?: number;
} | null;

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
  image: TabsImage;
  imagePosition: "left" | "right";
  tabs: Tab[];
  cta?: { label: string; href: string; variant: "default" | "secondary" | "outline" | "ghost" | "link" } | null;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTab = useMemo(() => tabs.find((t) => t.id === activeId) ?? null, [tabs, activeId]);

  const leftFirst = imagePosition !== "left"; // text panel first when image is right

  // Height sync between panels with smooth growth + max cap
  const textCardRef = useRef<HTMLDivElement>(null);
  const [measuredTextHeight, setMeasuredTextHeight] = useState<number>(440);

  useEffect(() => {
    const el = textCardRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const h = Math.round(entries[0].contentRect.height);
      setMeasuredTextHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const BASE_HEIGHT = 420; // closed state base height
  const MIN_HEIGHT = 480;  // keep within site constraints
  const MAX_HEIGHT = 720;  // do not grow beyond this
  const clamp = (v:number, min:number, max:number) => Math.max(min, Math.min(max, v));
  const targetHeight = clamp(activeTab ? measuredTextHeight : BASE_HEIGHT, MIN_HEIGHT, MAX_HEIGHT);

  return (
    <div className={cn("grid gap-4 md:gap-6", "grid-cols-1 md:grid-cols-2 items-stretch")}> 
      {/* Text panel */}
      <div className={cn(leftFirst ? "order-1" : "order-2", "relative")}> 
        <div
          className={cn(
            "h-full rounded-[5px] p-6 md:p-8",
            "bg-[color:var(--services-card-bg)] text-[color:var(--services-ink-strong)]",
            "border md:border md:border-[color:color-mix(in_oklch,var(--services-ink-strong)_10%,white_90%)]"
          )}
          ref={textCardRef}
          style={{ minHeight: 420 }}
        >
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:color-mix(in_oklch,var(--services-ink-strong)_65%,white_35%)]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-2 text-[color:var(--services-ink-strong)]">{title}</h2>
          ) : null}
          {body ? (
            <p className="mt-3 text-[length:var(--font-body)] leading-relaxed text-[color:color-mix(in_oklch,var(--services-ink-strong)_82%,white_18%)]">{body}</p>
          ) : null}

          <div className="my-4 h-[1px] w-full bg-[color:color-mix(in_oklch,var(--services-ink-strong)_18%,white_82%)]" />

          <ul className="divide-y divide-[color:color-mix(in_oklch,var(--services-ink-strong)_22%,white_78%)]">
            {tabs.map((t, i) => {
              const active = t.id === activeId;
              const num = String(i + 1).padStart(2, "0");
              return (
                <li key={t.id} className="py-1.5">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-4 py-2.5 text-left transition-colors",
                      active ? "font-semibold" : "text-[color:color-mix(in_oklch,var(--services-ink-strong)_68%,white_32%)] hover:text-[color:var(--services-ink-strong)]"
                    )}
                    onClick={() => setActiveId(active ? null : t.id)}
                    aria-expanded={active}
                  >
                    <span className="truncate">{t.label || t.title || `Item ${num}`}</span>
                    <span className="tab-number text-sm opacity-60">{num}</span>
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
                          <h3 className="mt-2 text-[length:var(--font-h4)] font-semibold text-[color:var(--services-ink-strong)]">{t.title}</h3>
                        ) : null}
                        {t.body ? (
                          <p className="mt-2 text-[length:var(--font-body)] leading-relaxed text-[color:color-mix(in_oklch,var(--services-ink-strong)_80%,white_20%)]">{t.body}</p>
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
        <motion.div
          initial={false}
          animate={{ height: targetHeight }}
          transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn(
            "relative rounded-[5px]",
            image ? "bg-black/5" : "bg-transparent",
            // Keep image box visually same height as text panel
            "overflow-hidden"
          )}
          style={{ minHeight: 480 }}
        >
          {image?.url ? (
            <motion.div
              key={activeId}
              initial={{ scale: 0.98, opacity: 0.85 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={image.url}
                alt={image.alt || ""}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={image.lqip ? "blur" : "empty"}
                blurDataURL={image.lqip || undefined}
              />
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
