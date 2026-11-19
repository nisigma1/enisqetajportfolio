import assert from "node:assert/strict";
import { chromium, webkit, devices } from "../.tmp/audit-tools/node_modules/playwright/index.mjs";

const origin = process.argv[2] || "http://127.0.0.1:3089";
const profiles = [
  [chromium, { channel: "msedge" }, { viewport: { width: 1440, height: 900 } }, false],
  [webkit, {}, { ...devices["iPhone 15 Pro Max"], viewport: { width: 390, height: 844 } }, true],
];
for (const [engine, options, device, phone] of profiles) {
  const browser = await engine.launch(options);
  try {
    const page = await browser.newPage(device);
    for (const motion of ["no-preference", "reduce"]) {
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto(origin + "/companies#malera", { waitUntil: "domcontentloaded" });
      const studio = page.locator("#malera.malera-practice");
      await studio.scrollIntoViewIfNeeded();
      assert.deepEqual(await studio.locator(".malera-practice__relationship h3").allTextContents(), ["Enis Qetaj", "Malera Studio"]);
      const geometry = await studio.evaluate(el => {
        const decoration = el.querySelector(".malera-practice__glitch");
        const cards = Array.from(el.querySelectorAll(".malera-practice__relationship h3"), heading => heading.parentElement.getBoundingClientRect());
        return {
          decoration: getComputedStyle(decoration).display,
          fallback: decoration.querySelector(".letter-glitch--deferred") ? getComputedStyle(decoration.firstElementChild).backgroundImage : null,
          section: getComputedStyle(el).backgroundImage,
          cards: cards.map(({ x, top, right, bottom }) => ({ x, top, right, bottom })),
        };
      });
      const [founder, company] = geometry.cards;
      if (phone) {
        assert.equal(geometry.decoration, "none");
        assert.equal(geometry.section, "none");
        assert.ok(company.top > founder.bottom, "the two cards stack");
        assert.equal(await studio.locator("canvas").count(), 0);
      } else {
        assert.notEqual(geometry.decoration, "none");
        if (motion === "reduce") assert.match(geometry.fallback, /malera-binary\.svg/);
        assert.equal(company.top, founder.top);
        assert.ok(company.x > founder.right, "the two cards sit side by side");
      }
    }
    for (const path of ["/", "/work", "/contact", "/pricing"]) {
      await page.goto(origin + path, { waitUntil: "domcontentloaded" });
      assert.equal(await page.locator(".malera-practice__glitch").count(), 0, path);
    }
  } finally {
    await browser.close();
  }
}
console.log("Malera founder cards and desktop-only binary backdrop passed in Edge and iPhone WebKit.");
