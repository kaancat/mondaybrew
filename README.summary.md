# mondaybrew Website — Quick Overview

## Stack & Tooling
- Next.js 15 (App Router, TypeScript) on Vercel
- Tailwind CSS v4 + shadcn/ui primitives
- Framer Motion + GSAP (ScrollTrigger ready)
- Sanity Studio (hosted at https://mondaybrew.sanity.studio/ and embedded at `/studio`)
- Mux-ready video components (placeholder; media blocks use images for now)
- GA4 with Consent Mode plus lightweight cookie banner
- Layout primitives: `Container` / `Section` components + global spacing/typography tokens in `globals.css`

## SEO & Content
- Metadata helper maps Sanity SEO fields to Next metadata (canonical + hreflang)
- JSON-LD helpers (Organization, WebSite, Article, Breadcrumb) wired into blog routes and layout
- Sanity-driven sitemap (da/en) + ISR revalidation webhook
- Blog routes scaffolded for da/en with article schema, draft placeholder content
- Brand fonts (Heywow / Sailec) and color tokens wired through Tailwind variables

## Sanity Setup
- Project ID `4ot323fc`, dataset `production`
- Site Settings document seeded (title + logo)
- Content schemas: pages, posts, case studies, shared objects, section blocks
- CLI script `scripts/updateLogo.ts` for uploading/replacing logo via Sanity API

## Deployment & Integrations
- Vercel project `mondaybrew-website` (envs synced for Sanity, GA4, revalidate secret)
- Revalidate API (`/api/revalidate?secret=…`) hooked to Sanity webhook (Create/Update/Delete)
- Hosted Studio auto-deploy script: `npm run studio:deploy`
- Repo: https://github.com/kaancat/mondaybrew (branch `main`)

## Theme Registry
- Theme kits live in `src/theme/registry.ts`; tokens apply via CSS custom properties in `src/app/globals.css`.
- Available ids: `light-primary` (brand default), `light-alt` (experimental neutral), `dark` (brand-aligned night).
- Default theme resolves to `NEXT_PUBLIC_DEFAULT_THEME` (fallback `light-primary`).
- Navbar toggle cycles through the kits in order (Primary → Alt → Dark) — helpful for previewing locally.

## Next Steps (suggested)
- Build global navigation/header + hero with new layout system
- Implement CMS-driven sections & home page layout
- Implement case study/service routes with JSON-LD
- Add Sanity preview mode (read token)
- Layer in GSAP scroll experiences and production content
