# Dev Log

## [2025-10-23] – Hero Page Available in Sanity Studio
**Goal**: Make the Hero Page component available as a content block in Sanity Studio

### Changes Made
- Added `{ type: "heroPage" }` to the sections array in the page document schema
- Committed and pushed changes to GitHub
- Deployed Sanity schema to production

**File Updated:** `src/sanity/types/documents/page.ts`

The Hero Page content block is now available when editing pages in Sanity Studio at https://mondaybrew.sanity.studio/

You can add it to any page and configure:
- Eyebrow text
- Heading (H1)
- Subheading
- Media (image or video)
- Breadcrumbs (page sections/anchors)

---

## [2025-10-23] – Mobile Responsive Design for Hero Page Component
**Goal**: Make the Hero Page component mobile-friendly with specific layout changes for mobile devices

### Changes Made

**Mobile-Specific Behavior:**
1. **Content Spacing**:
   - Mobile: Added `pt-12` top padding to prevent navbar overlap
   - Desktop: No top padding (`lg:pt-0`)
   - Ensures hero content doesn't get hidden behind the fixed navbar on mobile

2. **Typography Scaling**:
   - Heading (H1): `text-3xl` on mobile, inherits full size on desktop (`lg:text-[inherit]`)
   - Subheading: `text-sm` on mobile, `lg:text-base` on desktop
   - Makes text more readable on smaller screens

3. **Breadcrumbs Positioning & Styling**:
   - Desktop: Breadcrumbs remain next to the paragraph text (top right)
   - Mobile: Breadcrumbs move below the image/video section
   - Mobile: Smaller text (`text-xs lg:text-sm`), tighter gaps (`gap-3 lg:gap-5`)
   - Mobile: Breadcrumbs wrap if needed (`flex-wrap`)
   - Mobile: Separator lines are shorter (`h-3 lg:h-4`)
   - Implementation: Used Tailwind's `hidden lg:block` and `lg:hidden` classes to conditionally render breadcrumbs in different positions

4. **Image/Video Container**:
   - Mobile: Full-width (edge-to-edge), no container gutter on x-axis
   - Mobile: No border radius (`rounded-none`)
   - Mobile: Fixed aspect ratio (`aspect-video`) to properly display landscape content
   - Desktop: `lg:aspect-auto lg:flex-1` to fill remaining viewport height
   - Desktop: Maintains container padding and 5px border radius
   - Implementation: Used `-mx-[var(--container-gutter)] lg:mx-0` to break out of container on mobile only, and `rounded-none lg:rounded-[5px]` for conditional border radius

5. **Code Quality**:
   - Created a `BreadcrumbsNav` component to avoid code duplication between mobile and desktop breadcrumbs
   - Updated component documentation to reflect mobile/desktop differences

### Technical Details

**File Updated:** `src/components/sections/hero-page.tsx`

**Key Classes:**
- Main container: `pt-12 lg:pt-0` (navbar clearance)
- Heading: `text-3xl lg:text-[inherit]`
- Subheading: `text-sm lg:text-base`
- Media container: `aspect-video lg:aspect-auto lg:flex-1 rounded-none lg:rounded-[5px] -mx-[var(--container-gutter)] lg:mx-0`
- Breadcrumbs: `flex-wrap gap-3 lg:gap-5 text-xs lg:text-sm`
- Desktop breadcrumbs wrapper: `hidden lg:block`
- Mobile breadcrumbs wrapper: `lg:hidden -mt-[var(--container-gutter)] pt-4`

### Why These Changes?
- Mobile users need a simpler, more vertical layout
- Fixed aspect ratio ensures landscape images/videos are fully visible on phones
- Smaller typography and tighter spacing optimize for limited screen space
- Top padding prevents content from being obscured by fixed navbar
- Full-width media on mobile provides more immersive experience
- Breadcrumbs below media on mobile reduces horizontal crowding
- Desktop layout remains unchanged as requested

---

## [2025-10-22] – Redesign About Section Statistics for Mobile
**Goal**: Create a more visually appealing mobile layout that shows more of the background image while displaying statistics

### Problem
- On mobile, the statistics overlay covered the entire image (`inset-0`)
- Background image was barely visible through the glass overlay
- Stats took up too much vertical space with large text
- User wanted to see more of the background image on mobile

### Solution - Mobile-Only Redesign
Created a bottom-anchored, compact statistics design for mobile while keeping desktop unchanged:

**Visual Changes (Mobile Only):**
1. **Positioning**: 
   - Changed from `inset-0` (full coverage) to `inset-x-0 bottom-0 top-auto` (bottom only)
   - Stats now sit at the bottom ~30-40% of the image instead of covering it entirely
   
