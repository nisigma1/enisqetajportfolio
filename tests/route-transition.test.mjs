import assert from "node:assert/strict";
import test from "node:test";
import {
  activeRouteForPathname,
  canAdvanceTransition,
  createTileWave,
  gridForViewport,
  shouldInterceptNavigation,
} from "../lib/route-transition.mjs";

test("maps primary and nested routes to the correct active navigation item", () => {
  assert.equal(activeRouteForPathname("/"), null);
  assert.equal(activeRouteForPathname("/background"), "background");
  assert.equal(activeRouteForPathname("/work/barber-brothers"), "work");
  assert.equal(activeRouteForPathname("/companies"), "companies");
  assert.equal(activeRouteForPathname("/pricing"), "pricing");
  assert.equal(activeRouteForPathname("/contact"), "contact");
});

test("intercepts only an unmodified internal route change", () => {
  const base = {
    currentHref: "https://enis-qetaj.example/research",
    href: "/work",
  };
  assert.equal(shouldInterceptNavigation(base), true);
  assert.equal(shouldInterceptNavigation({ ...base, ctrlKey: true }), false);
  assert.equal(shouldInterceptNavigation({ ...base, metaKey: true }), false);
  assert.equal(shouldInterceptNavigation({ ...base, shiftKey: true }), false);
  assert.equal(shouldInterceptNavigation({ ...base, altKey: true }), false);
  assert.equal(shouldInterceptNavigation({ ...base, button: 1 }), false);
  assert.equal(shouldInterceptNavigation({ ...base, target: "_blank" }), false);
  assert.equal(shouldInterceptNavigation({ ...base, download: true }), false);
  assert.equal(
    shouldInterceptNavigation({ ...base, href: "https://external.example/work" }),
    false,
  );
  assert.equal(shouldInterceptNavigation({ ...base, href: "mailto:test@example.com" }), false);
  assert.equal(
    shouldInterceptNavigation({ ...base, href: "/research#method" }),
    false,
  );
  assert.equal(shouldInterceptNavigation({ ...base, href: "/research" }), false);
});

test("uses a bounded adaptive grid across acceptance viewports", () => {
  for (const [width, height, expectedColumns] of [
    [320, 720, 9],
    [390, 844, 9],
    [430, 932, 9],
    [768, 1024, 13],
    [1024, 768, 18],
    [1366, 768, 18],
    [1600, 900, 20],
    [1920, 1080, 20],
  ]) {
    const grid = gridForViewport(width, height);
    assert.equal(grid.columns, expectedColumns, `${width}px columns`);
    assert.ok(grid.count >= 160 && grid.count <= 260, `${width}px count ${grid.count}`);
  }
});

test("builds a deterministic click-origin wave with a reverse reveal", () => {
  const grid = gridForViewport(1366, 768);
  const wave = createTileWave(grid, { x: 683, y: 36 }, 240);
  const again = createTileWave(grid, { x: 683, y: 36 }, 240);
  assert.deepEqual(wave, again);
  assert.equal(wave.length, grid.count);
  assert.equal(Math.max(...wave.map((tile) => tile.coverDelay)), 240);
  for (const tile of wave) {
    assert.equal(tile.coverDelay + tile.revealDelay, 240);
  }
});

test("allows only the explicit transition state-machine graph", () => {
  const sequence = [
    ["idle", "preparing"],
    ["preparing", "covering"],
    ["covering", "covered"],
    ["covered", "navigating"],
    ["navigating", "revealing"],
    ["revealing", "idle"],
  ];
  for (const [current, next] of sequence) {
    assert.equal(canAdvanceTransition(current, next), true, `${current} -> ${next}`);
  }
  assert.equal(canAdvanceTransition("covering", "navigating"), false);
  assert.equal(canAdvanceTransition("idle", "revealing"), false);
  assert.equal(canAdvanceTransition("recovering", "idle"), true);
});
