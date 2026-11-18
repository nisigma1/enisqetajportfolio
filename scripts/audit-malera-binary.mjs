import assert from 'node:assert/strict';
import { chromium, webkit, devices } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';

const origin = process.argv[2] || 'http://127.0.0.1:3089';
const desktop = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const mobile = await webkit.launch();
try {
  const page = await desktop.newPage({ viewport: { width: 1440, height: 450 }, colorScheme: 'light' });
  await page.goto(origin + '/companies#malera');
  const canvas = page.locator('#malera .letter-glitch__canvas');
  await canvas.waitFor();
  const frame = () => canvas.evaluate(el => el.toDataURL());
  const first = await frame();
  await page.waitForFunction(previous => document.querySelector('.letter-glitch__canvas').toDataURL() !== previous, first);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('#malera').getBoundingClientRect().top > innerHeight + 100);
  await page.waitForTimeout(220);
  const offscreen = await frame();
  await page.waitForTimeout(320);
  assert.equal(await frame(), offscreen, 'offscreen animation pauses');
  await page.locator('#malera').scrollIntoViewIfNeeded();
  await page.waitForFunction(previous => document.querySelector('.letter-glitch__canvas').toDataURL() !== previous, offscreen);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await canvas.waitFor({ state: 'detached' });
  assert.match(await page.locator('#malera .letter-glitch--deferred').evaluate(el => getComputedStyle(el).backgroundImage), /malera-binary\.svg/);
  for (const path of ['/', '/work', '/contact', '/pricing']) {
    await page.goto(origin + path);
    assert.equal(await page.locator('.malera-practice__glitch').count(), 0, path);
  }

  for (const [width, height] of [[430, 932], [932, 430]]) {
    const phone = await mobile.newPage({ ...devices['iPhone 15 Pro Max'], viewport: { width, height } });
    await phone.goto(origin + '/companies#malera');
    const staticDigits = phone.locator('#malera .letter-glitch--deferred');
    await staticDigits.waitFor();
    await phone.waitForLoadState('networkidle');
    assert.equal(await phone.locator('#malera canvas').count(), 0, `${width}×${height}`);
    assert.match(await staticDigits.evaluate(el => getComputedStyle(el).backgroundImage), /malera-binary\.svg/);
    assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth), width);
    await phone.close();
  }
  console.log('Malera binary: desktop animates, pauses and resumes; reduced motion and touch (portrait/landscape) stay static. Other routes do not render it.');
} finally {
  await Promise.all([desktop.close(), mobile.close()]);
}
