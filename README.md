# 🌿 FoodBridge

**Rescue Food. Feed People. Zero Waste.**

A rebuilt Next.js 14 App Router site with a fixed React Three Fiber scene, Lenis smooth scrolling, Tailwind theme tokens, Framer Motion reveals, and a complete food-rescue frontend.

> **Security note:** this project honors the requested Next.js 14 / React 18 stack. `npm audit` currently reports a critical advisory in the Next 14 line. It builds and passes browser tests, but it should not be treated as production-security-clean. Upgrade Next.js before a real launch.

## Run locally

Node.js 18.17+ (Node 22 recommended).

```bash
npm ci
npm run dev
```

Open http://localhost:3000. The dev server binds to `0.0.0.0` for hosted previews.

### Production preview

```bash
npm run build
npm start
```

No API keys or database are required. All runtime assets are local; browser code uses relative URLs.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
npx playwright install chromium   # once
npm test
```

The Playwright suite covers real WebGL draw calls, desktop/mobile particle budgets, retina DPR, camera parallax/scroll, reduced motion, no-WebGL fallback, rescue filtering and demo claims, contact validation, mobile navigation, back-to-top, footer dialogs, metadata, responsive overflow, and axe WCAG A/AA checks.

If Chromium is already installed elsewhere:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium npm test
```

Final sandbox results: typecheck/lint/build clean, **12/12 tests passed**, mobile Lighthouse **83 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**. See `AUDIT.md` for the full baseline audit, verification record, and caveats.

## What’s included

- Fixed low-poly globe, glossy procedural food items, orbital accents, and green/coral particles.
- Desktop: local city HDR environment, directional/green/warm lighting, restrained Bloom + Vignette, DPR up to 2.
- Mobile: 6 food items, 800 total particles, DPR 1, simpler direct lighting, no post-processing.
- No depth-of-field or chromatic aberration.
- Lenis driven by one GSAP ticker; camera reads a passive scroll-progress ref.
- Navbar, hero counters, How It Works, live rescue filters and demo claim dialog, impact stats/chart, testimonials, contact form with demo toast, footer/legal dialogs, loading screen, scroll progress, back-to-top, noise overlay, and custom scrollbar.
- Reduced-motion support, skip link, semantic landmarks, labeled forms, visible focus states, native modal dialogs, and a CSS globe fallback when WebGL is unavailable.
- Space Grotesk + Inter via `next/font/google`, Open Graph image, leaf favicon, and Vercel-aware metadata base.

## Project structure

```text
src/
├── app/            # layout, page, globals.css, icon.svg
├── components/     # DOM sections and utilities
│   └── three/      # Scene, Globe, FoodItems, Particles, CameraRig, Effects
├── hooks/          # scroll progress, count-up, media query
├── lib/            # Lenis/GSAP lifecycle, cn helper
├── data/           # typed rescue fixtures and content
└── types/          # shared TypeScript types
public/
├── environment/    # Poly Haven city HDR + attribution
├── fonts/licenses/ # Inter and Space Grotesk OFL licenses
└── og-image.png
```

## Configuration

- Colors and fonts: `tailwind.config.ts`, `src/app/globals.css`.
- Rescue listings and metrics: `src/data/rescues.ts`.
- Metadata: `src/app/layout.tsx`. On Vercel, the production/deployment URL is used automatically. For a custom domain, set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` and redeploy.
- Fonts: `next/font/google` is paired with `scripts/google-font-responses.cjs`, a build-time mirror of the genuine Google font files from Fontsource. This keeps builds reproducible when Google Fonts is unreachable; Next.js still fingerprints, self-hosts, and preloads the fonts.
- Environment lighting: the runtime uses a 512×256 derivative of Drei’s CC0 city HDR, served locally. The original 1K file and attribution remain in `public/environment/`.

## Demo boundaries

This is an interactive frontend, not a live food-distribution service. Listings, pickup windows, claims, stories, and impact figures are illustrative. Claims exist only in page memory and reset on refresh. The contact form validates locally and shows an honest demo toast; it does not send or store messages.

Before real use, add an authenticated backend, persistent inventory, atomic claims, real contact delivery, verified partner profiles, food-safety/allergen procedures, operator-specific legal notices, and a supported Next.js version.

## Deploy

`vercel.json` configures Next.js with `npm ci` and `npm run build`. Import the repository into Vercel, or use the CLI from this directory. No static export is required.
