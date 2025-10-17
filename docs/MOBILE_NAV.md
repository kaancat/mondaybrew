# Mobile Navigation — Implementation Contract

This document explains how the mobile menu works and how to change it safely.

## Ownership

- Geometry (translate/scale of the page): CSS on `.site-shell` only.
- Drawer panel + overlay: Radix Sheet (data-state), no effect on shell geometry.
- Menu content animation: Framer (optional), must not change shell geometry.

## Phases

`<body data-nav-phase="closed|entering|opened|exiting">`

- entering: sets `data-mobile-nav-open` and animates shell to the open state.
- opened: shell is resting at open geometry.
- exiting: keeps `data-mobile-nav-open`, animates shell back to closed geometry, fades overlay.
- cleanup (internal): disables transitions for one frame while attributes are removed.

The shell uses a single transition with tokens:

```css
--nav-anim-duration: 420ms;
--nav-anim-ease: cubic-bezier(0.25,0.62,0.32,1);
```

Overlay uses:

```css
--nav-overlay-duration: 500ms;
--nav-overlay-ease: cubic-bezier(0.22,0.61,0.36,1);
```

## Do / Don’t

- Do: change timing by editing the tokens above.
- Do: keep header sticky inside `.site-shell` so it inherits the transform.
- Do: use locally scoped wrappers (e.g. `.nav-isolate`) for embeds that should not move while opened (utility is defined in CSS).
- Don’t: add global selectors like `body[data-mobile-nav-open] [style*="transform"] { … }`.
- Don’t: write CSS vars from JS; only phase attributes are set from JS.

## Safe points for changes

- Want different curves? Edit the tokens only. No JS changes needed.
- Want to isolate a new component during open? Wrap it and add a scoped rule under the existing component list.
- Want to adjust how the overlay behaves? Change the overlay tokens or the `[data-slot="sheet-overlay"]` rules.

## Tests (local)

Playwright checks live under `web/tmp/`. They open/close on `/` and `/kontakt`, asserting:

- shell transform matrix ≈ (open → closed)
- overlay opacity transitions
- page is clickable after close

> If a regression is found, first confirm phases are correct, then check for any new open‑only rules that still apply during `exiting`.
