import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, webkit } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';

const origin = process.argv[2] ?? 'http://127.0.0.1:3089';
assert.match(origin, /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/, 'Run this audit against a local preview only.');
const output = process.argv[3] ?? 'outputs/portfolio-shift-audit';
await mkdir(output, { recursive: true });
const viewports = [[320, 568], [390, 844], [430, 932], [768, 1024], [1440, 900], [2560, 1320]];
const routes = ['/', '/work', '/work/duo-bar', '/work/barber-brothers', '/work/hixhame-tina', '/work/besiana-photography', '/background', '/companies', '/pricing', '/contact'];
const checks = [];
const issues = [];

async function open(page, path) {
  const response = await page.goto(origin + path, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200, path);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function geometry(page) {
  return page.evaluate(async () => {
    const images = [...document.querySelectorAll('main img')];
    const broken = (await Promise.all(images.map(async image => {
      image.loading = 'eager';
      try { await image.decode(); return ''; } catch { return image.currentSrc || image.src; }
    }))).filter(Boolean);
    const root = document.documentElement;
    return { broken, images: images.length, viewport: root.clientWidth, scrollWidth: root.scrollWidth, theme: root.dataset.theme };
  });
}

async function runMatrix(browser, engine) {
  const cases = viewports.flatMap(viewport => ['light', 'dark'].map(theme => ({ viewport, theme })));
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cases.length) {
      const { viewport: [width, height], theme } = cases.shift();
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, reducedMotion: 'reduce', hasTouch: width < 768 });
      await context.addInitScript(theme => localStorage.setItem('enis-theme', theme), theme);
      const page = await context.newPage();
      let exceptions = [];
      page.on('pageerror', error => exceptions.push(error.message));
      for (const path of routes) {
        exceptions = [];
        const label = { engine, width, height, theme, path };
        try {
          await open(page, path);
          const result = await geometry(page);
          checks.push({ ...label, ...result });
          assert.equal(result.theme, theme);
          assert.ok(result.scrollWidth <= result.viewport + 1, `horizontal overflow: ${result.scrollWidth} > ${result.viewport}`);
          assert.deepEqual(result.broken, [], 'failed local images');
          assert.deepEqual(exceptions, [], 'uncaught page exceptions');
          if (path === '/' && width < 768) {
            const [action, portrait] = await Promise.all([page.locator('main a[href="/work"]').first().boundingBox(), page.locator('.author-artifact').boundingBox()]);
            assert.ok(action.y + action.height <= portrait.y + 1, 'work action comes before portrait');
          }
          if (path === '/pricing' && width === 390) {
            const cards = await page.locator('main a[href^="#plan-"]').evaluateAll(items => items.map(item => item.getBoundingClientRect().bottom));
            assert.equal(cards.length, 3, 'three visible overview links');
            assert.ok(cards.every(bottom => bottom <= height), `monthly prices on first screen: ${cards}`);
          }
          if (path === '/companies') assert.equal(await page.locator('.letter-glitch__canvas').count(), 0, 'no animated binary in reduced motion');
        } catch (error) { issues.push({ ...label, error: error.message }); }
      }
      await context.close();
    }
  }));
}

