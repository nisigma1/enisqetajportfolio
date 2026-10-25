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
| 7 | Major | Home, mobile rendering | Pixel-reveal animation uses 24 full-portrait clipped boxes. | True tile bounds replace full-size clip-path layers, retaining the same original WebP, crop and reveal timing. An AVIF experiment reduced bytes but failed to demonstrate an aggregate timing improvement, so it was reverted. `PixelImage.tsx`. |
| 8 | Major | Home, 320px, 200% text | A bare `1fr` hero track expands to min-content size while decorative clipping hides the overflow. Fixed heading minimum can also exceed a phone's text measure. | Shrinkable track, emergency text wrapping and a heading width cap that is inactive at normal text size. `styles/sections.css`. Extend text-resize QA to Home and scroll deferred sections before checking. |
| 9 | Major | Home: scroll to Contact while portrait is fully offscreen | Infinite registered-property border animation continues style recalculation outside the viewport. Controlled alternating running/paused probe reproduced 434 style recalculations and 812–939ms of renderer TaskDuration per three seconds while hidden. | `VisibilityFigure.tsx` preserves the exact figure DOM and visible effect, pauses when outside the viewport or the document is hidden, disconnects its observer/listener on unmount, and resumes the same animation when visible again. |

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

AVIF experiment (not retained): mobile 143,817 bytes versus the approved WebP's 193,026 bytes; PSNR 36.43dB. The three-run live follow-up median was worse overall (Home score 73, FCP 2.72s, LCP 4.01s, TBT 394ms, CLS 0; individual scores 72/73/90). Pricing scored 90 with LCP 3.06s and TBT 106ms. Host variability and different unchanged-framework tasks prevent attributing all timing differences to image encoding, but smaller bytes alone did not establish a speed win. Original WebP delivery was restored rather than presenting the best sample as the result. Experimental AVIF files and their helper were removed; they remain recoverable in commit `bd10bfb2`. No approved photographic assets were removed.

## Verification before publication

- Production build and 18 rendered-content/transition/API-mock tests passed; TypeScript and focused lint passed. No real email was sent by the test.
- Default-viewport layout matrix: 392 combinations passed after inner-page repairs; the last header enhancement and portrait encoding were subsequently verified by the focused checks below, not falsely counted as another 392-run matrix.
- Final enlarged-text probe: 54/54 passed, including the added assertion preventing single-letter wordmark stacking.
- Safari touch suite: an initial run under parallel audit load timed out waiting for the first menu dialog in the iPhone 16 Pro Max dark case. An isolated full rerun passed 8/8 profiles/themes with console/page-error capture enabled, including that exact case. A persistent application cause was not established; the initial failure is retained here rather than reported as a passed run.
- Portrait QA: seven WebKit/Chromium cases, 320–1440px, passed during the encoding experiment. The final probe expects original WebP delivery after the experiment was reverted. Windows WebKit's codec support is not identical to physical iOS Safari.
- New reveal tiles occupy a total area of approximately one portrait rather than 24 full-portrait boxes. WebKit 430px before/after screenshot comparison: same dimensions, mean channel difference 0.0096/255 (subpixel tile edges). The normal 430px header screenshot is pixel-identical to the pre-publication live header.
- Seven-width research/Besiana regressions passed, with real images loaded, no fake phone overlay, long research titles contained, same-route contact selection correct, prices/education preserved and unknown project/research slugs returning 404.

This is a tested improvement, not a claim that every possible device/state is perfect. Real iPhone hardware testing remains unavailable.

## Final follow-up checks

- Enlarged-text suite expanded to seven routes including Home, with scroll activation of deferred sections: **63/63 passed** at 320/390/430px × 100/130/200% text. The extra Home defect was not detected by document scroll width alone because the hero already clips decoration; child-bound checking found it.
- Original WebP portrait delivery restored; seven portrait cases passed again, one source requested per viewport, same crop and reveal coverage. The normal 430px header remains pixel-identical to the live reference.
- New ambient-animation regression passed: visible animation runs, offscreen animation pauses, and scrolling back resumes it. Three final offscreen three-second samples recorded TaskDuration **0.532/0.361/0.411ms**, zero style recalculations and zero layout duration. Median **0.411ms** versus the controlled pre-fix running samples **812/939ms**. This measures this page's renderer main-thread work under the stated condition, not whole-device battery life or field INP. Raw output: `outputs/responsive-20261025/ambient-animation/results.json`.
- Lab touch navigation click-to-content-ready (including the existing mosaic), three-run medians: Background 953ms, Work 1011ms, Malera 1046ms, Pricing 942ms, Contact 906ms. This is not field INP and is not claimed as an improved metric without a comparable prior sample.
- Final production build, all 18 tests, TypeScript and focused lint passed.

## Final publication and remaining performance limit

Application commit `4f43a2dbf2626d69f4b0637a7932004d40233d19` was pushed to GitHub and successfully deployed by Cloudflare Pages, deployment `55d022a4-ed39-4fd3-9b42-1fc20a5ee842`. Verified at https://enisqetaj.com/ and the Background route: visibility gating is present, original WebP is restored, Experience — 1 year is present, and the issue date is absent. All 14 public route smoke requests returned 200. No DNS/account/hosting changes were made.

The complete final text-resize probe also ran against the deployed domain: **63/63 passed**, including Home and deferred sections after scrolling, with no measured overflowing text/container or vertically fragmented wordmark.

The final live ambient test passed pause/resume assertions. Three offscreen samples recorded **1.638/0.481/1.039ms** renderer TaskDuration per three seconds (median **1.039ms**), with zero style recalculations and zero layout duration. This confirms the large reduction in offscreen work on the actual deployed application.

Three final live mobile Lighthouse runs, same setup as baseline:

| Home metric | Baseline median | Final median |
|---|---:|---:|
| Performance score | 80 | 82 |
| FCP | 2.38s | 2.47s |
| LCP | 3.97s | 4.13s |
| TBT | 157ms | 155ms |
| CLS | 0 | 0 |
| Speed Index | 2.44s | 2.47s |

Raw final reports: `outputs/audit-20261019/followup-live-final/`. **Initial-load speed is not demonstrated to have improved meaningfully. LCP <=2.5s and consistent mobile Lighthouse >=90 are not achieved.** The offscreen runtime improvement must not be presented as an initial-load improvement. Startup still transfers approximately 448KB including the original 193KB portrait, 84KB fonts and 129KB scripts; further critical-path profiling remains an open performance item, not a verified repaired defect. No field INP measurement is available.
