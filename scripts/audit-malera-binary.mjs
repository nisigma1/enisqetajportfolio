import assert from "node:assert/strict";
import { chromium, webkit, devices } from "../.tmp/audit-tools/node_modules/playwright/index.mjs";

const origin = process.argv[2] || "http://127.0.0.1:3089";
const profiles = [
  [chromium, { channel: "msedge" }, { viewport: { width: 1440, height: 900 } }],
  [webkit, {}, { ...devices["iPhone 15 Pro Max"], viewport: { width: 390, height: 844 } }],
];
for (const [engine, options, device] of profiles) {
  const browser = await engine.launch(options);
  try {
    const page = await browser.newPage(device);
    for (const motion of ["no-preference", "reduce"]) {
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto(origin + "/companies#malera", { waitUntil: "domcontentloaded" });
      const band = page.locator("#malera [data-studio-binary]");
      assert.equal(await band.getAttribute("aria-hidden"), "true");
      const geometry = await band.evaluate(el => ({
        background: getComputedStyle(el).backgroundImage,
        animation: getComputedStyle(el).animationName,
        height: el.getBoundingClientRect().height,
      }));
      assert.match(geometry.background, /malera-binary\.svg/);
      assert.equal(geometry.animation, "none");
      assert.ok(geometry.height > 0 && geometry.height <= 28, "binary remains a decorative strip");
      assert.equal(await page.locator("#malera canvas").count(), 0);
    }
    for (const path of ["/", "/work", "/contact", "/pricing"]) {
      await page.goto(origin + path, { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator("[data-studio-binary]").count(), 0, path);
    }
  } finally {
    await browser.close();
  }
}
console.log("Malera binary strip stays decorative and static on desktop and on mobile, and is isolated to the studio page.");
