import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "@/components/seo/StructuredData";
import { identity, nisigmaOnChain } from "@/data/site";
import { absoluteUrl, baseStructuredData, canonicalOrigin, ogImage, routeSeo } from "@/lib/seo";

const page = routeSeo.nisigmaOnChain;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    type: "article",
    url: page.path,
    title: page.title,
    description: page.description,
    images: [ogImage()],
  },
};

export default function NisigmaOnChainPage() {
  const structuredData = baseStructuredData(page);
  const url = absoluteUrl(page.path);

  return (
    <>
      <main id="main" className="route-page research-route">
        <header className="route-hero">
          <p>Dashboard case study</p>
          <h1>{nisigmaOnChain.name}</h1>
          <div>
            <p>Nisigma OnChain is a public CryptoQuant dashboard I built to compare blockchain activity, investor behavior and capital flows with moves in the crypto market.</p>
            <span>By <Link href="/about">{identity.name}</Link></span>
          </div>
        </header>

        <section className="case-study__chapter" aria-labelledby="dashboard-purpose">
          <div><h2 id="dashboard-purpose">What the dashboard tracks</h2></div>
          <div>
            <p>I wanted the metrics I use most often in one place. The dashboard groups indicators for network activity, investor behavior and capital flows so I can review them alongside market conditions.</p>
            <a className="portfolio-text-link" href={nisigmaOnChain.dashboardUrl}>Open Nisigma OnChain on CryptoQuant</a>
          </div>
        </section>

        <section className="case-study__chapter" aria-labelledby="dashboard-method">
          <div><h2 id="dashboard-method">How I read the data</h2></div>
          <div>
            <p>I start with a question about a market move, check which on-chain metrics changed over the same period, then compare them with price, liquidity and macroeconomic context.</p>
            <p>For example, if Bitcoin rises while on-chain activity stays flat, I first align the time windows. Then I check whether the pattern repeats across several metrics and whether liquidity or a macroeconomic event offers another explanation. If the evidence still points in different directions, I leave the cause open.</p>
            <Link className="portfolio-text-link" href="/research">Read my research method</Link>
          </div>
        </section>

        <section className="case-study__chapter" aria-labelledby="dashboard-limits">
          <div><h2 id="dashboard-limits">Limits of the data</h2></div>
          <div>
            <p>Interpretation depends on the metric definition, source coverage and time window. A transfer can have several explanations, and a single indicator cannot establish why the market moved.</p>
            <a className="portfolio-text-link" href={nisigmaOnChain.announcementUrl}>Read the original LinkedIn post</a>
          </div>
        </section>
      </main>
      <StructuredData
        data={{
          ...structuredData,
          "@graph": [
            ...structuredData["@graph"],
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: page.title,
              description: page.description,
              mainEntityOfPage: { "@id": `${url}#webpage` },
              author: { "@id": `${canonicalOrigin}/#person` },
              publisher: { "@id": `${canonicalOrigin}/#person` },
              inLanguage: "en",
              citation: [nisigmaOnChain.dashboardUrl, nisigmaOnChain.announcementUrl],
            },
          ],
        }}
      />
    </>
  );
}