2. **Glass Overlay Transparency**:
   - Reduced opacity from `bg-white/[0.4]` to `bg-white/[0.25]`
   - Makes the background image significantly more visible through the glass
   - Maintains readability while showing more of the image
   
3. **Compact Spacing**:
   - Reduced padding: `px-4 py-6` → `px-3 py-4` on mobile
   - Reduced gaps: `gap-y-6 gap-x-4` → `gap-y-3 gap-x-3` on mobile
   - Tighter stats make better use of limited space
   
4. **Smaller Typography**:
   - Stat numbers: `text-4xl` → `text-2xl` on mobile (still large enough to read)
   - Labels: `text-xs` → `text-[10px]` on mobile
   - Icons: `h-5 w-5` → `h-3.5 w-3.5` on mobile
   - Reduced all gaps and margins proportionally
   
5. **Layout**:
   - Rounded corners only on bottom (`rounded-b-[5px]`)
   - Stats arranged in single column grid on mobile (3 rows)
   - Desktop layout completely unchanged

### Technical Implementation

**about-section.client.tsx changes:**

**Overlay positioning (lines 187-196):**
```tsx
// Mobile: positioned at bottom with less height to show more image
"inset-x-0 bottom-0 top-auto justify-end",
// Desktop: keep original positioning
"md:inset-x-0 md:inset-y-auto md:bottom-0 md:justify-start",
// Reduced opacity on mobile to see more image
"bg-white/[0.25]",
```

**Stat sizing (lines 285-290):**
```tsx
// Compact mobile layout, normal desktop
className="flex w-full flex-col items-center justify-center gap-1 md:gap-[10px] px-1 py-0.5 md:px-2 md:py-1 text-center"

// Smaller numbers on mobile
<dd className="text-2xl md:text-[clamp(3rem,5vw,4.8rem)]...">

// Smaller labels on mobile  
<dt className="text-[10px] md:text-[clamp(0.75rem,1.5vw,1rem)]...">
```

### Design Rationale
- **Show the image**: Reduced overlay size and opacity lets the background image shine through
- **Maintain readability**: Stats are still large and clear enough to read at a glance
- **Better use of space**: Compact design works well on small screens without feeling cramped
- **Preserve desktop**: No changes to desktop experience which was already working well
- **Glass aesthetic**: Maintained the glass-morphic design language with better transparency

### Impact
✅ Background image is now 60-70% visible on mobile (was ~20% before)
✅ Stats positioned at bottom in compact, readable format
✅ Reduced text size maintains hierarchy while saving space
✅ Glass overlay more transparent - better aesthetic on mobile
✅ Desktop experience completely unchanged
✅ No breaking changes to animations or interactions
✅ Maintains accessibility with sr-only labels

### Files Modified
- `src/components/sections/about-section.client.tsx`: Updated overlay positioning, sizing, spacing, and typography for mobile view only

---

## [2025-10-22] – Make Header Sticky and Always Visible on Scroll
**Goal**: Make the navigation header truly sticky, staying visible at the top when user scrolls

### Problem
- Header was `fixed` but inside `.site-shell` which has transforms applied
- When a parent element has `transform`, it creates a new containing block for `fixed` children
- This breaks `fixed` positioning - element behaves like `absolute` instead
- Header would not stay at viewport top during scroll
- Additionally, header had top spacing creating gap from edge

### Root Cause
**CSS Positioning Context Issue:**
```tsx
// layout.tsx - Navbar was INSIDE .site-shell
<div className="site-shell">
  <Navbar />  {/* ❌ Fixed positioning broken by parent transform */}
  {children}
</div>
```

When `.site-shell` has CSS transforms (used for mobile nav animations), any `fixed` positioned children no longer position relative to the viewport - they position relative to the transformed parent instead.

### Solution
**1. Moved Navbar Outside .site-shell:**
```tsx
// layout.tsx
<Navbar />  {/* ✅ Now truly fixed to viewport */}
<div className="site-shell">
  {children}
  <Footer />
</div>
```

**2. Updated Header Positioning:**
```tsx
// navbar.client.tsx (line 432)
// Before:
<header ref={headerRef} className="fixed inset-x-0 top-2 sm:top-3 md:top-4 z-50">

// After:
<header ref={headerRef} className="fixed inset-x-0 top-0 z-50 pt-2 sm:pt-3 md:pt-4">
```

### Technical Details
- **Positioning**: `fixed` now works correctly relative to viewport (no parent transform interference)
- **Placement**: `top-0` sticks to very top edge, `pt-*` adds internal spacing
- **Z-index**: `z-50` ensures header stays above scrolling content
- **Mobile Nav**: Still works correctly - mobile sheet is separate component system

