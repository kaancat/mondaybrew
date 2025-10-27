# Mobile Nav Parity Audit

Goal: make production behave 1:1 with localdev.

What we validate in production (use `?navdebug=1`):

- body attributes: `data-mobile-nav-open`, `data-nav-phase`
- viewport transform: scale ~0.9, translateX ~ mobile-nav-width + gap
- panel: width ~ min(80vw, 360px), visible=true, z≈55, transform animates
- header: inside `.site-shell__viewport`, visible during open

Key files:

- `src/app/layout.tsx` (header placement)
- `src/app/globals.css` (tokens + transforms + panel rules)
- `src/components/shared/navbar.client.tsx` (Radix Sheet + structure)
- `src/components/shared/use-nav-phase.ts` (open/close phasing)

Recent fixes (main):

- d6b6785: Move header inside `.site-shell__viewport` (sheet travels with card)
- 14187c1: Keep header visible while open; restore clip-path silhouette
- d2f6dda: Enforce drawer width and fixed left positioning
- ad9a0f1: Add build+navdebug overlay for field debugging

Open items:

- Confirm iOS sticky behavior when address bar collapses/expands
- Confirm panel transition plays (open/close) and no stutter
- Remove `NavDebug` after parity is confirmed

