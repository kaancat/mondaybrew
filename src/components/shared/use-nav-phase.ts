"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useNavPhase() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const EXIT_FALLBACK_MS = 480;
  const scrollSnapshotRef = useRef<{ value: number; behavior: string }>({ value: 0, behavior: "" });

  const captureScrollSnapshot = useCallback(() => {
    if (typeof window === "undefined") return;
    const y = window.scrollY || window.pageYOffset || 0;
    scrollSnapshotRef.current = {
      value: y,
      behavior: "",
    };
    document.body.style.setProperty("--nav-scroll-offset", `${y}px`);
  }, []);

  const clearScrollSnapshot = useCallback(() => {
    if (typeof window === "undefined") return;
    document.body.style.removeProperty("--nav-scroll-offset");
    scrollSnapshotRef.current = { value: 0, behavior: "" };
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
    // Micro-freeze the page at the current scroll position to avoid any
    // browser relayout that might momentarily place the document at scrollTop=0
    // as we remove the open attribute.
    const y = window.scrollY || window.pageYOffset || 0;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    setMobileOpen(false);
    body.setAttribute("data-nav-phase", "cleanup");
    body.removeAttribute("data-mobile-nav-open");
    requestAnimationFrame(() => {
      // Unfreeze and restore exact scroll position before cleaning up phase.
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
      body.removeAttribute("data-nav-phase");
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
      body.removeAttribute("data-nav-phase");
      return;
    }

    // Controlled exit: keep open while reversing shell geometry via CSS
    body.setAttribute("data-nav-phase", "exiting");
    setMobileOpen(true);

    const shell = document.querySelector<HTMLElement>(".site-shell__viewport");
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