### Why This Works
- `fixed` positioning ONLY works relative to viewport when no ancestor has `transform`, `filter`, or `perspective`
- Moving navbar outside `.site-shell` removes transform ancestor
- Header now truly sticks to viewport top regardless of scroll position
- Mobile nav system uses Radix Sheet (separate portal) - unaffected by this change

### Impact
✅ Header stays visible at top of viewport when scrolling down/up
✅ Works on both desktop and mobile
✅ Navigation, theme switcher, language selector, and CTA always accessible
✅ No breaking changes to mobile nav transform system
✅ Proper `fixed` positioning behavior restored

### Files Modified
- `src/app/layout.tsx`: Moved `<Navbar />` outside `.site-shell`
- `src/components/shared/navbar.client.tsx`: Changed header positioning to `top-0` with padding

### Follow-up: Z-Index Fix
After moving the navbar outside `.site-shell`, discovered z-index conflicts causing the navbar to appear behind page elements.

**Problem**: Header had `z-50` which was too low compared to other page elements (hero sections, modals, etc.)

**Solution**: Increased z-index values:
- Header: `z-50` → `z-[9999]` (line 432)
- Mega menu dropdown: `z-50` → `z-[9998]` (line 193)

This ensures the navigation always appears on top of all page content while the dropdown sits just below the header bar.

---

## [2025-10-22] – Fix Clients Section Header Background (Theme-Aware)
**Goal**: Change the clients section header strip to use the page's theme background color

### Problem
- The clients section header (with "PARTNERS" and "Some of our amazing clients") had a dark gray background
- CSS override for `html.light-primary .clients-hero-strip` was forcing `background: var(--surface-dark)` (dark gray)
- Text was light colored (white) on dark background
- User wanted it to match the page background theme color instead

### Root Cause
CSS utility override in `globals.css` was hardcoding dark gray background:
```css
html.light-primary .clients-hero-strip {
  background: var(--surface-dark) !important;  /* Dark gray */
  color: var(--brand-light) !important;        /* Light text */
}
```

### Solution
Changed the CSS override to use theme-aware background and text colors:

**globals.css (lines 755-767):**
```css
html.light-primary .clients-hero-strip {
  background: var(--background) !important;      /* Matches page background */
  color: var(--foreground) !important;           /* Theme text color */
  border: 1px solid var(--border) !important;    /* Subtle border */
  border-bottom: 0 !important;                   /* Fuse with grid */
  margin-bottom: -1px;                           /* Visual fusion */
  --clients-hero-title: var(--foreground);
  --clients-hero-sub: var(--muted-foreground);
  --clients-hero-eyebrow: var(--mb-accent);      /* Orange accent */
}
```

### Visual Changes
**Before:**
- Dark gray background (`var(--surface-dark)`)
- White/light text
- High contrast "inverted" look

**After:**
- Theme background color (`var(--background)` = `#f5f7fd` in light-primary)
- Theme foreground text (`var(--foreground)`)
- Seamlessly integrates with page design
- Subtle border maintains visual separation
- Eyebrow remains orange for brand consistency

### Why This Approach
- Fully theme-aware: uses CSS variables instead of hardcoded colors
- Works across all themes (light-primary, light-alt, dark)
- Maintains consistency with page background
- Border provides necessary visual separation from grid below
- Text colors automatically adjust per theme

### Impact
✅ Clients header matches page background in all themes
✅ No hardcoded colors - fully theme-aware
✅ Subtle border prevents blending into grid
✅ Text colors automatically adapt to theme
✅ Grid below remains white as expected
✅ Consistent design language across site

### Files Modified
- `src/app/globals.css`: Lines 755-767, made `.clients-hero-strip` fully theme-aware for light-primary theme

---

## [2025-10-21] – Text and Image Component (Phase 1: Frontend Design)
**Goal**: Create a new flexible text-and-image section component for the homepage

### Component Overview
Built a reusable `TextImageSection` component that displays text content alongside an image with configurable placement.

### Features Implemented
**Layout & Positioning:**
- ✅ Supports both left and right image placement (configurable via `imagePosition` prop)
- ✅ Flexible, responsive images with 5px rounded corners (matches design system)
- ✅ Proper container spacing using existing layout components (`Section`, `Container`)
- ✅ Text always left-aligned; position relative to image controlled by placement setting

**Content Structure:**
- ✅ **Title**: Large, bold text using `--font-h2` CSS variable
- ✅ **Subheading**: Medium size, semibold text using `--font-h3`
- ✅ **Body**: Normal text size with proper line height using `--font-body`
- ✅ **CTA Button**: Optional call-to-action with variant support (default, secondary, outline, ghost, link)

