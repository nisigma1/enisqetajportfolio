import assert from "node:assert/strict";
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
  assert.equal((html.match(/alt="Enis Qetaj, financial-markets researcher and AI product builder from Kosovo"/g) ?? []).length, 1);
  assert.equal((html.match(/data-text-repel=""/g) ?? []).length, 1);
  assert.equal(
    (html.match(/class="pixel-canvas portfolio-pixel-field"/g) ?? []).length,
    1,
  );
  assert.match(html, /data-text-repel=""[^>]*aria-label="Enis Qetaj"/);
  assert.doesNotMatch(html, /class="visually-hidden">Enis Qetaj<\/span>/);
  assert.match(html, /<ol class="dispatch-hero__proof" aria-label="Core professional focus">/);
  assert.match(html, /Marketing \/ Finance \/ Crypto/);
  assert.match(html, /Crypto market analysis from €30 \/ month/);
  assert.match(html, /href="\/background"/);
  assert.match(html, /href="\/pricing"/);
  assert.match(html, /href="\/companies"/);
  assert.match(html, /Research/);
  assert.match(html, /Markets/);
  assert.match(html, /On-chain/);
  assert.match(html, /Research and Analysis/);
  assert.match(html, /Macroeconomics and Geopolitics/);
  assert.match(html, /Malera Studio/);
  assert.match(html, /\+383 44 857 227/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /action-mark/);
  assert.match(html, /click-spark__canvas/);
  assert.match(html, /history\.scrollRestoration='manual'/);
  assert.match(html, /addEventListener\('pageshow'/);
  assert.match(html, /if\(!location\.hash\)scrollTo\(0,0\)/);
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
  for (const label of ["Background", "Work", "Companies", "Pricing", "Contact"]) {
    assert.match(primaryNavigation, new RegExp(`>${label}<`));
  }
  assert.doesNotMatch(primaryNavigation, />Research<|>Malera<|>Index</);
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
  assert.match(html, /4\+ years/);
  assert.match(html, /Master’s Degree/);
  assert.match(html, /In progress/);
  assert.match(html, /Crypto School/);
  assert.match(html, /Crypto Markets Curriculum/);
  assert.match(html, /Technical Analysis/);
  assert.match(html, /Fundamental Research/);
  assert.match(html, /On-Chain Analytics/);
  assert.equal([...html.matchAll(/class="curriculum-module__mobile-detail"/g)].length, 11);
  for (const moduleTitle of ["Blockchain Basics", "Bitcoin", "Ethereum", "Wallets", "Security", "Fundamental Analysis", "Technical Analysis", "Risk Management", "DeFi", "Market Narratives", "Investment Psychology"]) {
    assert.match(html, new RegExp(moduleTitle));
  }
  assert.doesNotMatch(html, /EducationalOccupationalCredential/);
});

test("renders indexed public routes with route-specific canonicals", async () => {
  const worker = await getWorker();
  for (const [route, expected] of [
    ["/background", "Three fields. One analytical practice"],
    ["/companies", "Malera Studio"],
    ["/pricing", "Crypto market analysis"],
    ["/about", "About Enis Qetaj"],
    ["/research", "Research by Enis Qetaj"],
    ["/markets", "Crypto markets, macro"],
    ["/work", "Real work"],
    ["/build", "AI products, websites and automation"],
    ["/contact", "Contact Enis Qetaj"],
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

test("companies restores the building method and Malera relationship chapters", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/companies", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Start with the need\. Find the useful form\./);
  assert.match(html, /Relationship between Enis Qetaj and Malera Studio/);
  assert.match(html, /When the problem needs a wider practice\./);
  assert.match(html, /03 \/ Building method/);
  assert.match(html, /04 \/ Company relationship/);
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
    assert.match(html, new RegExp(`href="/contact\\?plan=${plan}"`));
  }
  assert.match(html, /Market research and educational analysis only/);
  assert.doesNotMatch(html, /guaranteed|risk-free|best value|most popular/i);
});

test("contact endpoint validates input and returns a mail fallback", async () => {
  const worker = await getWorker();
  const valid = await worker.fetch(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        project: "A booking website",
        message: "A sufficiently detailed project description for validation.",
        website: "",
      }),
    }),
    env,
    ctx,
  );
  assert.equal(valid.status, 200);
  assert.match((await valid.json()).mailto, /^https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=enisqeta5%40gmail\.com/);

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
});
