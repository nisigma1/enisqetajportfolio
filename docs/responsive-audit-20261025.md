# Responsive repair audit — 25 October 2026

## Scope and preservation

Production: https://enisqetaj.com/. Existing GitHub → Cloudflare Pages publication is retained; no DNS, account, hosting stack or audience change is part of this work.

Starting production commit: `823729b` (Hallakate certification). The `checkpoint/responsive-20261025` branch and ignored `outputs/responsive-20261025/starting-working-tree.patch` preserve the starting state. Previously unfinished audit repairs were present in the checkout, but not production. They are included in this release only after the additional responsive verification below. Unrelated pre-existing ESLint configuration edits and temporary logs are excluded.

The approved homepage's copy, portrait, font families and primary composition are retained. Its research preview and intermediate-width grid are corrected where reproducible defects were found. All three real projects, university degrees/statuses, Crypto School's 11 modules and the €30/€60/€100 monthly crypto-research plans remain.

Hallakate: training hours and the five-day duration are removed. Provider, course name, completed status and issue date remain. The private certificate photograph, signature and credential number are not published.

## Verified defects and repairs

| # | Severity | Route / reproduction | Root cause | Repair | Main files |
|---|---|---|---|---|---|
| 1 | Major | Home, phone widths including iPhone 16 Pro | Research preview's nested grid/figure min-content width exceeds the padded parent; global clipping masks the issue. | `minmax(0,1fr)`, explicit child minimums/max width, wrapping and natural image height. Remove global horizontal clipping instead of hiding the fault. | `styles/ia-update.css`, `styles/foundation.css`, `HomePracticeTabs.tsx` |
| 2 | Major | Besiana on Work, Malera and detail route | Reconstructed placeholder and absolutely positioned miniature phone create an overlapping, misleading composition. | Actual source-site browser capture plus authentic responsive photographs, stable ratios, single-column mobile gallery; no fake phone UI. | `BesianaPhotographyArtwork.tsx`, `styles/besiana-showcase.css`, `app/work/[slug]/page.tsx` |
| 3 | Major | Project detail at 320–430px | Grid automatic minimum and oversized title exceed available width. | Zero-minimum tracks, constrained title and appropriate editorial type for Besiana. | `styles/sections.css`, `styles/inner-pages.css` |
| 4 | Major | Contact on iPhone | Text entry and native selects compute to 13px; native select also uses a different system font. This is below iOS's common focus-zoom threshold. | 16px text, inherited brand family and consistent line height through the mobile/tablet breakpoint. User zoom is not disabled. | `styles/inner-pages.css` |
| 5 | Major | Initial navigation/reading, especially Safari | A `pageshow` listener resets scroll repeatedly through nested animation frames and a delayed timer, competing with early user scrolling and restoration. | Only initialize a fresh, non-history/non-hash load; remove delayed resets. Retain router back/forward restoration. | `app/layout.tsx`, rendered HTML tests |
| 6 | Major | Phone menu → another route → Back | Fixed-body menu lock exposes `scrollY=0` when route history is saved. | Unlock/restore the departing position synchronously before the router records it; do not refocus the outgoing control after a transition. | `Navigation.tsx`, `TransitionLink.tsx`, `RouteTransitionProvider.tsx` |
| 7 | Minor | Barber labels at 390, 768, 1024 and 1280px | A 12-letter label with wide tracking is squeezed into a narrow caption track; full-sized desktop title also exceeds its own column. | More appropriate caption minimums, one proof column on tablet, tighter label tracking and container-sized title. | `styles/barber-showcase.css` |
| 8 | Minor | Home research method at 1024/1280px | Six cards remain in one row when their padded text area is narrower than “Interpretation”. | Three columns at intermediate desktop widths; six-column large-desktop composition retained. | `styles/sections.css` |
| 9 | Major | Contact query CTA | Reused form initializes service only at mount. | React to search-parameter changes; verify same-route service switches and Advanced plan prefill. | `ContactForm.tsx` |
| 10 | Major | Work heading in light theme | Stroke/fill defaults assume a dark background. | Theme-aware text and accent colors; native animation retains readable server-rendered content. | `StrokeText.tsx`, `FoldText.tsx` |
| 11 | Minor | Malera lower section on phone | Intentional blue letter-glitch decoration competes with real content and animates on small screens. | Static mobile/reduced-motion fallback; bounded, restrained desktop decoration. This is not research text and is not a corrupted credential. | `DeferredIslands.tsx`, `LetterGlitch.tsx`, `styles/inner-pages.css` |
| 12 | Major | Navigation delay | Destination I/O waits for mosaic coverage, with additional long backing/reveal delays and excess tiles. | Parallel destination work, bounded tile count, no idle overlay DOM, shorter cover/reveal and fallback timing. | Transition components, transition utility, motion tokens |
| 13 | Major | Malera mobile motion | Expensive WebGL renderer starts irrespective of small screen/visibility. | No renderer on small screens/reduced motion; pause offscreen/hidden, 30fps desktop, cleanup listeners and GL resources. | `Ferrofluid.tsx` |
| 14 | Minor | Homepage responsive portrait requests | Width-based image selection disagrees with CSS reveal breakpoints. | Match picture sources to existing reveal breakpoints, keeping original imagery. | `PixelImage.tsx` |
| 15 | Minor | Route payload | Inner-page/curriculum CSS and a full animation library are loaded where unnecessary. | Route CSS boundary; native small heading effects; identical local fonts with early Latin preloads. No application dependency/stack replacement. | Layout/style imports, `InnerPageStyles.tsx`, fonts, text effects |
| 16 | Minor | Malera project links and legacy route | Proof links target archive hashes; legacy `/malera` has incorrect active-nav mapping. | Link real case studies and map both Malera routes coherently. | `app/companies/page.tsx`, `lib/route-transition.mjs` |

