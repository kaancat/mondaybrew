"use client";

import React, { useEffect, useMemo, useRef } from "react";

type TickerProps = React.PropsWithChildren<{ speed?: number; direction?: 1 | -1; className?: string }>;

export default function TickerCarousel({ children, speed = 42, direction = 1, className }: TickerProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null); // animated track
  const setRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const setEl = setRef.current;
    if (!wrap || !setEl) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    let resumeTimer: number | null = null;
    const apply = () => {
      const span = setEl.scrollWidth;
      const duration = Math.max(10, span / Math.max(8, speed));
      wrap.style.setProperty('--ticker-span-px', `${span}px`);
      wrap.style.setProperty('--ticker-duration', `${duration}s`);
      wrap.style.setProperty('--ticker-direction', direction === -1 ? 'reverse' : 'normal');
      wrap.style.animationPlayState = prefersReduced ? 'paused' : 'running';
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(setEl);

    const body = document.body;
    const onAttr = () => {
      const open = body.getAttribute('data-mobile-nav-open') === 'true';
      wrap.style.animationPlayState = open || prefersReduced ? 'paused' : 'running';
    };
    const mo = new MutationObserver(onAttr);
    mo.observe(body, { attributes: true, attributeFilter: ['data-mobile-nav-open'] });
    onAttr();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        wrap.style.animationPlayState = e.isIntersecting && !prefersReduced ? 'running' : 'paused';
      });
    }, { rootMargin: '50px' });
    io.observe(wrap);

    const pause = () => { wrap.style.animationPlayState = 'paused'; };
    const resume = () => { onAttr(); };

    // Desktop (hover-capable): pause on hover, resume on leave
    if (supportsHover) {
      wrap.addEventListener('pointerenter', pause, { passive: true });
      wrap.addEventListener('pointerleave', resume, { passive: true });
    } else {
      // Mobile: pause on tap, resume on release OR after a short delay
      const onDown = () => {
        pause();
        if (resumeTimer) window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(resume, 1200);
      };
      const onUp = () => {
        if (resumeTimer) { window.clearTimeout(resumeTimer); resumeTimer = null; }
        resume();
      };
      wrap.addEventListener('pointerdown', onDown, { passive: true });
      wrap.addEventListener('pointerup', onUp, { passive: true });
      wrap.addEventListener('pointercancel', onUp, { passive: true });
      // cleanup mobile listeners
      const cleanupMobile = () => {
        wrap.removeEventListener('pointerdown', onDown);
        wrap.removeEventListener('pointerup', onUp);
        wrap.removeEventListener('pointercancel', onUp);
      };
      // attach to return for proper cleanup without using `any`
      (wrap as unknown as Record<string, unknown>).__tickerCleanupMobile = cleanupMobile as unknown as () => void;
    }

    return () => {
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointerenter', pause);
      wrap.removeEventListener('pointerleave', resume);
      const clean = (wrap as unknown as Record<string, unknown>).__tickerCleanupMobile as undefined | (() => void);
      if (typeof clean === 'function') clean();
    };
  }, [speed, direction]);

  const kids = useMemo(() => React.Children.toArray(children), [children]);

  return (
    <div className={className} style={{ touchAction: 'pan-y pinch-zoom' }}>
      <div className="ticker-wrap overflow-hidden">
        <div
          ref={wrapRef}
          className="ticker-track flex will-change-transform"
          style={{
            animationName: 'ticker-left',
            animationDuration: 'var(--ticker-duration)',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: 'var(--ticker-direction, normal)'
          }}
        >
          <div ref={setRef} className="ticker-set flex">{kids}</div>
          <div className="ticker-set flex" aria-hidden>{kids}</div>
        </div>
      </div>
    </div>
  );
}
