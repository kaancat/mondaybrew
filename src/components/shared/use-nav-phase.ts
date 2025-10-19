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
      document.documentElement.removeAttribute("data-mobile-nav-open");
    };
  }, []);

  const finalizeClose = useCallback(() => {
    // Remove attributes directly; selectors have been audited to prevent post-close transitions
    const body = document.body;
    body.removeAttribute("data-nav-phase");
    body.removeAttribute("data-mobile-nav-open");
    document.documentElement.removeAttribute("data-mobile-nav-open");
    setMobileOpen(false);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    if (typeof document === "undefined") return;
    const body = document.body;
    const html = document.documentElement;

    if (open) {
      setMobileOpen(true);
      body.setAttribute("data-mobile-nav-open", "true");
      html.setAttribute("data-mobile-nav-open", "true");
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
