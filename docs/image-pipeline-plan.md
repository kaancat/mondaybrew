# Image Pipeline Revamp — Project Plan

## Executive Summary
The current image delivery stack leans on raw Sanity assets piped straight into `next/image`, which results in oversized downloads, inconsistent placeholder behavior, and unreliable SVG rendering. This plan defines a two-week engineering effort to introduce a standardized helper layer, tune Next.js image configuration, and refactor high-traffic components so they request right-sized, cached assets. Success is measured by faster LCP/FCP in Lighthouse, leaner payloads on 3G, and a repeatable process for future sections.

## Context & Pain Points
- Sanity delivers original-resolution assets; our components request them with broad `sizes` declarations leading to megabyte-level downloads on mobile.
- `dangerouslyAllowSVG` is enabled globally, yet the optimizer still fails for some brand SVGs (e.g., footer logo) because of missing inline fallbacks.
- Videos in hero/carousel compete for bandwidth with above-the-fold imagery and lack optimized posters.
- No shared helper exists to normalize `src`, `srcSet`, `blurDataURL`, or content-aware cropping, so each component solves the problem differently.
- Some assets bypass `next/image` entirely (plain `<img>` tags), forfeiting built-in optimization, lazy loading, and format negotiation.

## Goals
1. Reduce perceived load time for hero, services split, and carousel sections across all themes.
2. Ensure every image loads at an appropriate resolution/format (AVIF/WebP preferred, JPEG fallback).
3. Standardize Sanity image usage through a single helper/loader interface.
4. Eliminate broken SVG rendering by defining a consistent inline or static import workflow.
5. Establish documentation and QA practices so future sections inherit the optimized pipeline.

## Optimization Workstreams

### 1. Data & Helper Layer
- Build `lib/sanity-image.ts` that wraps `@sanity/image-url` and exposes a strongly typed helper returning `{ src, srcSet, sizes, width, height, blurDataURL }`.
- Support aspect-ratio hints and focal point cropping using `asset.metadata`.
- Provide helper shims for legacy components so migration can happen incrementally.

### 2. Delivery Configuration
- Update `next.config.ts`:
  - Set `images.formats = ['image/avif', 'image/webp']` and ensure HTTPS Sanity domains are whitelisted.
  - Calibrate `images.minimumCacheTTL` based on Sanity CDN caching (default 60s → target 3600s) to reduce edge cache churn.
  - Document when to opt-in to `unoptimized` for purely decorative assets.

### 3. Component Refactors (High Priority)
- **Hero (home + services variants):** replace ad-hoc `fill` usage with helper output, refine `sizes` to match breakpoints (e.g., `(min-width: 1280px) 40vw, 92vw`).
- **Services Split:** ensure background illustrations use `priority` only when above-the-fold; add `placeholder="blur"` sourced from helper.
- **Case Study Carousel / Media Showcase:** sync slide dimensions with helper outputs; ensure `loading` is `lazy` for offscreen cards and avoid multiple simultaneous requests.

### 4. Component Refactors (Secondary)
- **Logo grids / client badges:** convert to inline SVG imports or static optimization pipeline to avoid runtime sizing costs.
- **Footer & Navbar SVGs:** import as React components (`next/dynamic` not required) so theme variants are handled in CSS rather than image pipeline.
- **Background textures (polka dots, gradients):** evaluate CSS vs. image usage; ensure patterns use lightweight SVGs or CSS gradients.

### 5. Motion & Media Enhancements
- Provide poster images and reduced-motion fallbacks for autoplay videos.
- Defer video loading until after primary imagery resolves, using `loading="lazy"` and `preload="none"`.
- Consider intersection observer hooks to pause downloads on inactive carousels.

### 6. Monitoring & Tooling
- Add a CI step (or manual checklist) to run Lighthouse/WebPageTest on primary templates.
- Track Core Web Vitals via Vercel Analytics once deployed; set alert thresholds for LCP/FID regressions.

