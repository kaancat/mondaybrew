"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

import { defaultThemeId, themeClassMap, themeOrder } from "@/theme/registry";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem={false}
      defaultTheme={defaultThemeId}
      themes={themeOrder}
      value={themeClassMap}
      storageKey="mondaybrew.theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
