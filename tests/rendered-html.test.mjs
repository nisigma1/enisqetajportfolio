import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };
const publicOrigin = "https://enisqetaj.com";

function assertDuoVenuePicture(main) {
  const picture = main.match(/<picture>[^<]*<source[^>]+at-the-bar-uhd\.avif[^>]*>[\s\S]*?<\/picture>/)?.[0];
  assert.ok(picture, "visible responsive venue picture");
  assert.match(picture, /<source media="\(min-width: 1024px\)" type="image\/avif" srcSet="\/projects\/duo-bar\/at-the-bar-uhd\.avif" width="3840" height="2160"/i);
  assert.match(picture, /<source media="\(min-width: 1024px\)" type="image\/webp" srcSet="\/projects\/duo-bar\/at-the-bar-uhd\.webp" width="3840" height="2160"/i);
  assert.match(picture, /<source media="\(max-width: 719px\)" type="image\/avif" srcSet="\/projects\/duo-bar\/at-the-bar-clear-720\.avif"/i);
  assert.match(picture, /<source media="\(max-width: 719px\)" type="image\/webp" srcSet="\/projects\/duo-bar\/at-the-bar-clear-720\.webp"/i);
  assert.match(picture, /srcSet="\/projects\/duo-bar\/at-the-bar-clear-720\.webp 720w, \/projects\/duo-bar\/at-the-bar-clear-1440\.webp 1440w"/i);
  assert.match(picture, /<img[^>]+src="\/projects\/duo-bar\/at-the-bar-clear-720\.webp"/i);
  assert.match(main, /<a[^>]+href="\/projects\/duo-bar\/at-the-bar-uhd\.webp"[^>]*>View 4K photo<\/a>/);
  assert.doesNotMatch(main, /\/projects\/duo-bar\/at-the-bar\.webp/);
}