## Authentic Besiana media

The actual website was opened in a browser, not reconstructed. The portfolio now uses:

- `https://besianaphotography.com/media/photos/frame-01-768.avif` and `frame-02-768.avif`, converted to local 768×1024 WebP and downsampled 480px sources.
- A real 1440×900 browser capture of the live interface, with a 768px derivative.

No photo or screenshot is enlarged beyond its source resolution. Original existing assets are retained. The private Hallakate certificate is not included among public assets.

## Test method and limitations

Real browser engines: installed Chrome, and Playwright WebKit 27.2 with touch/mobile emulation. This is not a claim of hands-on testing on physical iPhones, every iOS release, real keyboard chrome, hardware GPU or notch inset.

The final layout matrix is 14 routes × 28 device/theme combinations = 392 checks:

- WebKit profiles: iPhone 14, iPhone 15 Pro Max, iPhone 16, iPhone 16 Pro, iPhone 16 Pro Max, iPhone 17 Pro Max, and iPhone 14 landscape, each light/dark.
- Chrome viewports: 320×568, 375×812, 768×1024, 1024×768, 1280×800, 1440×900 and 1920×1080, each light/dark.
- Routes: `/`, `/background`, `/work`, all three project details, `/companies`, `/malera`, `/pricing`, `/contact`, `/about`, `/research`, `/markets`, `/build`.

Checks cover HTTP status, document width, individual main-content bounds, actual text-box overflow, decoded images and JavaScript exceptions. Deliberately screen-reader-only content is excluded from visual-overflow assertions, not removed from the website. Some failures in initial test runs were test timing/auto-scroll artifacts; these were distinguished from product defects before editing application code.

Safari interaction checks use real touch events, rather than desktop click assumptions: menu open/close and body-scroll restoration, all five nav destinations, all 11 curriculum modules, all three home tabs, certification without duration, ≥16px form text, plan prefill, validation, simulated success and theme switching. Simulated delivery intercepts the request: **no email is sent and real inbox delivery is not claimed**.

Other regressions check long unbroken research titles, 200% CSS zoom, Besiana image decoding/no phone overlay, expected 404s, local links, Back/Forward, reduced-motion navigation, prices and academic content. CSS zoom is a useful layout stress test, not a physical Safari pinch-zoom test.

## Verification record

- Production build and 18 unit/server-rendered tests: passed.
- TypeScript: passed.
- Focused application-source ESLint: passed; unrelated pre-existing files are not claimed lint-clean.
- Final 392-case layout matrix: **392 passed, zero failures**, including individual text-box overflow checks.
- Safari touch-state matrix: **8/8 passed** (four named iPhone profiles × light/dark), all 11 module controls and all three practice tabs.
- Local link/history checks: **19 internal links passed**, Back/Forward restored reading position, footer visible on all 14 routes, reduced-motion navigation passed.
- Chrome targeted regression checks: seven widths, research long strings/200% CSS zoom, Besiana media, same-route inquiry selection, prices/content and expected 404s passed.
- WebKit console scan: zero console errors across Home, Background, Work, Malera, Crypto Analysis and Contact.
- Live publication: pending final result; local results alone do not establish a live fix.

Artifacts are retained locally in `outputs/responsive-20261025/`: baseline live captures, intermediate failures, final JSON and screenshots. Earlier production-build performance experiments are retained in `outputs/audit-20261019/`; they are not field INP or fresh production measurements for this responsive release. No unmeasured “10/10”, universal device guarantee or Lighthouse score is claimed.

### Reproduction

Use the existing application install. QA-only tools are separate:

```powershell
npm install --prefix .tmp/audit-tools --no-save playwright lighthouse
node .tmp/audit-tools/node_modules/playwright/cli.js install webkit
npm test
npx tsc --noEmit
npx eslint app components data lib --ignore-pattern dist
node scripts/audit-server.mjs
# In another terminal:
node scripts/audit-responsive.mjs verified http://127.0.0.1:3089
node scripts/audit-safari-interactions.mjs http://127.0.0.1:3089
node scripts/audit-links-history.mjs http://127.0.0.1:3089
node scripts/audit-regressions.mjs http://127.0.0.1:3089
```

The local server serves the production-built Worker and assets without HMR; it is a QA harness, not a compression/edge-runtime or email-service benchmark.
