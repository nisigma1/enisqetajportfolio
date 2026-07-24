import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="route-page not-found">
      <p>404 / Wrong turn</p>
      <h1>Nothing lives<br />on this page.</h1>
      <Link className="button button--primary" href="/">Return to the index <span aria-hidden="true">→</span></Link>
    </main>
  );
}