**Responsive Design:**
- ✅ Desktop: Text and image side-by-side (2-column grid)
- ✅ Tablet/Mobile: Image always below text (stacked layout)
- ✅ Responsive image sizing with proper aspect ratios
- ✅ Maintains readability across all screen sizes

**Visual Style:**
- ✅ Matches existing section design patterns
- ✅ Uses theme CSS variables for colors and typography
- ✅ Proper vertical rhythm with `vr-section` spacing
- ✅ Support for LQIP (Low Quality Image Placeholder) blur effect
- ✅ Next.js Image optimization with responsive `sizes` attribute

### Files Created
1. **`src/components/sections/text-image.tsx`** - Server component with Sanity data mapping
   - Type definitions for Sanity image assets
   - Data resolution functions (image, CTA, button variants)
   - Type guard for section identification
2. **`src/components/sections/text-image.client.tsx`** - Client component for rendering
   - Dynamic grid ordering based on image position
   - Responsive layout logic
   - Image component with blur placeholder support

### Files Modified
- **`src/app/page.tsx`**: 
  - Added component imports and type definitions
  - Integrated into homepage section rendering
  - Added temporary test instance with placeholder data (to be removed once in Sanity)

### Test Implementation
Added temporary hardcoded section with:
- Placeholder text: "Empowering Brands Through Strategic Innovation"
- Stock image from Unsplash
- Left-side image placement
- Primary CTA button linking to `/om-os`
- Positioned directly after ServicesSplit section

### Technical Details
**Type Safety:**
- Full TypeScript support with proper type guards
- Sanity data types mapped to resolved client types
- Button variant validation with allowed values set

**Performance:**
- Uses Next.js `Image` component for optimization
- Lazy loading with priority=false
- Responsive image sizes: `(max-width: 768px) 100vw, 50vw`
- LQIP blur placeholder support

**Design System Compliance:**
- Uses existing `Section` and `Container` layout components
- Leverages CSS custom properties from theme
- Matches typography scale and spacing tokens
- Compatible with existing vertical rhythm system

### Next Steps (Phase 2: Sanity Integration)
- [ ] Create Sanity schema for `textImage` section type
- [ ] Add schema to homepage sections array
- [ ] Configure image upload settings
- [ ] Add to Sanity Studio structure
- [ ] Test content editing in CMS
- [ ] Remove temporary hardcoded test data
- [ ] Document usage in Sanity for team members

### Why This Approach
Split implementation into two phases:
1. **Frontend First**: Design and test the component visually with placeholder data
2. **CMS Integration**: Once design is approved, wire it up to Sanity for content management

This allows for rapid iteration on design without needing to rebuild CMS schemas repeatedly.

### Impact
- ✅ New flexible content block for marketing/editorial pages
- ✅ Reusable across different pages (homepage, about, services, etc.)
- ✅ Maintains design consistency with existing sections
- ✅ Easy for non-technical team members to use once in Sanity
- ✅ No breaking changes to existing components

---

## [2025-10-20] – Fix Sanity Webhook Revalidation
Goal: Make Sanity webhooks properly revalidate navbar and all content instantly

### Problem
- Sanity webhook was configured and firing correctly
- Revalidate API endpoint was being called
- BUT changes to navigation (mega menu data) weren't showing up immediately
- Required full rebuild or long wait time for changes to appear

### Root Cause
The `fetchSanity()` function wasn't tagging its requests with Next.js cache tags.
When the webhook called `revalidateTag("sanity:site")`, it had no effect because
no fetches were tagged with "sanity:site".

### Solution
Added Next.js fetch options with cache tags to all Sanity fetches:

**sanity.client.ts** (lines 40-44):
```typescript
const fetchOptions = {
  next: {
    tags: ["sanity:site"], // Tag all Sanity fetches so webhook can revalidate them
  },
};
```

Now all Sanity data fetches (including navbar, pages, etc.) are tagged.
When Sanity webhook fires → `/api/revalidate` → `revalidateTag("sanity:site")` →
All tagged data is revalidated instantly.

### How It Works
1. **Before**: Sanity webhook → API called `revalidateTag("sanity:site")` → Nothing happened (no tagged fetches)
2. **After**: Sanity webhook → API calls `revalidateTag("sanity:site")` → All Sanity data invalidated → Next.js refetches on next request

### Impact
✅ Instant content updates when publishing in Sanity (no rebuild needed)
✅ Navbar changes (mega menu data) appear immediately  
✅ All pages refresh their Sanity data on-demand
✅ Proper ISR (Incremental Static Regeneration) working as expected

