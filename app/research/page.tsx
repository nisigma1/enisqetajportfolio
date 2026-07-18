import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Market Research — Enis Qetaj", description: "How Enis Qetaj widens the lens from price to structure, liquidity, macroeconomics and geopolitics." };
export default function ResearchPage() { return <main className="inner-page"><header><Link href="/">EQ / Index</Link><span>Markets</span></header><section className="inner-hero"><p>Research archive / In development</p><h1>Price is the beginning.<br /><em>Not the whole story.</em></h1><p>Future notes will connect market structure, liquidity, macroeconomics, geopolitics and digital assets.</p><Link href="/#markets">Explore the market lens ↗</Link></section></main>; }

