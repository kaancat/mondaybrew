# Image Pipeline QA Checklist

Use this checklist before shipping changes to the image delivery stack.

## Preflight
- [ ] Lighthouse mobile + desktop snapshots captured (Home, Services, Cases).
- [ ] WebPageTest run on Fast 3G (3× median) with notes on LCP, CLS, total bytes.
- [ ] Sanity CDN logs reviewed for 404/5xx during smoke test.

## Component Regression
- [ ] Hero backgrounds render with blur placeholder and no visual flicker.
- [ ] Services Split media loads with correct theme styling in primary, light-alt, and dark modes.
- [ ] Case Study carousel cards show posters/videos without layout shifts.
- [ ] Media Showcase card respects autoplay gating and poster fallback.
- [ ] Clients marquee/grid logos render in both desktop and mobile layouts without stretching.
- [ ] Testimonials marquee cards display logos + photography with correct stacking.
- [ ] Text + Image sections (default + tabs) keep aspect ratio on mobile/tablet.
- [ ] About section parallax image remains masked on desktop and falls back gracefully on mobile.
- [ ] Navbar and footer logos render from inline/static assets without broken links.

## Accessibility
- [ ] All decorative images have empty alt; content images have localized alt text.
- [ ] Video components respect `prefers-reduced-motion`.
- [ ] Color contrast verified for new overlays/gradients.

## Analytics & Monitoring
- [ ] Vercel Web Vitals dashboard checked post-deploy (no regressions >5%).
- [ ] Sanity asset cache metrics reviewed (hit rate, bandwidth).
- [ ] Any new helper utilities covered by unit tests or storybook stories.

Document outcomes (pass/fail, notes, links) in the release PR description.