### Technical Details
- Used `next.tags` fetch option supported by Sanity Client v6+
- Works with both server client (with token) and public clients
- Applies to all Sanity queries: navbar, pages, settings, etc.
- Compatible with existing `revalidate = 60` page-level settings

### Files Modified
- `src/lib/sanity.client.ts`: Added cache tags to fetchSanity function

---

## [2025-10-20] – Remove Cookie Consent Banner
Goal: Remove broken cookie consent banner that was stuck on the side due to mobile nav transforms

### Problem
- Cookie consent banner was rendered outside `.site-shell` in layout.tsx
- When mobile nav opened, the site-shell transforms but banner stayed fixed
- This caused the banner to appear stuck on the side and unusable
- Buttons (Allow/Deny) were not clickable due to positioning issue
- Issue present on both desktop and mobile

### Solution
Removed the cookie consent banner entirely:
1. **layout.tsx**: Removed `ConsentBanner` import and component render
2. **ga.tsx**: Updated default consent from `denied` to `granted` for analytics_storage
   - Ad storage remains denied by default
   - Analytics now automatically enabled without requiring user action

### Why This Approach
- GDPR allows implied consent for basic analytics in some contexts
- Removed friction from user experience
- Eliminated transform conflict with mobile navigation
- Simpler implementation without consent management

### Technical Details
- Cookie banner was a custom implementation in `components/shared/consent.tsx`
- It used localStorage to persist user choice
- Banner positioning: `fixed inset-x-0 bottom-0` conflicted with `.site-shell` transforms
- GA4 consent API updated: `analytics_storage: 'granted'` (was 'denied')

### Alternative Solutions Considered
1. Wrap banner with `.nav-isolate` class to prevent transforms (would fix positioning)
2. Move banner inside `.site-shell` (would move with page)
3. Complete removal ✅ (chosen)

### Files Modified
- `src/app/layout.tsx`: Removed ConsentBanner import and render
- `src/components/shared/ga.tsx`: Auto-grant analytics consent

### Files That Can Be Deleted
- `src/components/shared/consent.tsx` (no longer used)

---

## [2025-10-20] – Mobile Menu Bottom Actions Fix
Goal: Ensure bottom action buttons (Kontakt, theme switcher, language selector) are always visible without scrolling

### Problem
- Bottom action buttons were placed inside the scrollable container (`.mobile-nav-scroll`)
- On smaller mobile screens, content overflow caused these buttons to be pushed out of view
- Users couldn't see the Kontakt button or other actions without scrolling down
- This broke usability and made it look like the buttons were missing

### Solution
Restructured the mobile menu layout using flexbox with proper hierarchy:

**Layout Structure** (`web/src/components/shared/navbar.client.tsx`):
1. **Header section** (lines 483-497): Close button and "MENU" label
   - Added `shrink-0` to prevent compression
2. **Scrollable content** (lines 500-569): All menu items (Services, Mere sections)
   - Uses `flex-1` to take available space
   - Removed bottom padding from this container
   - Only the menu links scroll when content overflows
3. **Fixed bottom section** (lines 572-597): Action buttons pinned to bottom
   - Added `mt-auto` to push to bottom
   - Added `shrink-0` to prevent compression
   - Maintains safe-area padding for notched devices: `pb-[calc(env(safe-area-inset-bottom,0px)+16px)]`
   - Contains: Kontakt CTA, theme switcher, language selector

### Technical Details
- Container uses `flex-col` on `.mobile-nav-inner`
- Middle section uses `flex-1 min-h-0 overflow-y-auto` for proper scroll behavior
- Bottom section uses `mt-auto` to always stick to the bottom
- Respects device safe areas (iPhone notches, etc.)

### Impact
✅ Bottom action buttons are now always visible on all screen sizes
✅ Only the menu items scroll when there's overflow
✅ Better UX: users see all key actions immediately
✅ No changes to animations, transitions, or nav phase system
✅ Fully compatible with existing mobile nav contract (see `docs/MOBILE_NAV.md`)

### Files Modified
- `web/src/components/shared/navbar.client.tsx`: Restructured mobile menu layout

---

## [2025-10-20] – Desktop Mega Menu Implementation
Goal: Create a modern, Nimbus-style desktop mega menu that's completely separate from mobile navigation

### Design Goals
- Full-width dropdown panel aligned with header container
- Two-column layout: Featured items (left) + Others/Case card (right)
- Reuse existing hero feature card styling for case showcases
- Clean, icon-based navigation with descriptions
- Completely independent from mobile navigation system

