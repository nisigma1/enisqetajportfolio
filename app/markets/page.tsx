import type { Metadata } from "next";
import { EvidenceLadder } from "@/components/markets/PerspectiveLens";
import { marketInterests } from "@/data/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.markets.title,
  description: routeSeo.markets.description,
  alternates: { canonical: "/markets" },
  openGraph: { type: "website", url: "/markets", title: routeSeo.markets.title, description: routeSeo.markets.description, images: [ogImage()] },
  twitter: { card: "summary_large_image", title: routeSeo.markets.title, description: routeSeo.markets.description, images: ["/og.png"] },
};

export default function MarketsPage() {
  return (
    <>
      <main id="main" className="route-page markets-route">
      <header className="route-hero">
        <p>Markets / Evidence ladder</p>
        <h1>Crypto markets, macro and geopolitics</h1>
        <div>
          <p>Enis Qetaj connects price, structure, fundamentals, liquidity, macroeconomics, geopolitics and on-chain activity without pretending that one indicator explains the whole situation.</p>
          <span>Signal / Context / Decision</span>
        </div>
      </header>

      <section className="route-market-lens" aria-labelledby="market-lens-title">
        <div className="route-market-lens__intro">
          <p>01 / Working interface</p>
          <h2 id="market-lens-title">Seven layers. One coherent view.</h2>
          <p>Each layer keeps the previous evidence visible while widening the frame around it.</p>
        </div>
        <EvidenceLadder />
      </section>

      <section className="route-section route-domains" aria-labelledby="market-fields-title">
        <div>
          <p>02 / Fields</p>
          <h2 id="market-fields-title">What enters the frame.</h2>
        </div>
        <ul>
          {marketInterests.map((interest) => <li key={interest}>{interest}</li>)}
        </ul>
      </section>
      </main>
      <StructuredData data={baseStructuredData(routeSeo.markets)} />
    </>
  );
}
