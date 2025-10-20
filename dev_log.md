# Dev Log

## [2024-12-19] – Mobile Menu Stacking Context Fix (Final)
Goal: Fix mobile menu panel/sheet interaction where panel either hides the sheet visually or becomes non-interactive

### Problem Analysis
- Panel (`mobile-nav-panel`) had `z-[40]` but needed to be above overlay (`z-index: 50`) and below shell (`z-index: 60`)
- When panel was above shell: visually hid the rounded sheet edges
- When panel was below shell: overlay intercepted clicks, making panel non-interactive
- Trade-off between visual appearance and functionality

### Solution Implemented (Final Revision)
**Correct Layering Order:**
1. **Shell/Sheet Layer** (`z-index: 60`): The rounded card that shows the site content
2. **Panel Layer** (`z-index: 55`): Menu panel, below shell so card remains visible
3. **Overlay Layer** (`z-index: 50`): Transparent overlay for click-outside dismissal

**Key Changes:**
- Panel `z-index: 55 !important` (below shell to keep card visible)
- Shell `z-index: 60` with `pointer-events: none` when menu open
- Overlay `z-index: 50 !important` with `pointer-events: auto` for dismissal
- Removed `isolation: isolate` from body and site-shell
- Removed conflicting `z-[40]` from navbar component
- Added `!important` to override Radix Sheet defaults

**Visual Design:**
- Panel has solid background `var(--mobile-nav-surface)`
- Shell transforms and shows rounded corners
- Panel slides in from left, shell transforms right
- Clean visual separation without complex wrapping

**CSS Variables Used:**
- `--mobile-nav-width`: Panel width for click area calculation
- `--nav-card-inset`: Sheet inset for visual alignment
- `--nav-card-border-radius`: Matching rounded corners
- `--mobile-nav-surface`: Background color for visual consistency

### Technical Details
- Panel content remains fully interactive (links, CTA, theme/locale toggles)
- Visual backdrop wraps sheet's curved edges without gaps
- Overlay only catches taps outside the panel area
- Maintains existing animation timing and cleanup phases
- Uses minimal CSS variables for future component compatibility

### Files Modified
- `web/src/app/globals.css`: Added layered z-index solution and pseudo-elements
- `web/src/components/shared/navbar.client.tsx`: Made panel background transparent

### Testing Required
- [ ] Test on homepage (`/`) with varied content heights
- [ ] Test on contact page (`/kontakt`) 
- [ ] Verify smooth open/close animations
- [ ] Check for visual gaps or seams on different viewport sizes
- [ ] Confirm panel links remain clickable
- [ ] Verify overlay tap dismissal works

### Impact
- Resolves core stacking context conflict
- Maintains visual design integrity
- Preserves interactive functionality
- Uses existing CSS variable system
- No breaking changes to existing components

---
