"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const VARS = [
  "--mb-ink","--mb-bg","--mb-accent",
  "--background","--foreground","--card","--card-foreground","--popover","--popover-foreground",
  "--primary","--primary-foreground","--secondary","--secondary-foreground","--muted","--muted-foreground",
  "--accent","--accent-foreground","--destructive","--border","--input","--ring",
  "--surface-base","--surface-elevated","--surface-dark","--surface-gradient",
  "--nav-shell-bg","--nav-shell-border","--nav-shell-text",
  "--nav-link-text","--nav-link-hover-bg","--nav-link-hover-text","--nav-link-active-bg","--nav-link-active-text",
  "--nav-toggle-border","--nav-toggle-bg","--nav-toggle-text","--nav-toggle-hover-border","--nav-toggle-hover-bg","--nav-toggle-ring","--nav-toggle-ring-offset",
  "--nav-locale-bg","--nav-locale-hover-bg","--nav-locale-text"
];

export default function TokenDump() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DUMP_TOKENS !== "1") return;
    if (resolvedTheme !== "light-alt") return;
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const values: Record<string, string> = {};
    VARS.forEach((k) => (values[k] = style.getPropertyValue(k).trim()));
    // eslint-disable-next-line no-console
    console.log("[Light Alt Token Dump]", values);
  }, [resolvedTheme]);

  return null;
}

