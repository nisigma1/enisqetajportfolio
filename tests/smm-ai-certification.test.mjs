import assert from "node:assert/strict";
import test from "node:test";
import worker from "../dist/index.js";

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

test("background publishes the verified Hallakate training without the certificate photo", async () => {
  const response = await worker.fetch(new Request("https://enisqetaj.com/background"), env, ctx);
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const value of ["SMM + AI", "AI Social Media Marketing", "Hallakate", "BËHU AI SMM 2026", "Certificate of Achievement", "Experience", "/images/education/hallakate-logo.svg"]) {
    assert.ok(html.includes(value), value);
  }
  for (const value of ["University of Prishtina", "Bachelor’s Degree", "Master’s Degree", "In progress", "Crypto School", "Crypto Markets Curriculum"]) {
    assert.ok(html.includes(value), value);
  }
  assert.doesNotMatch(html, /6afa6172|HKT 2310-02|AppData|codex-clipboard/);
  assert.doesNotMatch(html, /5-day program|15<!-- -->|>hours<|Practical training/);
  assert.doesNotMatch(html, /23 October 2026|2026-10-23/);
  assert.match(html, /<strong>2\+\s*<span>years<\/span><\/strong>/);
});

test("Hallakate addition does not alter the homepage content", async () => {
  const response = await worker.fetch(new Request("https://enisqetaj.com/"), env, ctx);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.doesNotMatch(html, /hallakate-logo|BËHU AI SMM|Certificate of Achievement/);
});
