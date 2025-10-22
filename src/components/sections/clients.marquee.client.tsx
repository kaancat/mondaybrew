"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ClientLogo } from "./clients-section";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export default function ClientsMarquee({ items }: { items: ClientLogo[] }) {
  const reduced = usePrefersReducedMotion();
  const cleaned = useMemo(() => items.filter((l) => l?.title || l?.image?.image?.asset?.url), [items]);
  // Duplicate for seamless loop
  const rowA = [...cleaned, ...cleaned];
  const rowB = [...cleaned.slice().reverse(), ...cleaned.slice().reverse()];

  return (
    <div
      className="clients-marquee relative overflow-hidden rounded-none md:rounded-[5px] bg-white md:bg-[color:var(--card)]"
      style={{
        // @ts-expect-error CSS var
        "--color-border": "var(--border)",
      }}
    >
      <MarqueeRow items={rowA} duration={36} direction="left" paused={reduced} />
      <MarqueeRow items={rowB} duration={42} direction="right" paused={reduced} />
    </div>
  );
}

function MarqueeRow({ items, duration, direction, paused }: { items: ClientLogo[]; duration: number; direction: "left" | "right"; paused?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const anim = paused || hover ? "none" : `marquee-${direction} ${duration}s linear infinite`;

  return (
    <div className="clients-marquee-row relative border-t border-[color:var(--color-border)] first:border-t-0">
      <div
        ref={trackRef}
        className="flex gap-8 py-6 md:gap-8 md:py-6 will-change-transform"
        style={{ animation: anim }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {items.map((logo, i) => (
          <Logo key={i} logo={logo} />
        ))}
      </div>
      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function Logo({ logo }: { logo: ClientLogo }) {
  const title = logo.title?.trim() || "Client";
  const href = logo.url?.trim();
  const asset = logo.image?.image?.asset;
  const alt = logo.image?.alt?.trim() || title;
  const url = asset?.url;
  const w = Math.max(1, asset?.metadata?.dimensions?.width || 400);
  const h = Math.max(1, asset?.metadata?.dimensions?.height || 200);
  const inner = url ? (
    <Image
      src={url}
      alt={alt}
      width={Math.round(w)}
      height={Math.round(h)}
      placeholder={logo.image?.image?.asset?.metadata?.lqip ? "blur" : undefined}
      blurDataURL={logo.image?.image?.asset?.metadata?.lqip}
      className="max-h-[48px] md:max-h-[40px] w-auto opacity-90 [filter:var(--clients-logo-filter,grayscale(100%))] group-hover:[filter:var(--clients-logo-hover-filter,none)]"
      style={{ mixBlendMode: "multiply" }}
    />
  ) : (
    <span className="px-2 text-sm text-muted-foreground">{title}</span>
  );

  if (href) return <a href={href} aria-label={`Visit ${title}`}>{inner}</a>;
  return inner;
}
