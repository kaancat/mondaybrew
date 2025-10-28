"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useNavPhase() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const EXIT_FALLBACK_MS = 480;
  const scrollSnapshotRef = useRef<{ value: number }>({ value: 0 });

  const captureScrollSnapshot = useCallback(() => {
    if (typeof window === "undefined") return;
    const y = window.scrollY || window.pageYOffset || 0;
    scrollSnapshotRef.current = { value: y };
  }, []);

  const clearScrollSnapshot = useCallback(() => {
    if (typeof window === "undefined") return;
    scrollSnapshotRef.current = { value: 0 };
  }, []);

  // Cleanup on unmount (defensive)
  useEffect(() => {
    return () => {
      if (typeof document === "undefined") return;
      clearScrollSnapshot();
      document.body.removeAttribute("data-mobile-nav-open");
      document.body.removeAttribute("data-nav-phase");
    };
  }, [clearScrollSnapshot]);

  const finalizeClose = useCallback(() => {
    const body = document.body;
    const html = document.documentElement;
    // Use the captured scroll position from when menu was opened
    const y = scrollSnapshotRef.current.value;
    
    setMobileOpen(false);
    body.setAttribute("data-nav-phase", "cleanup");
    body.removeAttribute("data-mobile-nav-open");
    
    // Small delay to let exit animation complete
    setTimeout(() => {
      // Temporarily disable smooth scrolling to restore instantly
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      
      // Restore scroll position immediately
      window.scrollTo(0, y);
      
      // Restore original scroll behavior
      html.style.scrollBehavior = originalScrollBehavior;
      
      body.removeAttribute("data-nav-phase");
      clearScrollSnapshot();
    }, 50);
  }, [clearScrollSnapshot]);

  const onOpenChange = useCallback((open: boolean) => {
    if (typeof document === "undefined") return;
    const body = document.body;

    if (open) {
      setMobileOpen(true);
      captureScrollSnapshot();
      body.setAttribute("data-mobile-nav-open", "true");
      body.removeAttribute("data-nav-phase");
      return;
    }

    // Controlled exit: keep open while reversing shell geometry via CSS
    body.setAttribute("data-nav-phase", "exiting");
    setMobileOpen(true);

    const shell = document.querySelector<HTMLElement>(".site-shell");
    if (shell) {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        shell.removeEventListener("transitionend", settle);
        shell.removeEventListener("transitioncancel", settle);
        finalizeClose();
      };
      shell.addEventListener("transitionend", settle);
      shell.addEventListener("transitioncancel", settle);
      setTimeout(settle, EXIT_FALLBACK_MS);
    } else {
      finalizeClose();
    }
  }, [EXIT_FALLBACK_MS, captureScrollSnapshot, finalizeClose]);

  return { mobileOpen, onOpenChange } as const;
}
