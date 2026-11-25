import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('public pages bypass Functions and retain HTML plus client navigation payloads', async () => {
  const routes = JSON.parse(await readFile('dist/_routes.json', 'utf8'));
  assert.deepEqual(routes.include, ['/api/*']);
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const route = new URL(match[1]).pathname;
    const html = await readFile(`dist/${route === '/' ? 'index.html' : route.slice(1) + '/index.html'}`, 'utf8');
    assert.match(html, /<main\b/);
    assert.match(html, /<\/html>/);
    const rsc = await readFile(`dist/${route === '/' ? 'index.rsc' : route.slice(1) + '.rsc'}`, 'utf8');
    assert.ok(rsc.length > 1000, route);
  }
  assert.match(await readFile('dist/_redirects', 'utf8'), /\/malera \/companies 308/);
  assert.match(await readFile('dist/_headers', 'utf8'), /Content-Type: text\/x-component/);
  assert.match(await readFile('dist/404.html', 'utf8'), /noindex/);
});
