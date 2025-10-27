"use client";

import { useEffect, useState } from "react";

type Snapshot = {
  buildSha?: string | null;
  buildEnv?: string | null;
  body?: { mobileNavOpen?: string | null; navPhase?: string | null };
  viewportTransform?: string | null;
  contentTransform?: string | null;
  panel?: { width?: string; opacity?: string; visibility?: string; transform?: string; z?: string } | null;
};

function readSnapshot(): Snapshot {
  const body = document.body;
  const viewport = document.querySelector<HTMLElement>(".site-shell__viewport");
  const content = document.querySelector<HTMLElement>(".site-shell__content");
  const panel = document.querySelector<HTMLElement>("[data-slot=\"sheet-content\"].mobile-nav-panel");
  const panelStyles = panel ? getComputedStyle(panel) : null;
  return {
    buildSha: body?.getAttribute("data-build-sha"),
    buildEnv: body?.getAttribute("data-build-env"),
    body: {
      mobileNavOpen: body?.getAttribute("data-mobile-nav-open"),
      navPhase: body?.getAttribute("data-nav-phase"),
    },
    viewportTransform: viewport ? getComputedStyle(viewport).transform : null,
    contentTransform: content ? getComputedStyle(content).transform : null,
    panel: panelStyles
      ? {
          width: panelStyles.width,
          opacity: panelStyles.opacity,
          visibility: panelStyles.visibility,
          transform: panelStyles.transform,
          z: panelStyles.zIndex,
        }
      : null,
  };
}

export default function NavDebug() {
  const [enabled, setEnabled] = useState(false);
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    const qp = new URLSearchParams(window.location.search);
    setEnabled(qp.get("navdebug") === "1");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const update = () => setSnap(readSnapshot());
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.body, { attributes: true, attributeFilter: ["data-mobile-nav-open", "data-nav-phase"] });
    const interval = window.setInterval(update, 200);
    return () => {
      mo.disconnect();
      window.clearInterval(interval);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 6,
        bottom: 6,
        zIndex: 99999,
        fontSize: 11,
        lineHeight: 1.25,
        color: "#111",
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(0,0,0,0.2)",
        borderRadius: 6,
        padding: "8px 10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        maxWidth: 320,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Nav Debug</div>
      <div>build: {snap?.buildEnv || "n/a"} • {snap?.buildSha || "n/a"}</div>
      <div>body: open={String(snap?.body?.mobileNavOpen || null)} phase={String(snap?.body?.navPhase || null)}</div>
      <div>viewport: {snap?.viewportTransform || "none"}</div>
      <div>content: {snap?.contentTransform || "none"}</div>
      <div>panel: {snap?.panel ? `${snap.panel.width}, ${snap.panel.visibility}, op=${snap.panel.opacity}, z=${snap.panel.z}` : "none"}</div>
      <div>panel transform: {snap?.panel?.transform || "none"}</div>
      <div style={{ marginTop: 6, opacity: 0.75 }}>Add ?navdebug=1 to toggle.</div>
    </div>
  );
}

