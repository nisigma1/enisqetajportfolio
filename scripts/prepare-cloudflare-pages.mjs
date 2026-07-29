import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const clientDir = resolve(root, "dist/client");
const serverDir = resolve(root, "dist/server");
const pagesDir = resolve(root, "dist/pages");

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });

await cp(clientDir, pagesDir, { recursive: true });
await cp(resolve(serverDir, "index.js"), resolve(pagesDir, "_worker.js"));
await cp(resolve(serverDir, "index.js"), resolve(pagesDir, "index.js"));
await cp(
  resolve(serverDir, "__vite_rsc_assets_manifest.js"),
  resolve(pagesDir, "__vite_rsc_assets_manifest.js"),
);
await cp(resolve(serverDir, "ssr"), resolve(pagesDir, "ssr"), {
  recursive: true,
});

