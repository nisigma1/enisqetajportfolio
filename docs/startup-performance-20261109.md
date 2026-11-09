# Homepage startup follow-up — 9 November 2026

Starting application: `932c3665` (SMM + AI experience 2+ years). The previous audit left cold mobile LCP open. A fresh three-run Lighthouse baseline against the live homepage recorded median LCP **4.16s**, score **71**, and CLS **0**. Lighthouse identified the portrait as LCP.

| Finding | Change | Verification |
|---|---|---|
| 193,026-byte portrait served at all phone widths up to 767px. | A 636×848 WebP of the same approved photograph, 122,218 bytes, now serves through 479px. No change to crop, aspect ratio, or existing larger sources. The `<picture>` and decorative tiles use the same source breakpoint. | Nine Chromium/WebKit viewport cases, including 479/480px, requested exactly one portrait asset. At 430px, rendered figure geometry and the header remained unchanged; header pixel difference 0, figure mean channel difference 4.64/255. The before/after image was reviewed visually. |
| Visible border orbit animated a custom gradient angle, triggering repeated style work even after offscreen pausing was fixed. | Rotate a prepainted gradient with a transform under the same one-pixel ring. Preserve the 5.4s motion, pause/resume behavior, and reduced-motion still frame. A static ring is available without mask-composite support. | Three local Chromium three-second visible samples: median renderer TaskDuration 1,741ms → 18ms; style recalculation count 433 → 8. Offscreen state still paused, with median zero style recalculations, and resumed on return. |

The compact derivative was encoded from the approved `enis-mobile.webp` with Sharp, 636×848, WebP quality 78 / effort 5. All original assets remain. This is a lossy derivative, not a pixel-identical photo or a replacement crop.

## Comparable local startup measurements

Three mobile Lighthouse runs against the same local audit server before and after; that server does not provide production compression, so compare its numbers only with each other.

| Median | Before | Candidate |
|---|---:|---:|
| LCP | 6.18s | 5.76s |
| FCP | 4.32s | 4.29s |
| TBT | 234ms | 377ms |
| CLS | 0 | 0 |
| Performance score | 63 | 59 |

The retained change reduces the transferred portrait by 36.7%, improves the local LCP sample, and removes most visible ornament style work. It does not establish a broad Lighthouse score or TBT improvement. Main-thread task timing varied across runs. These are lab measurements, not real-user metrics or physical iPhone tests.

Build and all 18 tests passed. Evidence is under `outputs/startup-20261109/` and `outputs/audit-20261019/startup-20261109-*/`.
