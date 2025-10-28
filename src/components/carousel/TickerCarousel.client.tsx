"use client";

import React, { useEffect, useMemo, useRef } from "react";

type TickerProps = React.PropsWithChildren<{ speed?: number; direction?: 1 | -1; className?: string }>;

export default function TickerCarousel({ children, speed = 28, direction = 1, className }: TickerProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null); // animated track
  const setRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null); // parent we translate for drag
  const dragState = useRef<{ pointerId: number | null; startX: number; startY: number; dragX: number; intent: 'pending'|'h'|'v' }>(
    { pointerId: null, startX: 0, startY: 0, dragX: 0, intent: 'pending' }
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const dragEl = dragRef.current;
    const setEl = setRef.current;
    if (!wrap || !setEl || !dragEl) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    const pause = () => (wrap.style.animationPlayState = 'paused');
    const resume = () => onAttr();
    wrap.addEventListener('pointerenter', pause, { passive: true });
    wrap.addEventListener('pointerleave', resume, { passive: true });
    wrap.addEventListener('pointerup', resume, { passive: true });

    // Pointer-driven drag on the parent element (does not interfere with track animation)
    const onDown = (e: PointerEvent) => {
      dragState.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, dragX: 0, intent: 'pending' };
      pause();
      dragEl.style.transition = 'none';
    };
    const onMove = (e: PointerEvent) => {
      const st = dragState.current;
      if (st.pointerId !== e.pointerId || st.pointerId === null) return;
      const dx = e.clientX - st.startX;
      const dy = e.clientY - st.startY;
      if (st.intent === 'pending') {
        if (Math.abs(dy) > Math.abs(dx) + 6 && Math.abs(dy) > 8) {
          dragState.current.intent = 'v';
          // let page handle vertical scroll; effectively cancel
          return;
        }
        if (Math.abs(dx) > 6) {
          dragState.current.intent = 'h';
        } else {
          return;
        }
      }
      if (dragState.current.intent !== 'h') return;
      dragState.current.dragX = dx;
      dragEl.style.transform = `translate3d(${dx}px,0,0)`;
    };
    const onUp = (e: PointerEvent) => {
      const st = dragState.current;
      if (st.pointerId !== e.pointerId) return;
      dragState.current.pointerId = null;
      dragEl.style.transition = 'transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1)';
      dragEl.style.transform = 'translate3d(0,0,0)';
      const tidy = () => {
        dragEl.style.transition = 'none';
        resume();
        dragEl.removeEventListener('transitionend', tidy);
      };
      dragEl.addEventListener('transitionend', tidy);
    };
    dragEl.addEventListener('pointerdown', onDown, { passive: true });
    dragEl.addEventListener('pointermove', onMove);
    dragEl.addEventListener('pointerup', onUp, { passive: true });
    dragEl.addEventListener('pointercancel', onUp, { passive: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointerenter', pause);
      wrap.removeEventListener('pointerleave', resume);
      wrap.removeEventListener('pointerup', resume);
      dragEl.removeEventListener('pointerdown', onDown);
      dragEl.removeEventListener('pointermove', onMove);
      dragEl.removeEventListener('pointerup', onUp);
      dragEl.removeEventListener('pointercancel', onUp);
    };
  }, [speed, direction]);

  const kids = useMemo(() => React.Children.toArray(children), [children]);

  return (
    <div className={className} style={{ touchAction: 'pan-y pinch-zoom' }}>
      <div ref={dragRef} className="ticker-drag-layer">
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
    </div>
  );
}
