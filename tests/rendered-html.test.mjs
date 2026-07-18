import assert from "node:assert/strict";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

test("server-renders the complete identity homepage", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Enis Qetaj — Crypto Trader/);
  assert.match(html, /I read markets\./);
  assert.match(html, /Selected work is being documented\./);
  assert.match(html, /Research archive in development\./);
  assert.match(html, /Have an idea/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("renders every public route", async () => {
  const worker = await getWorker();
  for (const [route, expected] of [["/work", "Selected work is"], ["/research", "Separate signals"], ["/contact", "worth building"]]) {
    const response = await worker.fetch(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }), env, ctx);
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), new RegExp(expected), route);
  }
});

test("contact endpoint validates input and returns a mail fallback", async () => {
  const worker = await getWorker();
  const valid = await worker.fetch(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Test User", email: "test@example.com", service: "Website", budget: "Discuss", description: "A sufficiently detailed project description for validation.", website: "" }) }), env, ctx);
  assert.equal(valid.status, 200);
  assert.match((await valid.json()).mailto, /^mailto:enisqeta5@gmail\.com/);

  const invalid = await worker.fetch(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "X", email: "bad", description: "short" }) }), env, ctx);
  assert.equal(invalid.status, 422);
});
