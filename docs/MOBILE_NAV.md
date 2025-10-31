# Mobile Nav — Bottom‑Sheet Experiment

This branch introduces a switchable variant for the mobile menu that mimics a bottom‑sheet pattern (inspired by dwarf.dk) while respecting our guardrails in `web/AGENTS.md`.

## How to enable

- Set `NEXT_PUBLIC_MOBILE_NAV_VARIANT=bottom` in your environment.
- Restart the dev server to pick up the env var.

When the flag is not set, the existing left drawer remains unchanged.

## Implementation notes

- We keep the single source of truth: `body[data-mobile-nav-open="true"]` via `use-nav-phase`.
- The sheet uses Radix `SheetContent` with `side="bottom"` when the flag is enabled.
- CSS in `globals.css` adds variant‑specific rules for `[data-side="bottom"]`, including rounded top corners, upward slide animation, and safe overlay handling.
- While the bottom sheet is open, the `.site-shell` does not translate sideways (gated with `:has()` so the left drawer behavior stays the same).

## Styling

- Reuses existing tokens: `--mobile-nav-surface`, `--mobile-nav-text`, `--mobile-nav-border`, etc.
- The inner content width is constrained to `max-width: 640px` for comfortable reading while filling the viewport width on small screens.
- CTA, theme toggle, and locale switch mirror the desktop setup.

## Accessibility

- `SheetTitle` and `SheetDescription` remain in the DOM (visually hidden) to satisfy dialog semantics.
- Focus is handled by Radix; focus returns to the hamburger on close via the existing `onOpenChange` handler.

