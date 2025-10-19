"use client";

import { useCallback, useEffect, useState } from "react";

export function useNavPhase() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cleanup on unmount (defensive)
  useEffect(() => {
    return () => {
      if (typeof document === "undefined") return;
      document.body.removeAttribute("data-mobile-nav-open");
      document.body.removeAttribute("data-nav-phase");
    };
  }, []);

  const finalizeClose = useCallback(() => {
    // Freeze transitions for a tick while removing attributes to prevent last-frame snap
    const body = document.body;
    body.setAttribute("data-nav-phase", "cleanup");
    body.removeAttribute("data-mobile-nav-open");
    setMobileOpen(false);
    setTimeout(() => {
      body.removeAttribute("data-nav-phase");
    }, 40);
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
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName === "transform") {
          shell.removeEventListener("transitionend", onEnd as any);
          finalizeClose();
        }
      };
      shell.addEventListener("transitionend", onEnd as any, { once: true });
      // Fallback if transitionend is missed
      setTimeout(finalizeClose, 700);
    } else {
      finalizeClose();
    }
  }, [finalizeClose]);

  return { mobileOpen, onOpenChange } as const;
}
