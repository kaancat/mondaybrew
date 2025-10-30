"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useNavPhase() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const EXIT_FALLBACK_MS = 360;
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
    };
  }, [clearScrollSnapshot]);

  const finalizeClose = useCallback(() => {
    const body = document.body;
    // Use the captured scroll position from when menu was opened
    const y = scrollSnapshotRef.current.value;
    
    // Micro-freeze: Lock the page at current position to prevent any flash
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    
    setMobileOpen(false);
    body.removeAttribute("data-mobile-nav-open");

    requestAnimationFrame(() => {
      // Unfreeze and restore exact scroll position
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
      clearScrollSnapshot();
    });
  }, [clearScrollSnapshot]);

  const onOpenChange = useCallback((open: boolean) => {
    if (typeof document === "undefined") return;
    const body = document.body;

    if (open) {
      setMobileOpen(true);
      captureScrollSnapshot();
      body.setAttribute("data-mobile-nav-open", "true");
      return;
    }

    // Controlled exit: keep open while reversing shell geometry via CSS
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
