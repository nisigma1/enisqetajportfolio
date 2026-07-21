import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 / Wrong turn</p>
      <h1>
        Nothing lives
        <br />
        <em>on this page.</em>
      </h1>
      <Link href="/">Return to the index ↗</Link>
    </main>
  );
}
