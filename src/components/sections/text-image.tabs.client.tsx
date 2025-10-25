"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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
  void cta;
  const [activeId, setActiveId] = useState<string | null>(null);

  const leftFirst = imagePosition !== "left"; // text panel first when image is right

  // Grid stretch keeps both panels equal-height, so no JS sync required.

  const MIN_HEIGHT = 520; // baseline visual height used across sections

  return (
    <div className={cn("grid gap-2 md:gap-4", "grid-cols-1 md:grid-cols-2 items-stretch")}> 
      {/* Text panel */}
      <div className={cn(leftFirst ? "order-1" : "order-2", "relative")}> 
        <div
          className={cn(
            // Mirror Services detail card classes exactly (spacing/shape)
            "rounded-none p-0 md:rounded-[5px] md:p-6",
            // Surface + ink tokens (with dark fallbacks to guarantee parity in dev)
            "bg-[color:var(--services-card-bg)] text-[color:var(--services-ink-strong)] dark:bg-[#f5f7fd] dark:text-[#0a0a0a]",
            // Border/shadow parity
            "border border-[color:var(--services-ink-strong)] dark:border-[#0a0a0a] shadow-[var(--shadow-elevated-md)]"
          )}
          style={{ minHeight: MIN_HEIGHT }}
        >
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--services-ink-strong)]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-2 font-semibold text-[color:var(--services-ink-strong)] dark:text-[#0a0a0a]">{title}</h2>
          ) : null}
          {body ? (
            <p className="mt-3 text-[length:var(--font-body)] leading-relaxed text-[color:color-mix(in_oklch,var(--services-ink-strong)_88%,white_12%)]">{body}</p>
          ) : null}

          <div className="mt-6 mb-0 h-[1px] w-full services-card-divider" />

          <ul className="pt-2.5 divide-y divide-[color:color-mix(in_oklch,var(--services-ink-strong)_85%,white_15%)] border-b border-[color:color-mix(in_oklch,var(--services-ink-strong)_85%,white_15%)]">
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
        <div
          className={cn(
            "relative rounded-[5px] md:h-full",
            image ? "bg-black/5" : "bg-transparent",
            // Keep image box visually same height as text panel
            "overflow-hidden"
          )}
          style={{ minHeight: MIN_HEIGHT }}
        >
          {image?.url ? (
            <div className="absolute inset-0">
              <Image
                src={image.url}
                alt={image.alt || ""}
                fill
                className="object-cover scale-[1.06] md:scale-[1.08] will-change-transform"
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={image.lqip ? "blur" : "empty"}
                blurDataURL={image.lqip || undefined}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
