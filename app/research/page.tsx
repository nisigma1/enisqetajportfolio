import type { Metadata } from "next";
import Link from "next/link";
import { researchDomains, researchMethod } from "@/data/site";

export const metadata: Metadata = {
  title: "Research Practice",
  description: "The evidence-led research practice Enis Qetaj uses across markets, macroeconomics, geopolitics and on-chain behavior.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <main id="main" className="route-page research-route">
      <header className="route-hero">
        <p>Research practice / Enis Qetaj</p>
        <h1>Build the question.<br />Then widen the evidence.</h1>
        <div>
          <p>Research is presented here as a working method—not as a fabricated publication archive.</p>
          <span>Markets / Macro / Geopolitics / On-chain</span>
        </div>
      </header>

      <section className="route-section route-method" aria-labelledby="method-title">
        <div>
          <p>01 / Method</p>
          <h2 id="method-title">Evidence before narrative.</h2>
        </div>
        <ol>
          {researchMethod.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="route-section route-domains" aria-labelledby="domains-title">
        <div>
          <p>02 / Fields of inquiry</p>
          <h2 id="domains-title">The situation is larger than one signal.</h2>
        </div>
        <ul>{researchDomains.map((domain) => <li key={domain}>{domain}</li>)}</ul>
      </section>

      <section className="route-callout">
        <p>Research and educational content only. Not financial advice.</p>
        <Link className="button button--primary" href="/#markets">Explore the Evidence Ladder <span aria-hidden="true">↓</span></Link>
      </section>
    </main>
  );
}
