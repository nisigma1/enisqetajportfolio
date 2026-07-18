import Link from "next/link";
import type { Metadata } from "next";
import { researchCategories } from "@/data/research";
export const metadata: Metadata = { title: "Research Archive — Enis Qetaj", description: "Future research connecting market structure, liquidity, macroeconomics, geopolitics and digital assets." };
export default function ResearchArchive() {
  return <main className="archive-page"><header><Link href="/">EQ / Back to index</Link><p>06 / RESEARCH ARCHIVE</p></header><section><p className="technical-label">Archive status / In development</p><h1>Separate signals.<br /><em>A clearer view.</em></h1><p>Future notes will connect market structure, liquidity, macroeconomics, geopolitics and digital assets.</p><div className="archive-categories">{researchCategories.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>)}</div><p className="disclaimer">Research content is educational and does not constitute financial advice.</p></section></main>;
}