test("server-renders the complete identity homepage", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Enis Qetaj \| Crypto Markets Research, Geopolitics &amp; AI Products/);
  assert.match(
    html,
    new RegExp(`rel="canonical" href="${publicOrigin.replaceAll(".", "\\.")}/"`),
  );
  assert.match(html, /Kosovo-based crypto trader, financial-markets researcher and AI product builder/);
  assert.equal((html.match(/alt="Portrait of Enis Qetaj"/g) ?? []).length, 1);
  assert.match(html, /<source media="\(max-width: 479px\)" srcSet="\/images\/enis\/enis-portrait-purple-compact\.webp"/i);
  assert.match(html, /--pixel-source-compact:url\([^)]*\/images\/enis\/enis-portrait-purple-compact\.webp[^)]*\)/);
  assert.match(html, /class="author-artifact__orbit" aria-hidden="true"/);
  assert.match(html, /<button[^>]*class="theme-toggle"[^>]*>Switch the vibe<\/button>/);
  assert.match(html, /localStorage\.getItem\('enis-vibe'\)/);
  assert.match(html, /dataset\.vibe=/);
  assert.doesNotMatch(html, /animated-theme-toggler__icons/);
  assert.equal((html.match(/data-text-repel=""/g) ?? []).length, 1);
  assert.equal(
    (html.match(/class="pixel-canvas portfolio-pixel-field"/g) ?? []).length,
    1,
  );
  assert.match(html, /data-text-repel=""[^>]*><span class="visually-hidden">Enis Qetaj<\/span>/);
  assert.doesNotMatch(html, /data-text-repel=""[^>]*aria-label=/);
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(main, /From booking a chair to closing a tab\./);
  assert.match(main, /Through Malera Studio, I build websites, booking systems, and offline point-of-sale software for businesses\./);
  assert.match(main, /href="\/work"[^>]*>View selected work/);
  assert.match(main, /href="\/pricing"[^>]*>Crypto Analysis/);
  assert.match(main, /href="\/research"[^>]*>Read my research approach/);
  assert.match(main, /href="\/contact"[^>]*>Contact Enis/);
  assert.doesNotMatch(main, /<form\b|href="\/work\/|home-practice-tabs|dispatch-hero__proof/);
  assert.doesNotMatch(html, /Context first\. Then build\.|Portfolio index/);
  assert.match(html, /href="#app-shell"[^>]*>Back to top/);
  assert.match(html, /href="\/companies"/);
  assert.match(html, /Research/);
  assert.match(html, /Markets/);
  assert.match(html, /On-chain/);
  assert.match(html, /Malera Studio/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /click-spark__canvas/);
  assert.doesNotMatch(html, /class="meteors/);
  assert.match(html, /history\.scrollRestoration='manual'/);
  assert.match(html, /type!==&#x27;back_forward&#x27;|type!=='back_forward'/);
  assert.doesNotMatch(html, /setTimeout\(r,120\)|addEventListener\('pageshow'/);
  assert.doesNotMatch(html, /[↖↗↘↙←→↑↓]/);
  assert.doesNotMatch(html, />EQ</);
  assert.doesNotMatch(html, /Football|C:\/Users|C:%5CUsers|\.vinext\/fonts/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
  assert.doesNotMatch(html, /Context Atlas|atlas-stage|No live notes are listed yet/);

  const primaryNavigation = html.match(
    /<nav class="masthead-nav"[\s\S]*?<\/nav>/,
  )?.[0];
  assert.ok(primaryNavigation, "primary navigation is present");
  assert.equal((primaryNavigation.match(/<a\b/g) ?? []).length, 5);
  for (const label of ["Background", "Work", "Malera Studio", "Crypto Analysis", "Contact"]) {
    assert.match(primaryNavigation, new RegExp(`>${label}<`));
  }
  assert.doesNotMatch(primaryNavigation, />Research<|>Companies<|>Pricing<|>Index</);
});

test("publishes Crypto School learning without false credential claims", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/background", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Bachelor’s Degree/);
  assert.match(html, /University of Prishtina/);
  assert.match(html, /Faculty of Economics/);
  assert.match(html, /aria-label="4\+"/);
  assert.match(html, /Master’s Degree/);
  assert.match(html, /In progress/);
  assert.equal((html.match(/aria-label="2\+"/g) ?? []).length, 2);
  assert.match(html, /Crypto School/);
  assert.match(html, /Crypto Markets Curriculum/);
  assert.match(html, /Technical Analysis/);
  assert.match(html, /<div id="curriculum-active-detail"[^>]*aria-live="polite"/);
  assert.doesNotMatch(html, /<aside id="curriculum-active-detail"/);
  assert.match(html, /Fundamental Research/);
  assert.match(html, /On-Chain Analytics/);
  assert.equal([...html.matchAll(/class="curriculum-module__mobile-detail"/g)].length, 11);
  for (const moduleTitle of ["Blockchain Basics", "Bitcoin", "Ethereum", "Wallets", "Security", "Fundamental Analysis", "Technical Analysis", "Risk Management", "DeFi", "Market Narratives", "Investment Psychology"]) {
    assert.match(html, new RegExp(moduleTitle));
  }
  assert.doesNotMatch(html, /EducationalOccupationalCredential/);
});

test("redirects the legacy Malera URL to the one indexable studio page", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request(publicOrigin + "/malera"), env, ctx);
  assert.ok([301, 308].includes(response.status), "expected a permanent HTTP redirect");
  assert.equal(new URL(response.headers.get("location"), publicOrigin).pathname, "/companies");
  const destination = await worker.fetch(new Request(publicOrigin + "/companies"), env, ctx);
  assert.equal(destination.status, 200);
  assert.match(await destination.text(), /rel="canonical" href="https:\/\/enisqetaj\.com\/companies"/);
});

