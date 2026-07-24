import assert from "node:assert/strict";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };
const publicOrigin = "https://enis-qetaj-signal.enis-qetaj.chatgpt.site";

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
  assert.match(html, /Markets, Research, Geopolitics &amp; Digital Products — Enis Qetaj/);
  assert.match(
    html,
    new RegExp(`rel="canonical" href="${publicOrigin.replaceAll(".", "\\.")}/"`),
  );
  assert.match(html, /I research what moves markets/);
  assert.equal((html.match(/alt="Portrait of Enis Qetaj"/g) ?? []).length, 1);
  assert.match(html, /Barber Brothers/);
  assert.match(html, /A signal is only the beginning/);
  assert.match(html, /Evidence Ladder/);
  assert.match(html, /Signal/);
  assert.match(html, /Context/);
  assert.match(html, /Decision/);
  assert.match(html, /href="\/markets"/);
  assert.match(html, /On-chain/);
  assert.match(html, /Research and Analysis/);
  assert.match(html, /Macroeconomics and Geopolitics/);
  assert.match(html, /Malera Studio/);
  assert.match(html, /\+383 44 857 227/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /action-mark/);
  assert.doesNotMatch(html, /[↖↗↘↙←→↑↓]/);
  assert.doesNotMatch(html, />EQ</);
  assert.doesNotMatch(html, /Football|C:\/Users|C:%5CUsers|\.vinext\/fonts/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
  assert.doesNotMatch(html, /Context Atlas|atlas-stage|No live notes are listed yet/);

  const primaryNavigation = html.match(
    /<nav class="masthead-nav"[\s\S]*?<\/nav>/,
  )?.[0];
  assert.ok(primaryNavigation, "primary navigation is present");
  assert.equal((primaryNavigation.match(/<a\b/g) ?? []).length, 6);
  for (const label of ["Index", "Research", "Markets", "Work", "Build", "Contact"]) {
    assert.match(primaryNavigation, new RegExp(`>${label}<`));
  }
  assert.doesNotMatch(primaryNavigation, />Studio</);
});

test("renders indexed public routes with route-specific canonicals", async () => {
  const worker = await getWorker();
  for (const [route, expected] of [
    ["/research", "Build the question"],
    ["/markets", "A signal is only"],
    ["/work", "Real work"],
    ["/build", "Start with the need"],
    ["/contact", "Bring the context"],
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
  assert.match(html, /Barber Brothers — Selected Work — Enis Qetaj/);
  assert.match(
    html,
    new RegExp(
      `rel="canonical" href="${publicOrigin.replaceAll(".", "\\.")}/work/barber-brothers"`,
    ),
  );
  assert.match(html, /width="1023" height="1537"/);
  assert.match(html, /width="1086" height="1448"/);
  assert.match(html, /width="1200" height="960"/);
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
  assert.match(xml, /\/markets/);
  assert.match(xml, /\/build/);
  assert.match(xml, /\/work\/barber-brothers/);
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
  assert.match((await valid.json()).mailto, /^mailto:enisqeta5@gmail\.com/);

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
