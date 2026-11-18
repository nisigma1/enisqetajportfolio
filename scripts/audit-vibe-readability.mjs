import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, webkit } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';

const origin = process.argv[2] ?? 'http://127.0.0.1:3089';
assert.match(origin, /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/, 'Use a local preview. The audit exercises form error states.');
const output = process.argv[3] ?? 'outputs/vibe-readability/after';
await mkdir(output, { recursive: true });
const vibes = ['paper', 'mint', 'amber', 'lime', 'lilac', 'peach', 'slate', 'night'];
const routes = ['/', '/background', '/work', '/work/duo-bar', '/work/barber-brothers', '/work/hixhame-tina', '/work/besiana-photography', '/pricing', '/companies', '/contact', '/about', '/build', '/markets', '/research'];
const results = [];
const issues = [];
const checks = {
  '/background': [ ['.curriculum-module__number', 13], ['.curriculum-module__track', 13], ['.curriculum-detail__identity span', 13], ['.curriculum-detail > div:not(.curriculum-detail__identity) > p', 13], ['.curriculum-module__mobile-detail > div > p', 13] ],
  '/pricing': [ ['.analysis-plan__scope li', 16], ['.analysis-plan__layers li', 15], ['.research-note__meta', 15], ['.research-note__intro > p', 14], ['.analysis-plan > .button', 13] ],
};

// Canvas converts CSS color(), rgb(), and partially transparent computed colors
// to one sRGB pixel, composited over the actual ancestor backgrounds.
async function measure(page, rules) {
  return page.evaluate(rules => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const luminance = color => {
      const [r, g, b] = [...color].slice(0, 3).map(c => c / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      return r * 0.2126 + g * 0.7152 + b * 0.0722;
    };
    const paint = color => { ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); };
    const rows = [];
    for (const [selector, minimumSize, property = 'color'] of rules) {
      const visible = [...document.querySelectorAll(selector)].filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
      for (const element of visible) {
        const styles = getComputedStyle(element);
        const stack = [];
        for (let node = element; node; node = node.parentElement) stack.unshift(getComputedStyle(node));
        ctx.clearRect(0, 0, 1, 1);
        paint('#fff');
        stack.forEach(style => paint(style.backgroundColor));
        const background = luminance(ctx.getImageData(0, 0, 1, 1).data);
        paint(styles[property]);
        const text = luminance(ctx.getImageData(0, 0, 1, 1).data);
        const ratio = (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05);
        rows.push({ selector, property, size: parseFloat(styles.fontSize), minimumSize, ratio, text: element.textContent?.trim().slice(0, 70), imageLayers: stack.filter(style => style.backgroundImage !== 'none').length });
      }
    }
    return rows;
  }, rules);
}

function checkMeasures(rows, context) {
  for (const row of rows) {
    const minimum = row.property === 'borderBottomColor' ? 3 : 4.5;
    if (row.ratio < minimum || row.size < row.minimumSize) issues.push({ ...context, ...row, message: `Expected contrast ≥${minimum} and ${row.minimumSize}px minimum` });
  }
}

async function open(page, path) {
  const response = await page.goto(origin + path, { waitUntil: 'load', timeout: 20000 });
  assert.equal(response.status(), 200, path);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function staticAudit(browser, engine, viewport) {
  const queue = [...vibes];
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const vibe = queue.shift();
      const context = await browser.newContext({ viewport, hasTouch: viewport.width < 768, reducedMotion: 'reduce' });
      await context.addInitScript(vibe => localStorage.setItem('enis-vibe', vibe), vibe);
      const page = await context.newPage();
      for (const path of routes) {
        const tag = { engine, width: viewport.width, vibe, path };
        try {
          await open(page, path);
          await page.addStyleTag({ content: '.site-section { content-visibility: visible !important; }' });
          assert.equal(await page.locator('html').getAttribute('data-vibe'), vibe);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), 'Horizontal overflow');
          // Load axe into each newly navigated document so it cannot reuse styles from another palette.
          await page.addScriptTag({ path: '.tmp/audit-tools/node_modules/axe-core/axe.min.js' });
          const contrast = await page.evaluate(async () => {
            const axeResult = await axe.run({ include: [['main'], ['.masthead'], ['.site-footer']] }, { runOnly: ['color-contrast'] });
            return {
              failures: axeResult.violations.flatMap(rule => rule.nodes.map(node => ({ target: node.target, summary: node.failureSummary?.split('\n').at(-1) }))),
              manual: axeResult.incomplete.flatMap(rule => rule.nodes.map(node => node.target)),
            };
          });
          for (const item of contrast.failures) issues.push({ ...tag, ...item });
          let readings = checks[path] ? await measure(page, checks[path]) : [];
          if (path === '/pricing' && viewport.width === 390) {
            const bottom = await page.locator('.analysis-plan-overview').evaluate(element => element.getBoundingClientRect().bottom);
            assert.ok(bottom < viewport.height, `Plan prices below first fold: ${bottom}`);
          }
          if (path === '/background' && viewport.width < 768 && ['mint', 'slate'].includes(vibe)) {
            const modules = page.locator('.curriculum-module > button');
            assert.equal(await modules.count(), 11);
            for (const module of await modules.all()) {
              await module.click();
              // Re-clicking the already selected mobile module may collapse it.
              if (await module.getAttribute('aria-expanded') !== 'true') await module.click();
              assert.equal(await module.getAttribute('aria-expanded'), 'true');
              readings = readings.concat(await measure(page, [['.curriculum-module__mobile-detail > div > p', 13]]));
            }
          }
          if (path === '/contact') {
            await page.waitForLoadState('networkidle');
            let networkAttempts = 0;
            await page.route('**/api/contact', route => { networkAttempts++; return route.abort(); });
            await page.getByRole('button', { name: 'Send email', exact: true }).click();
            await page.locator('.field-error').first().waitFor();
            assert.equal(networkAttempts, 0, 'Empty form should not transmit');
            readings = readings.concat(await measure(page, [['.field-error', 14], ['.contact-form [aria-invalid="true"]', 16, 'borderBottomColor']]));
            await page.unroute('**/api/contact');
          }
          checkMeasures(readings, tag);
          if (vibe === 'mint' && checks[path]) {
            const section = path === '/background' ? '#crypto-curriculum' : '.analysis-plan-overview';
            await page.locator(section).scrollIntoViewIfNeeded();
            await page.screenshot({ path: `${output}/${path.slice(1)}-mint-${viewport.width}.png`, scale: 'css' });
            if (path === '/pricing') {
              await page.locator('.research-note--featured').scrollIntoViewIfNeeded();
              await page.screenshot({ path: `${output}/research-mint-${viewport.width}.png`, scale: 'css' });
            }
          }
          results.push({ ...tag, scanned: true, unresolved: contrast.manual, readings });
        } catch (error) { issues.push({ ...tag, message: error.message }); }
      }
      await context.close();
    }
  }));
}

