# FoodBridge — audit and rebuild record

## Baseline audit (before application changes)

Audited on 2026-10-29 at commit `d8d0388527aaa8fc5c492953dd6af49fa59476f0`, on `arena/359d37e4-foodbridge-3d`. Every tracked text source/configuration file was read; binary assets were inventoried and checksummed. The separate source archive was inventoried and its entry files inspected. Installed dependencies and generated `.next` files are not project source.

### 1. Existing files (44 tracked files)

```text
.gitignore
FoodBridge-source.zip
README.md
app/favicon.ico
app/layout.tsx
app/page.module.css
app/page.tsx
biome.json
components/3D/planet.ts
components/3D/shaders/atmosphere/fragment.glsl
components/3D/shaders/atmosphere/vertex.glsl
components/3D/shaders/earth/fragment.glsl
components/3D/shaders/earth/vertex.glsl
next.config.ts
package-lock.json
package.json
playwright.config.ts
public/earth/day.jpg
public/earth/night.jpg
public/earth/specularClouds.jpg
public/environment/ATTRIBUTION.txt
public/environment/potsdamer_platz_1k.hdr
public/fonts/AppleGaramond/AppleGaramond-Bold.woff2
public/fonts/AppleGaramond/AppleGaramond-BoldItalic.woff2
public/fonts/AppleGaramond/AppleGaramond-Italic.woff2
public/fonts/AppleGaramond/AppleGaramond-Light.woff2
public/fonts/AppleGaramond/AppleGaramond-LightItalic.woff2
public/fonts/AppleGaramond/AppleGaramond.woff2
public/fonts/Inter/InterVariable-Italic.woff2
public/fonts/Inter/InterVariable.woff2
src/components/three/CameraRig.tsx
src/components/three/Effects.tsx
src/components/three/Food.tsx
src/components/three/Globe.tsx
src/components/three/OrbitAccents.tsx
src/components/three/Particles.tsx
src/components/three/Scene.tsx
styles/base.css
styles/fonts.css
styles/main.css
styles/pages/landing.css
tests/scene.spec.ts
tsconfig.json
types/custom.d.ts
```

`FoodBridge-source.zip` contains a separate 73-entry Next 16/React 19 DOM-only FoodBridge demonstration, not the active application or the requested 3D structure. It is preserved as supplied.

### 2. Missing expected files

At the exact requested `src/` paths, 21 of the 26 expected files were absent:

- `src/app/layout.tsx`, `page.tsx`, `globals.css`, `icon.svg`. The first two existed in the legacy root `app/` directory, not `src/app/`.
- `src/components/three/FoodItems.tsx`. A different `Food.tsx` existed with three food objects.
- All eleven requested UI components: `Navbar`, `HeroSection`, `HowItWorks`, `LiveRescues`, `ImpactStats`, `Testimonials`, `ContactCTA`, `Footer`, `LoadingScreen`, `ScrollProgress`, `BackToTop`.
- `src/hooks/useScrollProgress.ts`, `src/hooks/useCountUp.ts`.
- `src/lib/scroll.ts`, `src/data/rescues.ts`, `src/types/index.ts`.

The other five expected scene filenames existed but did not meet the requested scene specification. `tailwind.config.ts` and the PostCSS configuration were also missing. `public/og-image.png` was missing despite being required by the specification.

### 3. Import errors

No unresolved imports existed in the active starter: all local imports resolved under the old `@/* -> ./*` alias. The missing FoodBridge modules were not imported anywhere, so their absence did not produce compiler errors. There was no functioning FoodBridge application to repair by changing imports alone.

### 4. TypeScript errors

Baseline `npx tsc --noEmit`: **0 errors**. Strict checking was already enabled. This did not validate the missing product requirements.

### 5. Referenced but uncreated components

**None in the baseline import graph.** All requested FoodBridge sections/components were absent and unreferenced, rather than referenced with broken paths.

### 6. Baseline 3D rendering

Verified in headless Chromium with software WebGL: a 1440×1000 canvas existed and issued 391 observed triangle draw calls; **no browser or console errors**. The canvas rendered the starter's textured Earth/fruit scene, not the specified FoodBridge globe. A large desktop screenshot timed out under software rendering; rendering was confirmed through actual WebGL calls, not assumed from a canvas element.

Baseline issues: direct rather than dynamic scene import; DPR capped at 1.5; transparent canvas; FOV 15; desktop/mobile breakpoint included 768 in mobile; depth-of-field enabled on desktop; bloom 0.8/threshold 0.4; mobile effects still enabled; 1,300 mobile particles (800+500); three food objects instead of ten/six; a textured sphere instead of the requested low-poly globe; camera driven by GSAP ScrollTrigger pinning; no graceful WebGL-unavailable/loading coordination.

### 7. Baseline DOM rendering

Only **one section**, headlined “Welcome To The New World,” with AI-agent copy and a “Get started.” button. No FoodBridge navigation, rescues, impact, testimonials, contact form, footer, or scroll utilities were rendered. The unrelated archive was not part of the route.

### 8. Lenis / GSAP

Lenis was installed but never imported or initialized. GSAP was initialized only in `components/3D/planet.ts`, which registered ScrollTrigger, pinned `.hero_main`, blurred the hero text, and animated the camera. There was no shared progress ref or `src/lib/scroll.ts`.

### 9. Dynamic imports

**None.** `app/page.tsx` imported `Scene` directly, and the scene shipped during server rendering/hydration. No `ssr: false` boundary existed.

### 10. Baseline dependencies and build

