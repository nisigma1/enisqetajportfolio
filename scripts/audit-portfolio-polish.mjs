import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, webkit } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';

const [phase = 'after', origin = 'http://127.0.0.1:3089', engine = 'chromium'] = process.argv.slice(2);
const directory = `outputs/portfolio-polish/${phase}-${engine}`;
const routes = [['home', '/'], ['work', '/work'], ['malera', '/companies'], ['contact', '/contact']];
const sizes = phase === 'before' ? [[390, 844], [430, 932], [1440, 900]] : [[320, 568], [390, 844], [430, 932], [768, 1024], [1440, 900]];
const jobs = sizes.flatMap(([width, height]) => ['light', 'dark'].map(theme => ({ width, height, theme })));
const results = [];
await mkdir(directory, { recursive: true });
const browser = engine === 'webkit' ? await webkit.launch() : await chromium.launch({
  executablePath: process.env.PORTFOLIO_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

async function worker() {
  for (let job; (job = jobs.shift());) {
    const { width, height, theme } = job;
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, hasTouch: width < 768 });
    await context.addInitScript(value => localStorage.setItem('enis-theme', value), theme);
    for (const [name, path] of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const response = await page.goto(origin + path, { waitUntil: 'load', timeout: 45_000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
        const root = document.scrollingElement;
        for (let y = 0; y < root.scrollHeight; y += 650) {
          scrollTo({ top: y, behavior: 'instant' });
          await new Promise(resolve => setTimeout(resolve, 28));
        }
        scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.locator('.site-footer').waitFor({state:'attached'});
      const measurements = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        theme: document.documentElement.dataset.theme,
        headings: [...document.querySelectorAll('main h1, main h2')].map(el => ({
          text: el.textContent.trim(), px: Number.parseFloat(getComputedStyle(el).fontSize),
        })),
        forms: document.forms.length,
        brokenImages: [...document.querySelectorAll('main img')].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')),
        transferredJS: performance.getEntriesByType('resource').filter(r => /\.m?js(?:\?|$)/.test(r.name)).reduce((sum, r) => sum + r.transferSize, 0),
      }));
      if (engine === 'chromium' && [390, 430, 1440].includes(width)) {
        const filename = `${width}-${theme}-${name}`;
        await page.screenshot({ path: `${directory}/${filename}.png`, fullPage: true, animations: 'disabled', timeout: 25_000 });
        if (name === 'malera') await page.locator('#malera').screenshot({ path: `${directory}/${filename}-binary.png`, animations: 'disabled', style: '.masthead, .skip-link { visibility: hidden !important; }', timeout: 25_000 });
        if (name === 'home') await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        if (name === 'home') await page.screenshot({ path: `${directory}/${filename}-first-view.png`, animations: 'disabled', timeout: 25_000 });
      }
      results.push({ name, width, height, theme, status: response?.status(), errors, ...measurements });
      await page.close();
    }
    await context.close();
    console.log(`${phase} ${engine}: ${width} ${theme} captured`);
  }
}

try {
  await Promise.all([worker(), worker()]);
  await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2));
  if (phase !== 'before') {
    for (const { name, width, scrollWidth, theme, status, errors, forms, brokenImages } of results) {
      const label = `${engine} ${name} ${width} ${theme}`;
      assert.equal(status, 200, label);
      assert.equal(scrollWidth, width, `horizontal overflow: ${label}`);
      assert.deepEqual(errors, [], label);
      assert.deepEqual(brokenImages, [], label);
      assert.equal(forms, name === 'contact' ? 1 : 0, label);
    }
  }
  console.log(`${results.length} page checks recorded in ${directory}`);
} finally {
  await browser.close();
}
