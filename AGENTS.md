# Agents Guide — Mobile Navigation Guardrails

Scope: everything under `web/`. These rules are binding for any changes that can affect the mobile menu.

Last updated: 2025-10-19

## High‑level Contract

- Single switch: page geometry is controlled only by `body[data-mobile-nav-open="true"]`.
- One system: CSS animates the page shell and fixed header; Framer animates only the menu’s internal content.
- Phases: `entering → opened → exiting → cleanup` (the last is a tiny internal guard to prevent post‑close snaps).
- Mirrored motion: enter and exit use the same transform and `transform-origin: left center`.

References:
- Hook: `web/src/components/shared/use-nav-phase.ts`
- Core CSS: `web/src/app/globals.css` (mobile‑nav section starts around the `body[data-mobile-nav-open]` block)
- Drawer: Radix Sheet overlay/panel styles live in the same CSS file
- Optional docs: `web/docs/MOBILE_NAV.md`

## DO

- Toggle only `body[data-mobile-nav-open]` (and the internal `body[data-nav-phase]` via the hook). Never set attributes on `<html>`.
- Keep all shell/header geometry in CSS. If you need timing changes, edit the tokens in `:root`:
  - `--nav-anim-duration`, `--nav-anim-ease` (shell)
  - `--nav-overlay-duration`, `--nav-overlay-ease` (overlay)
- Maintain mirrored exit:
  - Keep the shell’s “open layout” (height: 100vh, margin auto, overflow hidden, radius/shadow) for the entire exit.
  - Finalize on `transitionend` in `use-nav-phase`, then apply a ~40ms `cleanup` micro‑phase.
- If an embed must not move while the menu is open, wrap it with `.nav-isolate` (utility exists in globals.css).

## DON’T

- Don’t add or change selectors outside `web/src/app/globals.css` that target `body[data-mobile-nav-open]` or `.site-shell`.
- Don’t apply transforms/positioning to `.site-shell` or the fixed header from components.
- Don’t write `html[data-mobile-nav-open]` attributes anywhere, or read them in CSS/JS.
- Don’t use broad “transform‑kill” selectors (e.g. `[style*="transform"]`) — they cause drift/snap.

## Safe Change Points

- Adjust mobile drawer width via `--mobile-nav-width` in `:root`.
- Tune animation timing by editing the tokens only; JS should not set CSS vars.
- Overlay behavior: customize `[data-slot="sheet-overlay"]` rules in globals.css.

## Z‑Index and Visibility

- Overlay is provided by Radix Sheet; we do not use `body::before`.
- During `exiting`, panel content is hidden immediately to prevent “shine‑through”.
- A small (~120ms) delay on overlay fade may be present during `exiting` to mask color shifts.

## Quick Checks (pre‑commit)

Run locally before pushing nav‑related changes:

1) No stray selectors/attrs
```
rg -n "data-mobile-nav-open" web/src | rg -v "web/src/app/globals.css" && echo "OK: only globals.css modifies it"
```

2) Enter/exit parity (manual)
- Mobile viewport (≈390–430px): open → close on `/` and `/kontakt`
- Expect mirrored drawer motion, no diagonal feel, no post‑close snap, page clickable after close

3) Optional Playwright parity test
- See `web/tmp/mobile-menu-debug.spec.ts` and run it against `http://localhost:3000`

## Common Pitfalls (and fixes)

- Post‑close “snap” on homepage: caused by open‑only rules firing at cleanup. Keep the 40ms `cleanup` micro‑phase; avoid adding open‑only rules outside globals.
- Diagonal/“bottom‑right” close: ensure `transform-origin: left center` applies during `exiting` to both shell and fixed header.
- Content bleeding during exit: hide panel content during `exiting`; allow overlay to linger briefly.

## Accessibility

- Keep `SheetTitle` and `SheetDescription` (visually hidden) in the mobile drawer.
- Focus should return to the hamburger after close; if it doesn’t, update the Radix `onOpenChange` handler in `NavbarClient` to refocus.

## Ownership

- Shell/header geometry: CSS in `globals.css` only.
- Phase control: `use-nav-phase.ts` (don’t duplicate attribute writes elsewhere).
- Drawer content animation: Framer inside the panel (never the shell).