test("keeps missing pages out of the index without suggesting the homepage canonical", async () => {
  const worker = await getWorker();
  for (const url of ["/audit-missing-page", "/work/audit-missing-case", "/research/audit-missing-note"]) {
    const response = await worker.fetch(new Request(publicOrigin + url, { headers: { accept: "text/html" } }), env, ctx);
    assert.equal(response.status, 404, url);
    assert.match(response.headers.get("x-robots-tag") ?? "", /\bnoindex\b/i, url);
    const html = await response.text();
    assert.match(html, /<title>Page not found/i, url);
    assert.match(html, /<meta name="robots" content="noindex\b/i, url);
    assert.doesNotMatch(html, /<link[^>]+\brel="canonical"/i, url);
  }
  const head = await worker.fetch(new Request(publicOrigin + "/audit-missing-page", { method: "HEAD" }), env, ctx);
  assert.equal(head.status, 404);
  assert.match(head.headers.get("x-robots-tag") ?? "", /\bnoindex\b/i);
  assert.equal(await head.text(), "");
});

test("Barber Brothers uses the correct headings in its case study and standalone cover", async () => {
  const worker = await getWorker();
  const caseStudy = await worker.fetch(new Request(publicOrigin + "/work/barber-brothers"), env, ctx);
  const cover = await worker.fetch(new Request(publicOrigin + "/work/barber-brothers/cover"), env, ctx);
  assert.equal(caseStudy.status, 200);
  assert.equal(cover.status, 200);
  const caseHtml = await caseStudy.text();
  const coverHtml = await cover.text();
  assert.match(caseHtml, /<h2 id="barber-brothers-showcase-title"/);
  assert.match(caseHtml, /<h3 class="bb-showcase__card-title">Book Online<\/h3>/);
  assert.match(coverHtml, /<h1 id="barber-brothers-showcase-title"/);
  assert.match(coverHtml, /<h2 class="bb-showcase__card-title">Book Online<\/h2>/);
});

test("renders indexed public routes with route-specific canonicals", async () => {
  const worker = await getWorker();
  for (const [route, expected] of [
    ["/background", "Education and applied experience"],
    ["/companies", "Malera Studio"],
    ["/pricing", "Monthly research plans"],
    ["/about", "About Enis Qetaj"],
    ["/research", "Research by Enis Qetaj"],
    ["/markets", "Crypto markets, macro"],
    ["/work", "Selected work"],
    ["/build", "AI products, websites and automation"],
    ["/contact", "Send a message"],
  ]) {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
      env,
      ctx,
    );
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, new RegExp(expected), route);
    assert.match(
      html,
      new RegExp(
        `rel="canonical" href="${publicOrigin.replaceAll(".", "\\.")}${route}"`,
      ),
      route,
    );
    assert.match(html, /class="masthead"/, `${route} uses the shared masthead`);
    assert.match(html, /class="site-footer"/, `${route} uses the shared footer`);
    assert.match(html, /application\/ld\+json/, `${route} publishes structured data`);
  }
});

test("companies leads with real studio work and a compact, static founder note", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/companies", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(main, /<h1>Malera Studio<\/h1>/);
  assert.match(main, /Online booking\. Offline POS\./);
  assert.match(main, /href="\/contact\?service=digital-project#contact-form"[^>]*>Discuss a project/);
  assert.match(main, /href="#build"[^>]*>Explore services/);
  assert.equal(main.match(/<img\b/g)?.length, 2, "brand mark and one real project photograph");
  assert.match(main, /\/images\/education\/malera-studio-logo\.webp/);
  assert.match(main, /\/projects\/duo-bar\/malera-pos-at-duo-720\.avif/);
  assert.match(html, /What Malera builds/);
  assert.match(html, /Founder and studio/);
  assert.match(main, /<h2 id="companies-malera-title">Enis Qetaj<\/h2>/);
  assert.match(main, /My crypto market research is separate from the studio/);
  assert.match(main, /data-studio-binary="true" aria-hidden="true"/);
  assert.doesNotMatch(main, /<canvas|malera-practice__bridge|Company relationship/);
  assert.match(main, /href="https:\/\/malera\.studio\/"[^>]*>Visit malera\.studio/);
  assert.match(html, /Websites/);
  assert.match(html, /AI and automation/);
  assert.match(html, /href="\/work"[^>]*>See the case studies/);
  assert.match(html, /href="\/work\/barber-brothers"[^>]*>Barber Brothers(?:<!-- -->)? case study/);
  assert.match(html, /href="\/work\/duo-bar"[^>]*>DUO Bar(?:<!-- -->)? case study/);
  assert.doesNotMatch(main, /\/projects\/(barber-brothers|hixhame-tina|besiana-photography)\//);
});

