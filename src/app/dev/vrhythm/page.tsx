"use client";

import { useEffect, useMemo, useState } from "react";

export default function VRhythmDebug() {
  const [vars, setVars] = useState<{ sm: string; md: string; lg: string } | null>(null);
  const disabled = useMemo(() => process.env.NODE_ENV === "production", []);

  useEffect(() => {
    if (disabled) return;
    const cs = getComputedStyle(document.documentElement);
    setVars({
      sm: cs.getPropertyValue("--section-gap-sm").trim(),
      md: cs.getPropertyValue("--section-gap-md").trim(),
      lg: cs.getPropertyValue("--section-gap-lg").trim(),
    });
  }, [disabled]);

  if (disabled) {
    return (
      <main className="layout-container py-10">
        <p className="text-muted-foreground">vrhythm debug is disabled in production.</p>
      </main>
    );
  }

  const toggleOutlines = () => {
    document.querySelectorAll<HTMLElement>(".vr-hero,.vr-section,.vr-section-tight").forEach((el) => {
      el.style.outline = el.style.outline ? "" : "2px dashed var(--accent)";
      el.style.outlineOffset = el.style.outline ? "" : "4px";
    });
  };

  return (
    <main className="layout-container py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Vertical Rhythm Debug</h1>
      <div className="text-sm text-muted-foreground">
        <div>--section-gap-sm: {vars?.sm || "…"}</div>
        <div>--section-gap-md: {vars?.md || "…"}</div>
        <div>--section-gap-lg: {vars?.lg || "…"}</div>
      </div>
      <button
        onClick={toggleOutlines}
        className="inline-flex items-center gap-2 rounded-[5px] border px-3 py-2 text-sm"
      >
        Toggle section outlines on this page
      </button>
      <p className="text-sm text-muted-foreground">
        Tip: Navigate to the homepage and run this in the console to outline wrappers there too:
      </p>
      <pre className="rounded-[5px] border bg-muted/30 p-3 text-xs overflow-auto">
{`document.querySelectorAll('.vr-hero,.vr-section,.vr-section-tight').forEach(el=>{el.style.outline='2px dashed var(--accent)';el.style.outlineOffset='4px'});`}
      </pre>
    </main>
  );
}

