import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Selected Work — Enis Qetaj", description: "An honest archive for Enis Qetaj’s digital products and systems." };
export default function WorkArchive() {
  return <main className="archive-page"><header><Link href="/">EQ / Back to index</Link><p>05 / WORK ARCHIVE</p></header><section><p className="technical-label">Private / In development</p><h1>Selected work is<br /><em>being documented.</em></h1><p>Project narratives will be published when the real problem, process and solution can be shown with useful context.</p><div className="archive-framework" aria-hidden="true"><i /><i /><i /><span>Research</span><span>Interface</span><span>Product</span></div><Link className="button button--primary" href="/#contact">Discuss a project <span>↗</span></Link></section></main>;
}