test("work keeps all four real project proofs on the dedicated work route", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/work", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  for (const [title, slug] of [["Barber Brothers", "barber-brothers"], ["Hixhame Tina", "hixhame-tina"], ["Besiana Photography", "besiana-photography"], ["DUO Bar", "duo-bar"]]) {
    assert.equal([...main.matchAll(new RegExp(`<h2 id="${slug}-title">${title}<\\/h2>`, "g"))].length, 1, title);
    assert.equal([...main.matchAll(new RegExp(`href="/work/${slug}"`, "g"))].length, 1, slug);
    assert.match(main, new RegExp(`id="${slug}"`));
  }
  assert.equal([...main.matchAll(/<img\b/g)].length, 4, "one authentic cover per project");
  assert.doesNotMatch(main, /project-index|class="meteors/);
  assert.match(html, /besiana-interface-1440\.webp/);
  assert.doesNotMatch(html, /besiana-artwork__phone/);
  assert.match(html, /href="\/work\/besiana-photography"/);
  assert.match(html, /href="\/work\/duo-bar"/);
  assert.match(main, /View DUO Bar case study/);
  assert.match(main, /<source type="image\/avif" srcSet="\/projects\/duo-bar\/malera-pos-at-duo-720\.avif 720w,[^"]+malera-pos-at-duo-3024\.avif 3024w"/i);
  assert.match(main, /<img[^>]+src="\/projects\/duo-bar\/malera-pos-at-duo-1440\.webp"[^>]*width="3024" height="2184" alt="Malera POS on the DUO Bar terminal/);
  assert.doesNotMatch(main, /View 4K photo|Malera POS on the counter at DUO Bar|\/projects\/duo-bar\/(?:at-the-bar|terminal|orders)[^"]*\.webp/);
});

test("publishes the single DUO cover and official Malera logo in optimized formats", async () => {
  const entries = [["images/education/malera-studio-logo.webp", 20_000]];
  for (const [width, avif, webp] of [[720, 45_000, 55_000], [1440, 105_000, 145_000], [2160, 190_000, 270_000], [3024, 370_000, 480_000]]) {
    entries.push(["projects/duo-bar/malera-pos-at-duo-" + width + ".avif", avif]);
    entries.push(["projects/duo-bar/malera-pos-at-duo-" + width + ".webp", webp]);
  }
  for (const [path, max] of entries) {
    const { size } = await stat(new URL("../dist/" + path, import.meta.url));
    assert.ok(size > 0 && size <= max, path + ": " + size + " bytes (budget " + max + ")");
  }
});

test("Background identifies Malera Studio as professional experience, not a qualification", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request(publicOrigin + "/background"), env, ctx);
  assert.equal(response.status, 200);
  const html = await response.text();
  const row = html.match(/<li id="malera-studio-experience"[\s\S]*?<\/ul>[\s\S]*?<\/li>/)?.[0];
  assert.ok(row);
  for (const detail of ["Malera Studio", "Professional experience", "Founder", "Apps", "Websites", "Workflow automation", "AI agents"]) {
    assert.ok(row.includes(detail), detail);
  }
  assert.match(row, /<img[^>]+src="\/images\/education\/malera-studio-logo\.webp"[^>]+alt="Malera Studio logo"/);
  assert.match(row, /href="\/companies"/);
  assert.doesNotMatch(row, /\byears\b|degree|certificate|journey-field__status/i);
});