async function animationAudit(browser, engine, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: 'no-preference', colorScheme: 'light', hasTouch: viewport.width < 768 });
  const page = await context.newPage();
  try {
    await open(page, '/');
    const control = page.locator('.masthead .theme-toggle');
    for (const next of [...vibes.slice(1), 'paper']) {
      await control.click();
      const snapshot = await page.waitForFunction(() => {
        const a = document.getAnimations().find(animation => animation.animationName === 'vibe-reveal');
        if (!a || !a.effect) return false;
        a.pause();
        a.currentTime = Number(a.effect.getTiming().duration) / 2;
        return { duration: a.effect.getTiming().duration };
      });
      assert.deepEqual(await snapshot.jsonValue(), { duration: 420 });
      const mid = await page.evaluate(() => {
        const root = document.documentElement;
        const next = getComputedStyle(root, '::view-transition-new(root)');
        const old = getComputedStyle(root, '::view-transition-old(root)');
        return { clip: next.clipPath, old: old.opacity, next: next.opacity };
      });
      assert.equal(mid.old, '1');
      assert.equal(mid.next, '1');
      // Some WebKit builds omit clipPath from pseudo-element computed style;
      // the opaque keyframe is still verified by the animation above.
      if (engine === 'Chromium') assert.match(mid.clip, /^inset\(/);
      if (next === 'slate') await page.screenshot({ path: `${output}/peach-to-slate-${viewport.width}.png`, scale: 'css' });
      await page.evaluate(() => document.getAnimations().find(animation => animation.animationName === 'vibe-reveal')?.finish());
      await page.waitForFunction(next => document.documentElement.dataset.vibe === next && !document.documentElement.dataset.vibeTransition, next);
      results.push({ engine, width: viewport.width, vibe: next, transition: mid });
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const path of ['/background', '/pricing']) {
      for (const vibe of ['mint', 'slate']) {
        await page.evaluate(vibe => localStorage.setItem('enis-vibe', vibe), vibe);
        await open(page, path);
        await page.addStyleTag({ content: 'html { font-size: 200%; } .site-section { content-visibility: visible !important; }' });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${path} ${vibe} at 200%: horizontal overflow`);
        const clipped = await page.evaluate(() => [...document.querySelectorAll('.masthead-nav, .knowledge-spine__progression li, .curriculum-track, .curriculum-module, .analysis-plan, .research-note__intro')].filter(element => element.getClientRects().length && element.scrollWidth > element.clientWidth + 1).map(element => element.className || element.tagName));
        assert.deepEqual(clipped, [], `${path} ${vibe} at 200%: text clipped inside its section`);
        results.push({ engine, width: 1280, vibe, path, textZoom: '200%' });
      }
    }
  } catch (error) { issues.push({ engine, width: viewport.width, animationOrZoom: true, message: error.message }); }
  finally { await context.close(); }
}

for (const [engine, launcher, options, viewport] of [
  ['Chromium', chromium, process.platform === 'win32' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {}, { width: 1440, height: 900 }],
  ['WebKit', webkit, {}, { width: 390, height: 844 }],
]) {
  const browser = await launcher.launch(options);
  try {
    await staticAudit(browser, engine, viewport);
    await animationAudit(browser, engine, viewport);
  } finally { await browser.close(); }
  console.log(`${engine}: ${results.filter(result => result.engine === engine).length} checks recorded`);
}
await writeFile(`${output}/report.json`, JSON.stringify({ results, issues }, null, 2));
if (issues.length) {
  console.error(JSON.stringify(issues.slice(0, 25), null, 2));
  throw new Error(`${issues.length} checks need investigation (see report.json).`);
}
