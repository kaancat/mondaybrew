"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { themeOrder } from "@/theme/registry";

const TOKENS = [
  "--background","--foreground","--card","--border","--accent",
  "--surface-base","--surface-elevated","--surface-dark",
  "--nav-shell-bg","--nav-shell-border","--nav-link-text",
  "--cta-primary-bg","--cta-primary-text","--cta-secondary-bg","--cta-secondary-text","--cta-secondary-border",
  "--shadow-elevated-md","--shadow-elevated-lg","--shadow-hero","--shadow-glass-lg",
];

function readTokens(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const style = getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  TOKENS.forEach((k) => (out[k] = style.getPropertyValue(k).trim()));
  return out;
}

export default function TokenDumpClient() {
  const { resolvedTheme, setTheme } = useTheme();
  const [all, setAll] = useState<Record<string, Record<string, string>>>({});
  const current = useMemo(() => readTokens(), []);

  useEffect(() => {
    document.title = "Token Dump";
  }, []);

  const captureAll = async () => {
    if (typeof window === "undefined") return;
    const original = resolvedTheme as string | undefined;
    const results: Record<string, Record<string, string>> = {};
    for (const t of themeOrder) {
      setTheme(t);
      await new Promise((r) => setTimeout(r, 40));
      results[t] = readTokens();
    }
    if (original) setTheme(original);
    setAll(results);
  };

  const themes = Object.keys(all).length ? Object.keys(all) : [resolvedTheme || themeOrder[0]];

  return (
    <main className="layout-container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Token Dump</h1>
        <button
          onClick={captureAll}
          className="rounded-[5px] border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1.5 text-sm text-[color:var(--foreground)] hover:border-[color:color-mix(in_oklch,var(--foreground)_30%,transparent)]"
        >
          Compare All Themes
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {themes.map((t) => (
          <section key={t} className="rounded-[5px] border p-3">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest">{t}</h2>
            <dl className="grid grid-cols-1 gap-2">
              {(Object.entries(all[t] || current)).map(([k,v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4">
                  <dt className="text-xs text-[color:var(--muted-foreground)]">{k}</dt>
                  <dd className="text-xs font-mono">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}

