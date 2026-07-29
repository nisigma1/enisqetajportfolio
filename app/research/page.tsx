import type { Metadata } from "next";
import Link from "next/link";
import { researchDomains, researchMethod } from "@/data/site";
import { ActionMark } from "@/components/ui/ActionMark";
import { ogImage, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.research.title,
  description: routeSeo.research.description,
  alternates: { canonical: "/research" },
  openGraph: { type: "website", url: "/research", title: routeSeo.research.title, description: routeSeo.research.description, images: [ogImage()] },
  twitter: { card: "summary_large_image", title: routeSeo.research.title, description: routeSeo.research.description, images: ["/og.png"] },
};

export default function ResearchPage() {
  return (
    <main id="main" className="route-page research-route">
      <header className="route-hero">
        <p>Research practice / Enis Qetaj</p>
        <h1>Research by Enis Qetaj</h1>
        <div>
          <p>Enis Qetaj studies crypto markets through macroeconomics, liquidity, geopolitics, monetary policy and on-chain behavior. Research is presented here as a working method—not as a fabricated publication archive.</p>
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
        <Link className="button button--primary" href="/markets">Explore Enis Qetaj&apos;s market framework <ActionMark direction="forward" /></Link>
      </section>
    </main>
  );
}