Present but wrong requested major versions: Next 16.0.1, React/React DOM 19.2.0, Fiber 9.8.2, Drei 10.7.9, React Three Postprocessing 3.2.2. Present: Three, GSAP, Lenis, TypeScript and existing type packages.

Missing: Tailwind CSS, PostCSS, Autoprefixer, Framer Motion, Lucide React, clsx, tailwind-merge.

Baseline `npm run build`: **passed**, using Next 16/Turbopack; not the requested Next 14 stack. Non-fatal warnings concerned outdated `baseline-browser-mapping` data. `npm audit` reported 13 vulnerabilities (1 critical, 7 high, 4 moderate, 1 low), including Next and build dependencies. A passing build is not a security audit.

Other baseline defects: Create Next App metadata; Apple Garamond/local Inter rather than requested Google fonts; white background; no theme tokens; no accessibility landmarks/skip link/form labels; obsolete tests asserting the AI starter and depth-of-field; no FoodBridge favicon/social image.

## Rebuild decisions

- Implement the requested `src/` structure and retire the duplicate legacy route/styles/planet shader path without deleting the supplied archive or reusable assets.
- Honor the requested Next 14 / React 18 / Fiber 8 / Drei 9 compatibility matrix, using compatible Tailwind 3 and React Three Postprocessing 2 releases.
- Keep a single GSAP ticker responsible for Lenis. The explicit component ticker example would otherwise call `lenis.raf` twice per frame; use a lifecycle cleanup without duplicate ticking.
- Use the specified city environment, with the already supplied local copy of that same Poly Haven HDR to avoid a runtime CDN dependency.
- Use a shared scroll ref for the camera; reserve GSAP for the ticker, not a second competing camera timeline.
- Treat rescue listings, claims, and contact submissions as explicitly labeled frontend demonstrations until a backend is connected.

## Final verification

### Structure and imports

All 26 expected `src/` files now exist. The duplicate legacy root `app/`, `components/3D/`, `styles/`, Earth textures, Apple Garamond fonts, and GLSL loader declarations were retired. The supplied `FoodBridge-source.zip` is preserved. Local imports resolve under `@/* -> ./src/*`; no referenced component is missing.

### Commands

- `npm run typecheck` — passed, 0 TypeScript errors.
- `npm run lint` — passed, 0 Biome errors/warnings.
- `npm run build` — passed with Next.js **14.2.35**, 0 build errors/warnings. Home route is statically prerendered; reported first-load JS for `/` is **191 kB**, with WebGL split into lazy chunks.
- `npm test` — **12/12 Playwright tests passed**: 5 scene tests and 7 site/accessibility tests.

### Browser verification

Verified in Chromium with software WebGL:

- Real triangle draw calls and point draws occur; the CSS fallback is not visibly used when WebGL works.
- Desktop renders 2,000 green + 500 coral particles; mobile renders 640 + 160 = 800 total.
- Desktop retina canvas uses DPR 2; mobile caps DPR at 1.
- No depth-of-field shader is compiled.
- Pointer parallax and scroll-driven camera travel work; reduced motion keeps the camera fixed.
- The local city HDR loads on desktop. Mobile uses the simpler direct-light path.
- Disabling WebGL leaves the full DOM usable and shows the CSS globe fallback.
- Rescue filters, session-local demo claims, contact validation/toast/reset, mobile menu, anchor navigation, back-to-top, footer dialogs, metadata, favicon, and social image all pass.
- No horizontal overflow at 375, 390, 768, 1440, and 1920 px.
- Automated axe WCAG A/AA checks report **0 violations** at desktop and mobile widths.

### Lighthouse

Final mobile audit in this sandbox (Moto G-style emulation, CPU throttling, SwiftShader software WebGL):

- Performance: **83**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **100**
- FCP / LCP: **0.8 s**
- Total blocking time: **690 ms**
- CLS: **0.002**

The mobile performance target (>80) is met. Desktop software-WebGL Lighthouse runs were substantially slower and hit a screenshot timeout because the desktop path intentionally keeps HDR environment lighting and post-processing; re-measure desktop on hardware GPU before treating that software-rendered score as representative.

### Dependency audit and intentional deviations

Required dependency matrix is present: Next 14.2.35, React/React DOM 18.3.1, Fiber 8.18.0, Drei 9.122.0, React Three Postprocessing 2.19.1, Three 0.170.0, Tailwind 3.4.19, Lenis 1.3.27, GSAP 3.15.0, Framer Motion 11.18.2, Lucide, clsx, tailwind-merge, TypeScript and type packages.

`npm audit` now reports **1 critical advisory**, solely in the explicitly requested Next.js 14 line. A compatible PostCSS override removed the transitive high-severity PostCSS advisory. **Do not treat this stack as production-security-clean.** Upgrading Next.js beyond the requested 14.x line is the available remediation and should be approved before a real launch.

Intentional, documented deviations:

- Solid coral buttons use dark forest text instead of white to pass contrast checks.
- Mobile omits HDR environment lighting and uses the simpler direct-light setup to meet the performance budget; desktop keeps the local city environment.
- The city environment is the same Poly Haven HDR as Drei’s `city` preset, served locally (512×256 runtime derivative) instead of forcing Drei’s CDN.
- ScrollTrigger is registered as requested, but automatic layout refreshes are disabled because the camera uses a passive scroll ref. Lenis has exactly one GSAP ticker driver, avoiding the duplicate `raf` call in the example.
- `next/font/google` is used with a build-time local mirror of the genuine Google font files so restricted/offline builds remain reproducible; browsers receive self-hosted Next.js font assets.
- Listings, claims, stories, metrics, and contact submissions are clearly labeled frontend demonstrations. No backend, persistence, geolocation, or real reservation/message delivery is implied.
