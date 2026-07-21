import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Market Research",
  description:
    "How Enis Qetaj widens the lens from price to market structure, liquidity, macroeconomics, geopolitics and on-chain research.",
  alternates: { canonical: "/research" },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResearchPage() {
  return (
    <main className="inner-page">
      <header>
        <Link href="/">EQ / Index</Link>
        <span>Markets</span>
      </header>
      <section className="inner-hero">
        <p>Research archive / In development</p>
        <h1>
          Price is the beginning.
          <br />
          <em>Not the whole story.</em>
        </h1>
        <p>
          Future notes will connect market structure, liquidity, macroeconomics,
          geopolitics and digital assets.
        </p>
        <Link href="/#markets">Explore the wider lens ↗</Link>
      </section>
    </main>
  );
}
