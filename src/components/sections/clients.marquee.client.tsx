"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { buildSanityImage } from "@/lib/sanity-image";
import type { ClientLogo } from "./clients-section";

function Logo({ logo }: { logo: ClientLogo }) {
  const title = logo.title?.trim() || "Client";
  const href = logo.url?.trim();
  const asset = logo.image?.image?.asset;
  const alt = logo.image?.alt?.trim() || title;
  const built = buildSanityImage(
    asset
      ? {
        alt,
        image: logo.image?.image ?? undefined,
      }
      : undefined,
    { width: 320, quality: 75 },
  );
  const fallbackUrl = asset?.url;
  const src = built.src || fallbackUrl;
  const naturalWidth = built.width ?? asset?.metadata?.dimensions?.width ?? 200;
  const naturalHeight = built.height ?? asset?.metadata?.dimensions?.height ?? 80;
  const maxHeight = 36;
  const safeHeight = naturalHeight <= 0 ? maxHeight : naturalHeight;
  const aspectRatio = naturalWidth / safeHeight;
  const displayWidth = Math.max(24, Math.round(maxHeight * aspectRatio));
  const inner = src ? (
    <Image
      src={src}
      alt={alt}
      width={displayWidth}
      height={maxHeight}
      className="max-h-[40px] w-auto opacity-90 [filter:var(--clients-logo-filter,grayscale(100%))] group-hover:[filter:var(--clients-logo-hover-filter,none)]"
      style={{ mixBlendMode: "multiply" }}
    />
  ) : (
    <span className="px-2 text-sm text-muted-foreground">{title}</span>
  );
  if (href) return <a href={href} aria-label={`Visit ${title}`}>{inner}</a>;
  return inner;
}

function Row({ items, direction = 1, speed = 42 }: { items: ClientLogo[]; direction?: 1 | -1; speed?: number }) {
  const cleaned = useMemo(() => items.filter((l) => l?.title || l?.image?.image?.asset?.url), [items]);
  const [repeatCount, setRepeatCount] = useState(3);
  const displayItems = useMemo(() => {
    const seq: { logo: ClientLogo; key: string }[] = [];
    for (let setIndex = 0; setIndex < repeatCount; setIndex += 1) {
      const source = direction === -1 ? [...cleaned].reverse() : cleaned;
      source.forEach((logo, idx) => {
        const id = logo.title || logo.image?.image?.asset?.url || `${idx}`;
        seq.push({ logo, key: `${setIndex}-${id}-${idx}` });
      });
    }
    return seq;
  }, [cleaned, repeatCount, direction]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const autoScrollPlugin = useMemo(() => {
    const pxPerFrame = Math.max(0.3, speed / 60);
    return AutoScroll({
      speed: pxPerFrame,
      direction: direction === -1 ? "backward" : "forward",
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: false,
      playOnInit: true,
      startDelay: 0,
      rootNode: (root) => root,
    });
  }, [direction, speed]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: displayItems.length > 1,
    align: "start",
    dragFree: true,
    skipSnaps: true,
  }, [autoScrollPlugin]);

  const setViewportNode = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    emblaRef(node);
  }, [emblaRef]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, displayItems.length]);

  // Pause while dragging, resume immediately after to avoid stalling
  useEffect(() => {
    if (!emblaApi) return;
    const plugins = emblaApi.plugins() as unknown as { autoScroll?: { play: (d?: number) => void; stop: () => void } };
    const onDown = () => plugins.autoScroll?.stop();
    const onUp = () => plugins.autoScroll?.play(0);
    emblaApi.on("pointerDown", onDown);
    emblaApi.on("pointerUp", onUp);
    emblaApi.on("settle", onUp);
    return () => {
      emblaApi.off("pointerDown", onDown);
      emblaApi.off("pointerUp", onUp);
      emblaApi.off("settle", onUp);
    };
  }, [emblaApi]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const track = node.firstElementChild as HTMLElement | null;
    if (!track) return;
    const vp = node.getBoundingClientRect().width;
    const trackWidth = track.scrollWidth;
    if (!vp || !trackWidth || repeatCount > 12) return;
    const perSet = trackWidth / Math.max(1, repeatCount);
    if (!perSet) return;
    const target = vp * 2.5;
    const needed = Math.max(2, Math.ceil(target / perSet));
    if (needed > repeatCount) setRepeatCount(needed);
  }, [repeatCount, displayItems.length]);

  return (
    <div className="clients-marquee-row relative border-t border-[color:var(--color-border)] first:border-t-0">
      <div ref={setViewportNode} className="overflow-hidden" style={{ touchAction: "pan-y" }}>
        <div className="flex gap-8 py-6" style={{ willChange: "transform" }}>
          {displayItems.map(({ logo, key }) => (
            <Logo key={key} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClientsMarquee({ items }: { items: ClientLogo[] }) {
  const cleaned = useMemo(() => items.filter((l) => l?.title || l?.image?.image?.asset?.url), [items]);
  return (
    <div
      className="clients-marquee relative overflow-hidden rounded-none md:rounded-[5px] bg-white"
      style={{
        // @ts-expect-error CSS var
        "--color-border": "var(--border)",
      }}
    >
      <Row items={cleaned} direction={1} speed={42} />
      <Row items={cleaned} direction={-1} speed={48} />
    </div>
  );
}