test("DUO Bar publishes the offline POS workflow and three venue photos without pricing", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request(`${publicOrigin}/work/duo-bar`), env, ctx);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1>DUO Bar<\/h1>/);
  assert.match(html, /rel="canonical" href="https:\/\/enisqetaj\.com\/work\/duo-bar"/);
  for (const detail of ["monthly subscription", "visual floor plan", "Coffee stock is deducted automatically", "PINs", "sales, expenses and profit", "SQLite", "GitHub"]) {
    assert.ok(html.includes(detail), detail);
  }
  for (const path of ["terminal.webp", "orders.webp"]) {
    assert.match(html, new RegExp(`<img[^>]+src="/projects/duo-bar/${path.replace(".", "\\.")}"`));
  }
  const visibleCaseStudy = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(visibleCaseStudy);
  assertDuoVenuePicture(visibleCaseStudy);
  assert.equal([...visibleCaseStudy.matchAll(/<img\b/g)].length, 3, "only the three authentic story photos");
  for (const step of ["A shift at DUO Bar", "Select a table", "Add to the order", "Close the bill", "Application development"]) {
    assert.ok(visibleCaseStudy.includes(step), step);
  }
  assert.match(visibleCaseStudy, /separate examples/);
  assert.doesNotMatch(visibleCaseStudy, /<video\b|<iframe\b/);
  assert.doesNotMatch(visibleCaseStudy, /[€£$]\s*\d+|\d+\s*(?:EUR|USD)\b/);
});

test("DUO Bar packages both UHD files within the image transfer budget", async () => {
  for (const [format, budget] of [["avif", 200_000], ["webp", 350_000]]) {
    const asset = new URL(`../dist/projects/duo-bar/at-the-bar-uhd.${format}`, import.meta.url);
    const { size } = await stat(asset);
    assert.ok(size > 0 && size <= budget, `${format}: ${size} bytes (budget ${budget})`);
  }
});

test("publishes project metadata and correct intrinsic media dimensions", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/work/barber-brothers", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Barber Brothers Case Study \| Enis Qetaj/);
  assert.match(
    html,
    new RegExp(
      `rel="canonical" href="${publicOrigin.replaceAll(".", "\\.")}/work/barber-brothers"`,
    ),
  );
  assert.match(html, /projects\/barber-brothers\/barber-brothers-og\.webp/);
  assert.match(html, /width="1440" height="900"/);
  assert.match(html, /width="840" height="1200"/);
  assert.match(html, /width="1136" height="486"/);
  assert.match(html, /width="576" height="710"/);
});

test("publishes the complete responsive Hixhame Tina case study", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/work/hixhame-tina", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Hixhame Tina Case Study \| Enis Qetaj/);
  assert.match(
    html,
    new RegExp(
      `rel="canonical" href="${publicOrigin.replaceAll(".", "\\.")}/work/hixhame-tina"`,
    ),
  );
  assert.match(html, /projects\/hixhame-tina\/hixhame-tina-case-study\.avif/);
  assert.match(html, /projects\/hixhame-tina\/hixhame-tina-case-study\.webp/);
  assert.match(html, /width="1672" height="941"/);
  assert.match(html, /Understand\. Build trust\. Book directly\./);
  assert.match(html, /Albanian/);
  assert.match(html, /Italian/);
  assert.match(html, /https:\/\/hixhametina\.com\//);
  assert.match(html, /application\/ld\+json/);
});

