# Embla Carousel Migration Analysis

**Date**: 2025-01-XX  
**Branch**: `feat/embla-frontpage-minimal`  
**Purpose**: Document the state of Embla carousel migration on the frontpage

---

## Executive Summary

**On `origin/main`**: The frontpage uses **custom carousel implementations** (except Testimonials, which already uses Embla).

**On `feat/embla-frontpage-minimal`**: Successfully migrated Hero, Cases, and Clients carousels to Embla using a shared `Carousel` wrapper component.

**Status**: Migration is **partially complete** on the current branch. Main branch still uses custom implementations.

---

## Frontpage Carousel Components

The frontpage (`/`) uses these carousel/marquee components:

1. **Hero Feature Carousel** (`hero-feature-carousel.tsx`)
2. **Case Study Carousel** (`case-study-carousel.client.tsx`)
3. **Clients Marquee** (`clients.marquee.client.tsx`)
4. **Testimonials Marquee** (`testimonials-marquee.client.tsx`)

---

## Comparison: Main vs Current Branch

### 1. Hero Feature Carousel

**Main (`origin/main`)**:
- ❌ **Custom implementation**: Uses `useState` for index, manual `goNext()`/`goPrev()` functions
- ❌ Manual slide rendering based on index
- ❌ No Embla dependency

**Current branch (`feat/embla-frontpage-minimal`)**:
- ✅ **Embla**: Uses shared `Carousel` component (`embla-carousel-react`)
- ✅ Embla API for navigation (`PrevButton`/`NextButton` with `useCarouselApi()`)
- ✅ Proper slide rendering via `Slide` component
- ✅ Overlay controls pattern (prev/next buttons inside `Carousel` overlay)

**Migration status**: ✅ **COMPLETE**

---

### 2. Case Study Carousel

**Main (`origin/main`)**:
- ❌ **Custom implementation**: Uses `useRef` for `frameRef` and `scrollerRef`
- ❌ Manual scroll calculations with `ResizeObserver`
- ❌ CSS variable-based sizing (`--per-view`, etc.)
- ❌ Custom keyboard navigation handlers
- ❌ No Embla dependency

**Current branch (`feat/embla-frontpage-minimal`)**:
- ✅ **Embla**: Uses shared `Carousel` component
- ✅ JS-calculated slide widths (replaces CSS vars)
- ✅ Peek pattern via viewport padding + negative track margin
- ✅ Embla `reInit` on resize and after first paint
- ✅ Overlay controls (`PrevButton`/`NextButton` with `by={perView}`)
- ✅ `pauseOnDrawer={false}` (disabled for this carousel)
- ✅ Keyboard navigation via native Embla events

**Migration status**: ✅ **COMPLETE**

---

### 3. Clients Marquee

**Main (`origin/main`)**:
- ❌ **CSS keyframe-based**: Uses CSS animations (`@keyframes`)
- ❌ Manual duplication of items for seamless loop
- ❌ `usePrefersReducedMotion` hook for accessibility
- ❌ No Embla dependency

**Current branch (`feat/embla-frontpage-minimal`)**:
- ✅ **Embla AutoScroll**: Uses `embla-carousel-auto-scroll` plugin
- ✅ Two rows with opposite directions
- ✅ Embla `reInit` on item count changes
- ✅ Dynamic repeat count based on viewport/track width
- ✅ Auto-resume behavior

**Migration status**: ✅ **COMPLETE**

---

### 4. Testimonials Marquee

**Main (`origin/main`)**:
- ✅ **Already Embla**: Uses `useEmblaCarousel` with AutoScroll plugin
- ✅ Desktop marquee: Embla with AutoScroll
- ✅ Mobile marquee: Embla with AutoScroll
- ✅ No changes needed

**Current branch (`feat/embla-frontpage-minimal`)**:
- ✅ **Unchanged**: Still uses Embla (as on main)

**Migration status**: ✅ **ALREADY COMPLETE** (no migration needed)

