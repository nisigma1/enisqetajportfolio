/** Cloudflare Worker entry point for the portfolio. */
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await handler.fetch(request, env, ctx);
    if (response.status !== 404) return response;

    let notFoundPage = response;
    let headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");

    // A HEAD response must carry the same status and headers as GET without a
    // response body, even if the application handler supplied one.
    if (request.method === "HEAD") {
      headers.delete("content-length");
      return new Response(null, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const requestUrl = new URL(request.url);
    const acceptsHtml = request.headers
      .get("accept")
      ?.split(",")
      .some((type) => type.trim().toLowerCase().startsWith("text/html"));
    const isRscRequest =
      request.headers.get("rsc") === "1" ||
      request.headers.has("next-router-state-tree") ||
      requestUrl.searchParams.has("_rsc");
    const isApiOrAsset =
      /^\/(?:api|assets|_next|_vinext|cdn-cgi|fonts|images|projects)(?:\/|$)/i.test(
        requestUrl.pathname,
      ) || /\/[^/]+\.[a-z0-9]{1,10}$/i.test(requestUrl.pathname);

    // Some nested route misses are emitted by Vinext as a bare-text 404. For
    // normal browser document requests only, reuse its root not-found render so
    // visitors still receive the designed page. Calling the handler directly
    // avoids re-entering this worker, and the original request keeps its 404.
    if (
      request.method === "GET" &&
      acceptsHtml &&
      !isRscRequest &&
      !isApiOrAsset &&
      !headers.get("content-type")?.includes("text/html")
    ) {
      try {
        const fallbackUrl = new URL("/404", request.url);
        const fallback = await handler.fetch(
          new Request(fallbackUrl, request),
          env,
          ctx,
        );

        if (
          fallback.status === 404 &&
          fallback.headers.get("content-type")?.includes("text/html")
        ) {
          notFoundPage = fallback;
          headers = new Headers(fallback.headers);
          headers.set("X-Robots-Tag", "noindex, nofollow");
        }
      } catch {
        // Keep the original 404 if the presentation-only fallback fails.
      }
    }

    if (!headers.get("content-type")?.includes("text/html")) {
      return new Response(notFoundPage.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const noIndexMeta = '<meta name="robots" content="noindex, nofollow">';
    const notFoundTitle = "<title>Page not found | Enis Qetaj</title>";
    const html = await notFoundPage.text();
    const withoutCanonical = html.replace(
      /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi,
      "",
    );
    const withoutInheritedTitle = withoutCanonical.replace(
      /<title\b[^>]*>[\s\S]*?<\/title>/gi,
      "",
    );
    const withNotFoundTitle = withoutInheritedTitle.replace(
      "</head>",
      `${notFoundTitle}</head>`,
    );
    const sanitized = /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i.test(
      withNotFoundTitle,
    )
      ? withNotFoundTitle.replace(
          /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi,
          noIndexMeta,
        )
      : withNotFoundTitle.replace("</head>", `${noIndexMeta}</head>`);

    headers.delete("content-length");
    return new Response(sanitized, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
