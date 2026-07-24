import type { Metadata } from "next";
import { EvidenceLadder } from "@/components/markets/PerspectiveLens";
import { marketInterests } from "@/data/site";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "A layered market-research interface connecting price, structure, fundamentals, liquidity, macro, geopolitics and on-chain behavior.",
  alternates: { canonical: "/markets" },
};

export default function MarketsPage() {
  return (
    <main id="main" className="route-page markets-route">
      <header className="route-hero">
        <p>Markets / Evidence ladder</p>
        <h1>A signal is only<br />the beginning.</h1>
        <div>
          <p>Move from observation to context without pretending that one indicator explains the whole situation.</p>
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
  );
}