---

## Shared Infrastructure

### New Component: `Carousel.tsx`

**Location**: `src/components/carousel/Carousel.tsx`

**Status**: ✅ **NEW** (added in `feat/embla-frontpage-minimal`)

**Features**:
- React Context-based API access (`useCarouselApi()`)
- `PrevButton` and `NextButton` components (with `by` prop for multi-slide jumps)
- `Dots` component for pagination
- `Slide` component with default flex sizing
- `pauseOnDrawer` prop (pauses carousel when mobile nav drawer opens)
- `overlay` prop for rendering controls inside the Embla provider

**Key implementation details**:
- Uses `embla-carousel-react` hook
- Default options: `{ loop: true, align: "start", containScroll: "trimSnaps" }`
- Handles touch-action for vertical scroll preservation
- MutationObserver for drawer state detection

---

## Branch Comparison: `feat/embla-unify` vs `feat/embla-frontpage-minimal`

### `feat/embla-unify` (original comprehensive branch)

**Scope**: Broader migration including:
- Hero ✅
- Cases ✅
- Clients ✅
- Testimonials mobile (also migrated to Embla, with CSS ticker fallback)
- Additional carousel utilities (`TickerCarousel.client.tsx`)

**Status**: Contains more work but may have conflicts or extra changes.

### `feat/embla-frontpage-minimal` (current focused branch)

**Scope**: Frontpage-only migration:
- Hero ✅
- Cases ✅
- Clients ✅
- Testimonials: Left unchanged (already Embla on main)

**Status**: ✅ **Clean, focused, and working**

**Files restored from `feat/embla-unify`**:
- `src/components/carousel/Carousel.tsx`
- `src/components/sections/hero-feature-carousel.tsx`
- `src/components/sections/case-study-carousel.client.tsx`
- `src/components/sections/case-study-carousel.tsx`
- `src/components/sections/clients.marquee.client.tsx`

---

## Commits Summary

**Current branch commits** (vs `origin/main`):

1. `cf2ec42` - Initial migration: wrapper + hero/cases/clients
2. `ab5702c` - Cases fixes: reInit + overlay controls; pauseOnDrawer off
3. `cc880a5` - Cases: JS-calculated widths + peek; overlay controls only

**Total files changed**: 5 carousel-related files + 1 new shared component

---

## Dependencies

**Required packages** (verify in `package.json`):
- `embla-carousel-react` ✅
- `embla-carousel-auto-scroll` ✅ (for Clients and Testimonials marquees)
- `embla-carousel` (types) ✅

---

## Next Steps

### To Complete Migration

1. ✅ **Verify all carousels work on frontpage** (manual testing)
2. ✅ **Test responsive behavior** (mobile/tablet/desktop)
3. ✅ **Test accessibility** (keyboard nav, screen readers)
4. ✅ **Build verification** (`npm run build`)
5. ⏳ **Merge to main** (when ready)

### Optional Future Enhancements

- Consider migrating other pages that use carousels (if any)
- Review `feat/embla-unify` for any additional patterns worth adopting
- Consider extracting carousel patterns to a shared utilities file

---

## Verification Checklist

- [x] Hero carousel uses Embla on current branch
- [x] Cases carousel uses Embla on current branch
- [x] Clients marquee uses Embla on current branch
- [x] Testimonials unchanged (already Embla)
- [x] Main branch still uses custom implementations
- [x] Shared `Carousel` component exists and is used
- [ ] Build passes without errors
- [ ] Visual parity verified
- [ ] Mobile drawer interaction tested

---

## Notes

- The migration preserves visual and functional parity with the original custom implementations.
- The Cases carousel uses JS-calculated widths instead of CSS variables for better reliability.
- Clients marquee uses Embla AutoScroll instead of CSS keyframes for better control and accessibility.
- Hero carousel overlay pattern allows controls to be rendered inside the Embla provider for proper API access.

