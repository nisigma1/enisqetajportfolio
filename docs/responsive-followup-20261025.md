# Responsive follow-up — 25 October 2026

This follow-up starts from published application `dcaae077b93cc2aef04f20e21442f943e65358e1` and evidence commit `5603eaa2`. The user reports additional mobile overflow and slowness. Earlier passing default-viewport checks do not invalidate that report.

## Confirmed additional findings

| # | Priority | Reproduction | Precise cause | Repair / files |
|---|---|---|---|---|
| 1 | Requested content | Background, SMM + AI | Final column shows certification and issue date instead of the user's requested experience. | `SmmAiCertification.tsx`: Experience — 1 year, as supplied by the user; no published issue date. Remove unused date styles and update rendered-content test. |
| 2 | Major | Inner pages at 320–430px with 130% / 200% root text size | Nested grid min-content widths and unbreakable names widen tracks or clip content. | `inner-pages.css`: scoped emergency word wrapping, shrinkable identity track, stacked mobile education, bounded wrapping buttons. No global overflow clipping. |
| 3 | Major | Pricing at 320px default text and enlarged text | Three narrow layer tracks crowd “Fundamental”; featured title and badge are a nonwrapping flex row. | Content-sized auto-fit layer grid, wrapping heading/badge and price in `inner-pages.css`. All prices and research scope retained. |
| 4 | Major | Contact, 430px, 200% text | Fixed auto-width secondary action leaves the submit action only 64px wide. | Intrinsic auto-fit action tracks in `inner-pages.css`, preserving full-size readable controls. |
| 5 | Major | Header, 320px, 200% text | Name and nonshrinking action row exceed available width. Merely forcing min-width:0 produces a vertical stack of individual letters. | `components.css`: small-screen wrapping flex header keeps the wordmark intact and moves controls to another row only when needed. `layout.css`: shrinkable tablet track. Default-size presentation must be checked separately. |
| 6 | Major | Crypto School detail, 320px, 200% text | Explicit `overflow-wrap:normal` on the large detail title overrides containment. | `crypto-curriculum.css`: allow long module titles to wrap within their reading panel. |
| 7 | Major | Home, mobile Lighthouse | Approved 750×1000 portrait transfers 193,026 bytes; pixel-reveal animation uses 24 full-portrait clipped boxes. | Encoding-only AVIF alternatives with original WebP fallbacks; mobile derivative 143,817 bytes (25.5% smaller). True tile bounds replace the full-size clip-path layers, retaining the same source, crop and reveal timing. `PixelImage.tsx`, `DefinitiveSections.tsx`, `data/site.ts`, new AVIF assets. |

## Evidence and limits

The new WebKit text-resize probe covers six inner routes × three widths (320/390/430) × three text scales (100/130/200%), 54 combinations. This intentionally tests enlarged root text; it is not a claim of physical iOS Dynamic Type testing or Safari pinch-zoom equivalence. Initial probe: **22 failing combinations**. An intermediate repair reduced this to six, then zero geometric failures; visual review exposed the wordmark's poor single-letter wrapping despite those geometric passes. A brand-line assertion was therefore added before final verification.

Baseline JSON and screenshots: `outputs/responsive-20261025/text-resize/before-results.json`, `before-failures.json`, `320-large-before.png`. Updated evidence remains alongside them. QA tools stay separate from the application dependency graph.

No field INP, hardware-iPhone result, universal perfection or deployment success is inferred from a build. Performance and final publication status are recorded only after execution.

## Performance baseline, actual production

Three Lighthouse mobile runs per route, default simulated mobile throttling, Chrome on this Windows host, against https://enisqetaj.com/ before this follow-up was published. Medians, not best samples:

| Route | Performance | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| Home | 80 | 2.38s | 3.97s | 157ms | 0 |
| Pricing | 91 | 2.34s | 3.08s | 90ms | 0 |

Raw reports: `outputs/audit-20261019/followup-live-baseline/`. These are lab tests, not field INP. Other desktop applications were not stopped. Home's first sample overlaps the end of a local build; the median is reported across all three without dropping it. The LCP minimum goal is not met by these baseline results, even where the overall score is 91.

AVIF derivative fidelity against the approved WebP input: mobile PSNR 36.43dB, tablet 36.54dB, desktop 36.74dB; mean channel difference 2.65–2.74/255. This is lossy encoding, not pixel identity. No crop, dimensions, person or photographic content was changed; original assets remain available as fallbacks.

## Verification before publication

- Production build and 18 rendered-content/transition/API-mock tests passed; TypeScript and focused lint passed. No real email was sent by the test.
- Default-viewport layout matrix: 392 combinations passed after inner-page repairs; the last header enhancement and portrait encoding were subsequently verified by the focused checks below, not falsely counted as another 392-run matrix.
- Final enlarged-text probe: 54/54 passed, including the added assertion preventing single-letter wordmark stacking.
- Safari touch suite: an initial run under parallel audit load timed out waiting for the first menu dialog in the iPhone 16 Pro Max dark case. An isolated full rerun passed 8/8 profiles/themes with console/page-error capture enabled, including that exact case. A persistent application cause was not established; the initial failure is retained here rather than reported as a passed run.
- Portrait QA: seven WebKit/Chromium cases, 320–1440px, passed. Exactly one portrait resource is requested per viewport; Chromium uses AVIF and Windows WebKit successfully uses the original WebP fallback. Windows WebKit's codec support is not identical to physical iOS Safari.
- New reveal tiles occupy a total area of approximately one portrait rather than 24 full-portrait boxes. WebKit 430px before/after screenshot comparison: same dimensions, mean channel difference 0.0096/255 (subpixel tile edges). The normal 430px header screenshot is pixel-identical to the pre-publication live header.
- Seven-width research/Besiana regressions passed, with real images loaded, no fake phone overlay, long research titles contained, same-route contact selection correct, prices/education preserved and unknown project/research slugs returning 404.

This is a tested improvement, not a claim that every possible device/state is perfect. Real iPhone hardware testing remains unavailable.
