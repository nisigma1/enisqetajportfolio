import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const clientDir = resolve(root, "dist/client");
const serverDir = resolve(root, "dist/server");
const pagesDir = resolve(root, "dist");
const redirectedWranglerConfig = resolve(root, ".wrangler/deploy/config.json");

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

await writeFile(
  resolve(pagesDir, "_routes.json"),
  `${JSON.stringify(
    {
      version: 1,
      include: ["/*"],
      exclude: [
        "/assets/*",
        "/images/*",
        "/favicon.svg",
        "/og.png",
        "/_headers",
        "/.vite/*",
      ],
    },
    null,
    2,
  )}\n`,
);

await rm(redirectedWranglerConfig, { force: true });
