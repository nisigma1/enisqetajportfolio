/** Minimal ambient bindings for local TypeScript checks. Deployment injects the
 * concrete Cloudflare runtime types and resources declared by Sites. */
type Fetcher = { fetch(input: Request | string | URL, init?: RequestInit): Promise<Response> };
type D1Database = import("@miniflare/d1").D1Database;

declare module "cloudflare:workers" {
  export const env: { DB?: D1Database };
}