## Milestones & Timeline (Target: 2 Sprint Weeks)
| Week | Milestone | Owners | Details |
| --- | --- | --- | --- |
| 1 — Midweek | Helper + Config Landed | Dev | Ship `lib/sanity-image.ts`, add typings/tests, update `next.config.ts`, document usage. |
| 1 — End | Hero & Services Refactor | Dev + Design QA | Validate layouts, run Lighthouse (desktop + mobile) to confirm ~20% LCP improvement. |
| 2 — Start | Carousel & Media Showcase Refactor | Dev | Align slide sizing, enable blur placeholders, confirm smooth scrolling on low bandwidth. |
| 2 — Mid | SVG + Asset Cleanup | Dev + Brand | Inline footer/nav logos, move shared assets into `public/brand/optimized/`. |
| 2 — End | QA & Documentation | Dev + QA | Execute regression checklist, update docs/README, handoff to content team. |

## Measurement & QA Strategy
- **Benchmarks:** Capture baseline Lighthouse (mobile + desktop) on `/` and `/services`. Re-run after each milestone.
- **Synthetic Tests:** Use WebPageTest (Fast 3G, 3 runs median) to confirm LCP < 2.5s and total transfer size reduction ≥ 25%.
- **Regression Checklist:**
  - Verify helper outputs widths/heights correctly in storybook or per-component tests.
  - Confirm SVG imports render in both light/dark themes and respect tint utilities.
  - Audit cumulative layout shift (CLS) to ensure placeholders prevent content jumps.
- **Analytics:** Enable Vercel Web Vitals logging, set alerts for LCP > 2.8s.

## Dependencies
- Sanity schemas must expose `asset`, `metadata.dimensions`, `metadata.lqip`, and optional `hotspot`/`crop` values.
- Repository should include `@sanity/image-url` (install if absent) and ensure TypeScript types for helper exports.
- Build environment running Node 18+ or 20+ so AVIF encoder is available.
- Coordination with design/content for any asset re-exports or cropping decisions.

## Risks & Mitigations
- **Loader Misconfiguration:** Broken domains or cache TTLs could 404. *Mitigation:* add integration test fetching a sample image via Next's optimizer before deploy.
- **Layout Drift:** Refactoring components may shift breakpoints. *Mitigation:* pair with design QA; use Percy/Chromatic for diffing.
- **CDN Cache Invalidation:** Larger TTLs might delay asset updates. *Mitigation:* document manual purge steps and leverage Sanity webhooks when assets change.
- **Video Competition:** If hero videos still load before images, LCP gains vanish. *Mitigation:* gate autoplay with `prefers-reduced-motion` and intersection observers.

## Deliverables & Ownership
- `lib/sanity-image.ts` helper module with unit coverage.
- Updated `next.config.ts` and `next-sanity.config.ts` (if applicable) documenting allowed domains and formats.
- Refactored hero, services split, carousel, media showcase, and logo grid components using the helper.
- Inline SVG components for footer/nav logos; remove broken `<img>` usage.
- QA checklist (`docs/qa/image-pipeline.md`) and README snippet for editors.

## Acceptance Criteria
- Lighthouse mobile LCP < 2.5s on `/` and `/services` (Fast 3G, simulated). Desktop scores ≥ 95 overall.
- 100% of Sanity-backed imagery references the helper; ESLint rule or codemod prevents regressions.
- Footer logo and other SVGs render without optimizer errors across all themes.
- Documentation reflects the new workflow and is acknowledged by design/content stakeholders.

## Next Steps
1. Create `lib/sanity-image.ts` scaffolding with placeholder exports for the helper API.
2. Update `next.config.ts` to include desired formats/domains (no functional change yet) and commit behind feature flag if needed.
3. Draft QA checklist template and circulate with design for sign-off before component refactors begin.

---
*Prepared: 2025-10-29* — Author: Image Pipeline Taskforce (ChatGPT)
