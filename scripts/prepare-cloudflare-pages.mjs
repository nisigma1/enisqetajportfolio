import { cp, mkdir, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const clientDir = resolve(root, "dist/client");
const serverDir = resolve(root, "dist/server");
const pagesDir = resolve(root, "dist");
const pagesTmpDir = resolve(root, "dist-pages-tmp");
const redirectedWranglerConfig = resolve(root, ".wrangler/deploy/config.json");

await rm(pagesTmpDir, { recursive: true, force: true });
await mkdir(pagesTmpDir, { recursive: true });

await cp(clientDir, pagesTmpDir, { recursive: true });
await cp(resolve(serverDir, "index.js"), resolve(pagesTmpDir, "_worker.js"));
await cp(resolve(serverDir, "index.js"), resolve(pagesTmpDir, "index.js"));
await cp(
  resolve(serverDir, "__vite_rsc_assets_manifest.js"),
  resolve(pagesTmpDir, "__vite_rsc_assets_manifest.js"),
);
await cp(resolve(serverDir, "ssr"), resolve(pagesTmpDir, "ssr"), {
  recursive: true,
});

await writeFile(
  resolve(pagesTmpDir, "_routes.json"),
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
await rm(pagesDir, { recursive: true, force: true });
await rename(pagesTmpDir, pagesDir);
