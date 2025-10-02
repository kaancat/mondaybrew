export type ThemeId = "light-primary" | "light-alt" | "dark";

type ThemeTokens = {
  background: string;
  surface: string;
  text: string;
  accent: string;
  accentForeground: string;
  border: string;
};

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  description: string;
  appearance: "light" | "dark";
  /**
   * Class name(s) applied to the <html> element by next-themes for this theme.
   * The "dark" entry must retain the literal "dark" class to keep Tailwind's
   * `.dark` variant working.
   */
  className: string;
  tokens: ThemeTokens;
}

const themeDefinitions: ThemeDefinition[] = [
  {
    id: "light-primary",
    label: "Light (Primary)",
    appearance: "light",
    description: "Brand palette — soft blue background, ink typography, orange accent.",
    className: "light-primary",
    tokens: {
      background: "#f5f7fd",
      surface: "color-mix(in oklch, white 30%, #f5f7fd)",
      text: "#49444b",
      accent: "#ff914d",
      accentForeground: "#1a1a1a",
      border: "color-mix(in oklch, #49444b 10%, white 90%)",
    },
  },
  {
    id: "light-alt",
    label: "Light (Alt)",
    appearance: "light",
    description: "Experimental neutral kit — bright white surfaces with charcoal text.",
    className: "light-alt",
    tokens: {
      background: "oklch(1 0 0)",
      surface: "oklch(0.97 0 0)",
      text: "oklch(0.145 0 0)",
      accent: "#ff914d",
      accentForeground: "oklch(0.205 0 0)",
      border: "oklch(0.922 0 0)",
    },
  },
  {
    id: "dark",
    label: "Dark",
    appearance: "dark",
    description: "Brand-aligned night mode — deep ink surfaces and warm orange highlights.",
    className: "dark theme-dark",
    tokens: {
      background: "#121017",
      surface: "color-mix(in oklch, #121017 96%, black 4%)",
      text: "#f5f7fd",
      accent: "#ff914d",
      accentForeground: "#1a1a1a",
      border: "color-mix(in oklch, #f5f7fd 12%, #121017 88%)",
    },
  },
];

export const themeRegistry = themeDefinitions;

export const themeOrder: ThemeId[] = themeDefinitions.map((theme) => theme.id);

export const themeClassMap: Record<ThemeId, string> = themeDefinitions.reduce(
  (acc, theme) => {
    acc[theme.id] = theme.className;
    return acc;
  },
  {} as Record<ThemeId, string>,
);

const FALLBACK_THEME: ThemeId = "light-primary";
const envDefault = process.env.NEXT_PUBLIC_DEFAULT_THEME as ThemeId | undefined;

export const defaultThemeId: ThemeId = envDefault && themeOrder.includes(envDefault)
  ? envDefault
  : FALLBACK_THEME;

export function getThemeDefinition(themeId: ThemeId): ThemeDefinition {
  const found = themeDefinitions.find((theme) => theme.id === themeId);
  if (!found) {
    throw new Error(`Unknown theme id: ${themeId}`);
  }
  return found;
}
