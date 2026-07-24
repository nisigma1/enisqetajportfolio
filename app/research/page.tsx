import type { Metadata } from "next";
import Link from "next/link";
import { researchDomains, researchMethod, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Research Framework",
  description: "The evidence-led research framework behind Enis Qetaj’s work across markets, macro, geopolitics and on-chain behavior.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <main className="inner-page research-page">
      <header><Link href="/">EQ / Index</Link><span>Research framework</span></header>
      <section className="inner-hero">
        <p>Research practice / {siteConfig.name}</p>
        <h1>Build the question.<br /><em>Then widen the evidence.</em></h1>
        <p>This archive is intentionally quiet until a note is ready to be sourced, argued and published with the care it needs.</p>
      </section>
      <section className="research-page-grid" aria-labelledby="method-title">
        <div><p id="method-title">Method</p><strong>Evidence before narrative.</strong></div>
        <ol>{researchMethod.map((step) => <li key={step.number}><span>{step.number}</span><h2>{step.title}</h2><p>{step.note}</p></li>)}</ol>
      </section>
      <section className="research-page-domains" aria-labelledby="domains-title">
        <p id="domains-title">Domains in view</p>
        <ul>{researchDomains.map((domain) => <li key={domain}>{domain}</li>)}</ul>
      </section>
      <p className="research-page-close">No live notes are listed yet. When they are, each will distinguish observed evidence, uncertainty and interpretation.</p>
      <Link className="text-link" href="/#markets">Explore the Context Atlas <span aria-hidden="true">↓</span></Link>
    </main>
  );
}