test("publishes the research framework without inventing research notes", async () => {
  const worker = await getWorker();
  const research = await worker.fetch(
    new Request("http://localhost/research", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(research.status, 200);
  const researchHtml = await research.text();
  assert.match(researchHtml, /name="robots" content="index, follow"/);
  assert.match(researchHtml, /Evidence before narrative/);
  assert.match(researchHtml, /Research and educational content only/);
  assert.doesNotMatch(researchHtml, /No live notes are listed yet/);

  const sitemap = await worker.fetch(
    new Request("http://localhost/sitemap.xml"),
    env,
    ctx,
  );
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /\/research/);
  assert.match(xml, /\/background/);
  assert.match(xml, /\/companies/);
  assert.match(xml, /\/pricing/);
  assert.match(xml, /\/markets/);
  assert.match(xml, /\/build/);
  assert.match(xml, /\/about/);
  assert.match(xml, /\/work\/barber-brothers/);
  assert.match(xml, /\/work\/hixhame-tina/);
});

test("publishes three factual monthly pricing plans and request links", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request("http://localhost/pricing", { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const [name, price, plan] of [["Technical", "30", "technical"], ["Advanced", "60", "advanced"], ["Complete", "100", "complete"]]) {
    assert.match(html, new RegExp(name));
    assert.match(html, new RegExp(`€(?:<!-- -->)?${price}`));
    assert.match(html, new RegExp(`href="/contact\\?service=crypto-analysis&amp;plan=${plan}#contact-form"`));
  }
  assert.match(html, /Research assistance helps you understand the analysis/);
  assert.match(html, /From request to Discord/);
  assert.match(html, /Monthly plan overview/);
  assert.equal((html.match(/>Request this plan</g) ?? []).length, 3);
  assert.match(html, /Bitcoin MVRV market context/);
  assert.match(html, /href="https:\/\/x\.com\/N1sigma"[^>]*>View NISIGMA’s profile on X/);
  assert.match(html, /bank transfer \(Raiffeisen\) or crypto payment/i);
  assert.match(html, /Once payment is confirmed, Enis shares the Discord invite by email\./);
  assert.match(html, /1 live research session per week/);
  assert.match(html, /2 live research sessions per week/);
  assert.match(html, /Market research and educational analysis only/);
  assert.doesNotMatch(html, /guaranteed|risk-free|best value|most popular|most selected/i);
});

test("contact renders one compact form and direct contact links without unrelated payment fields", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/contact?service=crypto-analysis&plan=advanced", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Send a message/);
  assert.equal([...html.matchAll(/<form\b/g)].length, 1);
  assert.match(html, /id="contact-form"/);
  assert.match(html, /name="project"/);
  assert.doesNotMatch(html, /name="paymentMethod"/);
  assert.match(html, /Advanced \(€60\/month\)/);
  assert.match(html, /href="mailto:enisqeta5@gmail\.com"/);
  assert.match(html, /href="tel:\+38344857227"/);
  assert.match(html, /href="https:\/\/malera\.studio\/?"/);
});

test("contact endpoint validates input and delivers email through Resend", async () => {
  const previousApiKey = process.env.RESEND_API_KEY;
  const originalFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = "re_test_key";
  const resendRequests = [];
  globalThis.fetch = async (input, init) => {
    resendRequests.push({ input, init });
    return new Response(JSON.stringify({ id: "email_test" }), { status: 200 });
  };
  const worker = await getWorker();
  try {
    const message = "A sufficiently detailed project description for validation.";
    const send = payload => worker.fetch(new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Test User", email: "test@example.com", message, ...payload }),
    }), env, ctx);
    const valid = await send({ project: "Digital Project" });
    assert.equal(valid.status, 200);
    assert.equal((await valid.json()).ok, true);
    assert.equal(resendRequests[0].input, "https://api.resend.com/emails");
    assert.equal(resendRequests[0].init.headers.Authorization, "Bearer re_test_key");
    assert.deepEqual(JSON.parse(resendRequests[0].init.body), {
      from: "Enis Qetaj Website <website@enisqetaj.com>",
      to: ["enisqeta5@gmail.com"],
      reply_to: "test@example.com",
      subject: "[Website] Digital Project — Test User",
      text: `Name: Test User\nEmail: test@example.com\nWorking on: Digital Project\n\n${message}`,
    });
    const project = "Crypto market analysis — Advanced plan (€60 / month)";
    for (const paymentMethod of [undefined, "Not a payment method"]) {
      const invalidPayment = await send({ project, paymentMethod });
      assert.equal(invalidPayment.status, 422);
      assert.match((await invalidPayment.json()).errors.paymentMethod, /Choose/);
    }
    assert.equal(resendRequests.length, 1, "invalid requests never reach Resend");
    for (const paymentMethod of ["Bank transfer (Raiffeisen)", "Crypto payment", "Discuss payment first"]) {
      assert.equal((await send({ project, paymentMethod })).status, 200);
      assert.ok(JSON.parse(resendRequests.at(-1).init.body).text.includes(`Payment method: ${paymentMethod}\n`));
    }
    assert.equal((await send({ project: "Other Inquiry", paymentMethod: "Crypto payment" })).status, 200);
    assert.doesNotMatch(JSON.parse(resendRequests.at(-1).init.body).text, /Payment method:/);

    const invalid = await worker.fetch(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "X",
          email: "bad",
          project: "No",
          message: "short",
        }),
      }),
      env,
      ctx,
    );
    assert.equal(invalid.status, 422);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousApiKey;
  }
});