async function runJourneys(browser, engine) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(8000);
  const requests = [];
  let response = { ok: false, message: 'Simulated send failure. Your message has not been sent.' };
  await page.route('**/api/contact', async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status: response.ok ? 200 : 503, json: response });
  });
  await open(page, '/');
  const work = page.getByRole('link', { name: 'View selected work', exact: true });
  await page.locator('h1').evaluate(element => { element.tabIndex = -1; element.focus(); });
  await page.keyboard.press('Tab');
  // WebKit's default system tab preference skips links. Explicitly focus the link
  // in keyboard mode there and verify that its visible focus/activation still work.
  if (engine === 'WebKit') await work.focus();
  assert.ok(await work.evaluate(element => element === document.activeElement && element.matches(':focus-visible')));
  await page.keyboard.press('Enter');
  await page.waitForURL('**/work');
  await page.locator('main a[href="/work/duo-bar"]').click();
  await page.waitForURL('**/work/duo-bar');
  await page.locator('main a[href^="/contact?service=digital-project"]').click();
  await page.waitForURL('**/contact?service=digital-project#contact-form');
  await page.waitForFunction(() => document.querySelector('[name="project"]')?.value === 'Digital Project');
  assert.equal(await page.locator('[name="paymentMethod"]').count(), 0);

  for (const [index, name, price] of [[0, 'Technical', 30], [1, 'Advanced', 60], [2, 'Complete', 100]]) {
    await open(page, '/pricing');
    await page.getByRole('link', { name: 'Request this plan', exact: true }).nth(index).click();
    await page.waitForURL(`**/contact?service=crypto-analysis&plan=${name.toLowerCase()}#contact-form`);
    await page.waitForFunction(value => document.querySelector('[name="project"]')?.value === value, `Crypto market analysis — ${name} plan (€${price} / month)`);
    const payment = page.locator('[name="paymentMethod"]');
    await payment.waitFor();
    assert.equal(await payment.evaluate(element => element.labels[0]?.firstElementChild?.textContent), 'Payment preference');
    assert.match(await page.locator('#payment-note').innerText(), /No payment is taken here/);
  }
  const request = page.getByRole('button', { name: 'Send request', exact: true });
  await request.click();
  await page.waitForFunction(() => document.activeElement?.name === 'name');
  assert.equal(requests.length, 0, 'validation blocks requests');
  await page.locator('[name="name"]').fill('Local QA');
  await page.locator('[name="email"]').fill('qa@example.com');
  await page.locator('[name="paymentMethod"]').selectOption('Discuss payment first');
  const message = 'This request exists only inside an intercepted local test.';
  await page.locator('[name="message"]').fill(message);
  await request.click();
  await page.getByRole('alert').filter({ hasText: 'Simulated send failure' }).waitFor();
  assert.equal(await page.locator('[name="message"]').inputValue(), message);
  response = { ok: true, message: 'Simulated send success. No email was sent.' };
  await request.click();
  await page.getByRole('status').filter({ hasText: 'Simulated send success' }).waitFor();
  assert.equal(await page.locator('[name="message"]').inputValue(), '');
  assert.equal(requests.length, 2);
  assert.ok(requests.every(request => request.paymentMethod === 'Discuss payment first' && request.project.includes('Complete plan')));
  checks.push({ engine, journeys: 'work → DUO → digital inquiry; all 3 plans; invalid, failure and success form states; keyboard focus' });
  await page.close();
}

async function runZoom(browser, engine) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  for (const path of ['/', '/work', '/work/duo-bar', '/work/hixhame-tina', '/pricing', '/contact']) {
    await open(page, path);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    const result = await geometry(page);
    if (result.scrollWidth > result.viewport + 1) issues.push({ engine, path, textZoom: '200%', error: `horizontal overflow: ${result.scrollWidth} > ${result.viewport}` });
    checks.push({ engine, path, textZoom: '200%', ...result });
  }
  await page.close();
}

const engines = [
  ['Chromium', chromium, { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }],
  ['WebKit', webkit, {}],
];
for (const [engine, browserType, options] of engines) {
  const browser = await browserType.launch(options);
  try {
    await runMatrix(browser, engine);
    await runZoom(browser, engine);
    try { await runJourneys(browser, engine); } catch (error) { issues.push({ engine, journey: true, error: error.stack ?? error.message }); }
  } finally {
    await browser.close();
  }
  console.log(`${engine}: ${checks.filter(check => check.engine === engine).length} checks recorded.`);
}
await writeFile(`${output}/browser-matrix.json`, JSON.stringify({ checks, issues }, null, 2));
assert.deepEqual(issues, [], 'portfolio audit failures');