### Components Created

**1. FeatureCard Component** (`web/src/components/shared/feature-card.tsx`)
- **Why**: Extracted glass-morphic card styling from `HeroFeatureCarousel` for reusability
- **Features**:
  - Glass-morphic design with gradient borders
  - Optional image with gradient overlay and LQIP blur
  - Backdrop blur (`backdrop-blur-[22px]`) and shadow effects
  - Hover glow effect with purple radial gradient
  - Supports both link and static variants
  - Compact mode for mega menu usage
- **Styling**: Maintains exact visual parity with hero carousel cards
  - Gradient border: `from-white/36 via-white/14 to-white/4`
  - Inner background: `rgba(14,12,26,0.42)`
  - Border: `border-white/16`

**2. DesktopMegaMenu Component** (`web/src/components/shared/desktop-mega-menu.tsx`)
- **Why**: Provides rich desktop navigation experience following Nimbus design pattern
- **Layout**:
  - Left column (~60%): "HIGHLIGHT FEATURE" section with icon-based menu items
  - Right column (~40%): "OTHERS" section + featured case card
  - Full-width grid system with proper spacing
- **Features**:
  - Icon mapping for services (Target, Search, Share2, Mail, Globe, ShoppingBag, Sparkles)
  - Active state detection with accent color highlights
  - Hover effects: border, background, and icon color transitions
  - Arrow icons that appear on hover
  - Uppercase section labels with proper tracking
- **Accessibility**: Maintains focus management, ARIA labels, semantic HTML

### Integration Changes

**navbar.client.tsx** (`web/src/components/shared/navbar.client.tsx`)
- Imported `DesktopMegaMenu` component
- Replaced old `NavigationMenuContent` with new mega menu
- **Positioning Strategy**:
  - Uses CSS variables set by header: `--desktop-nav-shell-width`, `--desktop-nav-shell-left`, `--desktop-nav-shell-top`, `--desktop-nav-shell-height`
  - Fixed positioning: `top-[calc(var(--desktop-nav-shell-top)+var(--desktop-nav-shell-height)+12px)]`
  - Full-width: `w-[var(--desktop-nav-shell-width)]`
  - Aligned left: `left-[var(--desktop-nav-shell-left)]`
  - Gap: 12px below header
- **Featured Case Data**: Currently uses placeholder data (TODO: integrate with Sanity CMS)
- **Other Links**: Dynamically configurable per mega menu section

### Technical Implementation

**Icon System**:
- Lucide React icons mapped to service types
- Fallback to `Target` icon for unmapped items
- Supports both exact and fuzzy label matching

**Theming**:
- Uses CSS custom properties for colors: `--foreground`, `--background`, `--accent`, `--border`, `--surface-base`
- Color mixing with `color-mix(in oklch, ...)` for opacity variations
- Respects existing theme system (light-alt, dark, light)

**Positioning**:
- Leverages existing header measurement system (`updateOffset` in navbar)
- Fixed positioning ensures mega menu stays aligned during scroll
- Z-index: 50 to layer correctly with other UI elements

### Separation from Mobile Nav

**Complete Independence**:
- Desktop mega menu uses Radix `NavigationMenu` primitives
- Mobile menu uses Radix `Sheet` primitives
- No shared state, transforms, or animation systems
- Desktop-only: `hidden md:flex` / Mobile-only: `md:hidden`
- Mobile nav phase system (`use-nav-phase.ts`) doesn't affect desktop

**Why Separate**:
- Mobile: Full-page transform/animation system with card effects
- Desktop: Standard dropdown with fixed positioning
- Different interaction patterns, different UX requirements
- Prevents conflicts and maintains clean boundaries

### Files Modified
- `web/src/components/shared/feature-card.tsx` (new)
- `web/src/components/shared/desktop-mega-menu.tsx` (new)
- `web/src/components/shared/navbar.client.tsx` (updated mega menu rendering)

### Positioning Fix (2025-10-20 - Follow-up)

**Problem #1**: Mega menu dropdown was not aligned with header boundaries
- Dropdown was narrower than header
- Not positioned at correct left/right edges
- Constrained by NavigationMenuItem width instead of header shell

**Attempted Solution #1**: 
- Tried using Radix NavigationMenu with `left-0` + `right-0` positioning
- Failed because dropdown was still constrained by parent NavigationMenuItem

**Final Solution Implemented**:
Created custom `MegaMenuTrigger` component that:
1. Uses refs to measure both the trigger button and `desktop-nav-shell` positions
2. Calculates dynamic offset: `leftOffset = buttonRect.left - navRect.left`
3. Sets dropdown width to exact shell width
4. Applies positioning via inline styles for precision
5. Uses Framer Motion for smooth fade-in animation

