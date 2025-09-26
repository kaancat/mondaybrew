"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("consent.v1");
    if (!seen) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-muted-foreground">
          We use cookies to analyze traffic (GA4). Choose your preference.
        </p>
        <div className="ml-auto flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => {
              window.gtag?.('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
              localStorage.setItem("consent.v1", "deny");
              setVisible(false);
            }}
          >
            Deny
          </button>
          <button
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
            onClick={() => {
              window.gtag?.('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });
              localStorage.setItem("consent.v1", "grant");
              setVisible(false);
            }}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
