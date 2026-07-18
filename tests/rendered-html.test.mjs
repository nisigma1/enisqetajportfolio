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
  assert.match(html, /Enis Qetaj — Markets, Research &amp; Product Systems/);
  assert.match(html, /I study the forces around a decision/);
  assert.equal((html.match(/alt="Portrait of Enis Qetaj"/g) ?? []).length, 1);
  assert.match(html, /Barber Brothers/);
  assert.match(html, /A price is a signal/);
  assert.match(html, /Malera Studio/);
  assert.match(html, /\+383 44 857 227/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("renders every public route", async () => {
  const worker = await getWorker();
  for (const [route, expected] of [["/work", "One real project"], ["/research", "Price is the beginning"], ["/contact", "worth talking about"]]) {
    const response = await worker.fetch(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }), env, ctx);
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), new RegExp(expected), route);
  }
});

test("contact endpoint validates input and returns a mail fallback", async () => {
  const worker = await getWorker();
  const valid = await worker.fetch(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Test User", email: "test@example.com", project: "A booking website", message: "A sufficiently detailed project description for validation.", website: "" }) }), env, ctx);
  assert.equal(valid.status, 200);
  assert.match((await valid.json()).mailto, /^mailto:enisqeta5@gmail\.com/);

  const invalid = await worker.fetch(new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "X", email: "bad", project: "No", message: "short" }) }), env, ctx);
  assert.equal(invalid.status, 422);
});