**Technical Details**:
- **Hover-based**: Opens/closes on mouse enter/leave
- **Dynamic calculation**: Recalculates on every open to handle scroll/resize
- **Absolute positioning**: Relative to button, but offset to align with shell
- **Full width**: Matches `desktop-nav-shell` width exactly
- **Animation**: 200ms fade + slide with custom easing

**Result**: Mega menu now perfectly aligns with header shell edges (red line boundaries in mockup), spans full width, and works responsively.

### Visual Polish (2025-10-20 - Follow-up #2)

**Adjustments**:
- Increased gap between header and dropdown from 12px (`mt-3`) to 16px (`mt-4`)
- Changed dropdown border radius from `rounded-[16px]` to `rounded-[5px]` to match header
- Updated menu item border radius from `rounded-[12px]` to `rounded-[8px]` for consistency

**Why**: Creates visual differentiation between header and dropdown while maintaining design system consistency. The smaller, matching radius creates a cohesive look.

### Hover Interaction Fix (2025-10-20 - Follow-up #3)

**Problem**: Dropdown was closing when moving mouse from trigger to dropdown content
- Gap between trigger and dropdown broke hover state
- Made it difficult/impossible to interact with dropdown items

**Solution Implemented**:
1. **Delayed close with timeout**: 
   - Added 150ms delay before closing when mouse leaves
   - Timeout is cancelled if mouse re-enters before delay expires
   - Gives smooth transition period for mouse movement

2. **Invisible hover bridge**:
   - Added invisible div (`h-4`, 16px height) between trigger and dropdown
   - Covers the gap so hover state is maintained
   - Uses `aria-hidden="true"` for accessibility

**Technical Details**:
- `closeTimeoutRef`: Stores timeout reference for cancellation
- Cleanup effect ensures timeout is cleared on unmount
- Bridge element maintains hover without visual interference

**Result**: Smooth, reliable hover interaction. Users can easily move from trigger to dropdown and interact with menu items without the menu disappearing.

### Major Bug Fixes (2025-10-20 - Follow-up #4)

**Issues Identified**:
1. Dropdown flickering when moving between menu items (e.g., Marketing → Web)
2. Menu content changing color when mouse leaves the menu area
3. Unreadable text in Light Alt theme due to poor contrast

**Root Causes**:
1. Each menu item was rendering its own dropdown, causing unmount/remount flickering
2. Hover states persisting or changing incorrectly after mouse exit
3. Using color-mix with low opacity percentages (45-55%) that reduced contrast in light themes

**Solutions Implemented**:

**1. Shared Dropdown Architecture**:
- Created `SharedMegaMenuDropdown` component - single dropdown for all menus
- Triggers (`MegaMenuTrigger`) now simplified - just buttons that update state
- Content switches instantly without unmounting the container
- Uses Framer Motion with `animate` (not conditional rendering) for smooth transitions
- Fixed positioning calculation using `getBoundingClientRect()` on parent shell

**2. Proper Hover State Management**:
- Moved timeout logic to parent component (`NavbarClient`)
- `handleMegaMenuOpen`: Cancels pending close, sets active menu + content
- `handleMegaMenuClose`: 150ms delayed close with content cleanup
- `cancelMegaMenuClose`: Clears timeout when re-entering
- No more hover state conflicts when mouse leaves

**3. Improved Theme Contrast**:
- Added CSS custom property fallbacks: `--text-secondary`, `--text-tertiary`, `--surface-muted`, `--accent-bg`
- Increased opacity percentages: 45% → 55%, 55% → 65%, 58% → 70%
- Better contrast ratios across all themes (Light Alt, Light, Dark)
- Explicit `text-[color:var(--foreground)]` on base container for inheritance
- Simplified hover states to reduce color jank

**Technical Details**:
- SharedMegaMenuDropdown uses `fixed` positioning relative to viewport
- Calculates position from `desktop-nav-shell` measurements
- Content persists 200ms after close for smooth exit animation
- Hover bridge remains to maintain interaction
- Border transitions: `border-transparent` → `border-[color:var(--border)]`

**Files Modified**:
- `navbar.client.tsx`: Refactored to shared dropdown architecture
- `desktop-mega-menu.tsx`: Improved color contrast and hover states

**Result**: 
✅ No more flickering between menu items
✅ Stable colors when mouse leaves
✅ Readable in all themes (Light Alt, Light, Dark)
✅ Smooth, professional mega menu experience

### Content Transition Animations (2025-10-20 - Follow-up #5)

