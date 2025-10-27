"use client";

import { useCallback, useEffect, useState } from "react";

export function useNavPhase() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const EXIT_FALLBACK_MS = 480;

  // Cleanup on unmount (defensive)
  useEffect(() => {
    return () => {
      if (typeof document === "undefined") return;
      document.body.removeAttribute("data-mobile-nav-open");
      document.body.removeAttribute("data-nav-phase");
    };
  }, []);

  const finalizeClose = useCallback(() => {
    const body = document.body;
    setMobileOpen(false);
    body.setAttribute("data-nav-phase", "cleanup");
    body.removeAttribute("data-mobile-nav-open");
    requestAnimationFrame(() => {
      body.removeAttribute("data-nav-phase");
    });
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    if (typeof document === "undefined") return;
    const body = document.body;

    if (open) {
      setMobileOpen(true);
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
  }, [EXIT_FALLBACK_MS, finalizeClose]);

  return { mobileOpen, onOpenChange } as const;
}
