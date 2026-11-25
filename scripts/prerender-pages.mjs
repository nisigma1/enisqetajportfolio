import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

// Public portfolio pages contain no request-specific data. Generate their HTML
// and complete RSC trees at build time, so browsing never needs a Function.
export async function prerenderPages(directory) {
  const worker = (await import(pathToFileURL(resolve(directory, 'index.js')).href)).default;
  const origin = 'https://enisqetaj.com';
  const sitemap = await readFile(resolve(directory, 'sitemap.xml'), 'utf8');
  const routes = [...new Set([
    ...[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname),
    '/malera', '/work/barber-brothers/cover',
  ])];
  const redirects = ['/.rsc /index.rsc 200'];
  let headers = await readFile(resolve(directory, '_headers'), 'utf8');
  const env = { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  for (const route of routes) {
    const response = await worker.fetch(new Request(origin + route, { headers: { accept: 'text/html' } }), env, ctx);
    if (response.status >= 300 && response.status < 400) {
      const destination = new URL(response.headers.get('location'), origin);
      if (destination.origin !== origin) throw new Error(`Unexpected external redirect: ${route}`);
      redirects.push(`${route} ${destination.pathname}${destination.search} ${response.status}`);
      continue;
    }
    if (response.status !== 200) throw new Error(`Prerender ${route}: ${response.status}`);
    const html = await response.text();
    if (!html.includes('</html>')) throw new Error(`Incomplete HTML: ${route}`);
    const htmlPath = resolve(directory, route === '/' ? 'index.html' : `.${route}/index.html`);
    await mkdir(dirname(htmlPath), { recursive: true });
    await writeFile(htmlPath, html);
    const rscRoute = route === '/' ? '/index.rsc' : `${route}.rsc`;
    const rsc = await worker.fetch(new Request(origin + (route === '/' ? '/.rsc' : `${route}.rsc`)), env, ctx);
    if (rsc.status !== 200 || !rsc.headers.get('content-type')?.startsWith('text/x-component')) {
      throw new Error(`Invalid RSC snapshot: ${route}`);
    }
    await writeFile(resolve(directory, `.${rscRoute}`), await rsc.text());
    headers += `\n${rscRoute}\n  Content-Type: text/x-component; charset=utf-8\n  Cache-Control: public, max-age=0, must-revalidate\n`;
    console.log(`Prerendered ${route}`);
  }
  const missing = await worker.fetch(new Request(origin + '/__prerender_missing__', { headers: { accept: 'text/html' } }), env, ctx);
  if (missing.status !== 404) throw new Error('Missing page must return 404');
  await writeFile(resolve(directory, '404.html'), await missing.text());
  await writeFile(resolve(directory, '_redirects'), redirects.join('\n') + '\n');
  await writeFile(resolve(directory, '_headers'), headers);
}
