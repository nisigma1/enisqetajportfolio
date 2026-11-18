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
  assert.match(html, /<source media="\(max-width: 479px\)" srcSet="\/images\/enis\/enis-portrait-purple-compact\.webp"/i);
  assert.match(html, /--pixel-source-compact:url\([^)]*\/images\/enis\/enis-portrait-purple-compact\.webp[^)]*\)/);
  assert.match(html, /class="author-artifact__orbit" aria-hidden="true"/);
  assert.equal((html.match(/data-text-repel=""/g) ?? []).length, 1);
  assert.equal(
    (html.match(/class="pixel-canvas portfolio-pixel-field"/g) ?? []).length,
    1,
  );
  assert.match(html, /data-text-repel=""[^>]*aria-label="Enis Qetaj"/);
  assert.doesNotMatch(html, /class="visually-hidden">Enis Qetaj<\/span>/);
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(main, /I build websites and software through Malera Studio\./);
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
    ["/background", "A connected professional foundation"],
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

test("companies explains the studio and renders an accessible binary fallback without repeating the gallery", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/companies", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /What Malera builds/);
  assert.match(html, /Relationship between Enis Qetaj and Malera Studio/);
  assert.match(html, /Founder and studio/);
  assert.match(html, /Company relationship/);
  assert.match(html, /class="letter-glitch letter-glitch--deferred" aria-hidden="true"/);
  assert.doesNotMatch(html, /<canvas[^>]*class="letter-glitch__canvas"/);
  assert.match(html, /Websites/);
  assert.match(html, /AI and automation/);
  assert.match(html, /href="\/work"[^>]*>See the case studies/);
  assert.doesNotMatch(html, /malera-proof|\/projects\/(barber-brothers|hixhame-tina|besiana-photography|duo-bar)\//);
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
  assert.equal([...main.matchAll(/<img\b/g)].length, 4);
  assert.doesNotMatch(main, /project-index|class="meteors/);
  assert.match(html, /besiana-interface-1440\.webp/);
  assert.doesNotMatch(html, /besiana-artwork__phone/);
  assert.match(html, /href="\/work\/besiana-photography"/);
  assert.match(html, /href="\/work\/duo-bar"/);
  assert.match(html, /\/projects\/duo-bar\/terminal-720\.webp/);
  assert.doesNotMatch(html, /\/projects\/duo-bar\/(orders|at-the-bar)\.webp/);
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
  for (const path of ["terminal.webp", "orders.webp", "at-the-bar.webp"]) {
    assert.match(html, new RegExp(`<img[^>]+src="/projects/duo-bar/${path.replace(".", "\\.")}"`));
  }
  const visibleCaseStudy = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(visibleCaseStudy);
  assert.doesNotMatch(visibleCaseStudy, /[€£$]\s*\d+|\d+\s*(?:EUR|USD)\b/);
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
  assert.match(html, /Clear from plan to Discord\./);
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