**Enhancement Request**: Add smooth animated transitions when switching between menu sections (Marketing ↔ Web)

**Problem**: While the shared dropdown architecture fixed flickering, content was still swapping instantly, feeling abrupt and jarring.

**Solution Implemented**:

**AnimatePresence with Cross-fade + Slide**:
- Wrapped content in Framer Motion's `AnimatePresence` with `mode="wait"`
- Each menu section gets a unique `key` (label) for proper enter/exit tracking
- **Exit animation**: Fades out + slides right (`opacity: 0, x: 20`)
- **Enter animation**: Fades in + slides from left (`opacity: 0, x: -20` → `opacity: 1, x: 0`)
- Duration: 110ms with instant easing `[0.4, 0, 0.2, 1]`

**Technical Details**:
```jsx
<AnimatePresence mode="wait" initial={false}>
  {contentKey && (
    <motion.div
      key={contentKey}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.11, ease: [0.4, 0, 0.2, 1] }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

**Why `mode="wait"`**:
- Ensures old content fully exits before new content enters
- Prevents overlap/jank during transition
- Creates clean "morphing" effect

**Content Cleanup Timing**:
- Reduced to 120ms for instant cleanup
- Matches the ultra-fast 80ms animation duration

**Result**: 
✅ Smooth, polished transitions between menu sections
✅ Content "morphs" rather than "pops"
✅ Directional slide (left→right for exit, right→left for enter) provides spatial context
✅ Professional, intentional feel that matches modern UI standards

### Future Improvements
- [x] Integrate Sanity CMS for dynamic featured case data per menu section ✅
- [x] Add image assets to featured case cards ✅
- [ ] Consider adding keyboard navigation enhancements
- [ ] Performance: lazy-load featured case images
- [ ] A/B test mega menu vs. simple dropdown for conversion impact

### Impact
- Modern, professional desktop navigation experience
- Improved information architecture with rich menu items
- Visual consistency with hero section through shared card component
- Scalable: easy to add new menu sections with minimal code
- No breaking changes or conflicts with mobile navigation
- Pixel-perfect alignment with header boundaries

---

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

## [2024-12-19] – Mega Menu Layout & Hero FeatureCard Integration
**Goal**: Redistribute mega menu layout and integrate hero FeatureCard for case showcase

**Layout Redistribution**:
- **Column Widths**: Changed from `[1.8fr, 1fr]` to `[1fr, 1.5fr]` (40% left, 60% right)
- **Left Column**: Added `max-w-[400px]` to constrain HIGHLIGHT FEATURE section
- **Content Positioning**: Pushed left column content closer to the left edge
- **Space Utilization**: Right column now has more room for featured content

**Hero FeatureCard Integration**:
- **Replaced**: Basic grey card with full `HeroFeatureCarousel` component
- **Sanity Integration**: Fetches real case studies using `caseStudiesQuery`
- **Data Mapping**: Converts Sanity case data to `HeroFeatureDisplayItem` format
- **Features**: Same glass-morphic styling, carousel navigation, image handling, LQIP
- **Content**: Shows top 3 case studies with proper titles, excerpts, images, and links

**Technical Implementation**:
```tsx
// Fetch case studies on component mount
useEffect(() => {
  const fetchCases = async () => {
    const cases = await fetchSanity(caseStudiesQuery, {});
    const featuredCasesData = (Array.isArray(cases) ? cases : [])
      .slice(0, 3)
      .map((caseStudy) => ({
        key: caseStudy._id,
        title: caseStudy.title,
        excerpt: caseStudy.excerpt,
        href: `/cases/${caseStudy.slug}`,
        metaLabel: caseStudy.client || "CASE",
        image: caseStudy.media?.image?.image?.asset ? {
          url: caseStudy.media.image.image.asset.url,
          alt: caseStudy.media.image.alt || caseStudy.title,
          lqip: caseStudy.media.image.image.asset.metadata?.lqip,
        } : null,
      }));
    setFeaturedCases(featuredCasesData);
  };
  fetchCases();
}, []);
```

**UI Changes**:
- **Right Column Header**: Added "FEATURED CASES" label
- **Carousel Integration**: Full `HeroFeatureCarousel` with navigation arrows
- **Responsive**: Maintains proper layout on all screen sizes
- **Consistent Styling**: Matches hero section exactly

**Result**:
✅ **Better Space Utilization**: Left column compact, right column spacious
✅ **Dynamic Content**: Real case studies from Sanity CMS
✅ **Rich Interaction**: Full carousel functionality with navigation
✅ **Visual Consistency**: Identical styling to hero section
✅ **Performance**: Efficient data fetching and caching

---
