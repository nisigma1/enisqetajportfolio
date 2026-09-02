/* eslint-disable @next/next/no-img-element -- User-provided research-note captures stay as local, unmodified proof images. */
import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { ActionMark } from "@/components/ui/ActionMark";
import { pricingPlans } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.pricing.title,
  description: routeSeo.pricing.description,
  alternates: { canonical: "/pricing" },
  openGraph: { type: "website", url: "/pricing", title: routeSeo.pricing.title, description: routeSeo.pricing.description },
  twitter: { card: "summary", title: routeSeo.pricing.title, description: routeSeo.pricing.description },
};

export default function PricingPage() {
  const analysisLayers = ["Technical", "Fundamental", "On-chain"] as const;

  return (
    <>
      <InnerPageShell
        variant="analysis"
        eyebrow="Crypto Analysis / Monthly research"
        title={<>Monthly research plans for crypto-market analysis.</>}
        summary="Technical, fundamental and on-chain analysis with increasing research depth across one-month subscriptions."
        meta={["Technical", "Fundamental", "On-chain"]}
      >
        <section className="inner-section analysis-depth" aria-labelledby="analysis-depth-title">
          <header className="inner-section__header">
            <p className="inner-section__label">01 / Monthly plans</p>
            <h2 id="analysis-depth-title">Choose the analytical framework you need.</h2>
            <p>Clear monthly scope, without an overloaded comparison table. Each level adds a deeper layer of analysis.</p>
          </header>
          <ol className="analysis-plans">
            {pricingPlans.map((plan, planIndex) => (
              <li key={plan.id} className="analysis-plan" data-featured={plan.id === "advanced" ? "true" : undefined}>
                <div className="analysis-plan__identity">
                  <div className="analysis-plan__heading">
                    <span className="analysis-plan__number">{plan.number}</span>
                    <h3>{plan.name}</h3>
                    {plan.id === "advanced" && <span className="analysis-plan__badge">Most selected</span>}
                  </div>
                  <p className="analysis-plan__description">{plan.description}</p>
                  <p className="analysis-plan__price"><strong>€{plan.price}</strong><span>/ month</span></p>
                </div>
                <ol className="analysis-plan__layers" aria-label={`${plan.name} analysis layers`}>
                  {analysisLayers.map((layer, layerIndex) => (
                    <li key={layer} data-included={layerIndex <= planIndex ? "true" : undefined}>
                      <span aria-hidden="true">{layerIndex <= planIndex ? "✓" : "—"}</span>{layer}
                    </li>
                  ))}
                </ol>
                <div className="analysis-plan__scope">
                  <ul aria-label={`${plan.name} plan features`}>
                    {plan.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
                    {plan.liveSessions !== "—" && <li><span aria-hidden="true">✓</span>{plan.liveSessions} live research session{plan.liveSessions.startsWith("2") ? "s" : ""}</li>}
                  </ul>
                </div>
                <Link className="button button--primary" href={`/contact?service=crypto-analysis&plan=${plan.id}`}>Select {plan.name} <ActionMark direction="forward" /></Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="inner-section analysis-support" aria-label="Service details">
          <article>
            <p className="inner-section__label">02 / Research assistance</p>
            <h2>Understand the analysis, not only the conclusion.</h2>
            <p>Research assistance helps you understand the analysis, important market variables and the analytical framework during your active subscription.</p>
          </article>
          <article>
            <p className="inner-section__label">03 / Live research sessions</p>
            <h2>Discuss the current context.</h2>
            <p>Advanced includes 1 live research session per week. Complete includes 2 live research sessions per week.</p>
            <ul>
              {[
                "Current market structure",
                "Technical developments",
                "Fundamental updates",
                "On-chain developments",
                "Asset-specific questions",
                "Broader market context",
              ].map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </article>
        </section>

        <section className="inner-section research-notes" aria-labelledby="research-notes-title">
          <header className="inner-section__header">
            <p className="inner-section__label">04 / Research notes</p>
            <h2 id="research-notes-title">Analiza të tregut, të publikuara në X.</h2>
            <p>Nëse doni analiza teknike, fundamentale, on-chain dhe pamje makro, më ndiqni në X. Aty shpërndaj analiza të ndryshme të tregut.</p>
          </header>
          <div className="research-notes__grid">
            {[
              {
                image: "/images/research-notes/x-susdt-weekly.jpg",
                alt: "NISIGMA X post with a SUSDT weekly technical analysis chart",
                label: "SUSDT weekly technical view",
                width: 1066,
                height: 1280,
              },
              {
                image: "/images/research-notes/x-bitcoin-mvrv.jpg",
                alt: "NISIGMA X post discussing Bitcoin MVRV Z-score market context",
                label: "Bitcoin MVRV market context",
                width: 964,
                height: 1280,
              },
              {
                image: "/images/research-notes/x-strk-onchain.jpg",
                alt: "NISIGMA X post reviewing Starknet on-chain activity and chart context",
                label: "Starknet on-chain context",
                width: 814,
                height: 1280,
              },
              {
                image: "/images/research-notes/x-fet-technical.jpg",
                alt: "NISIGMA X post outlining FET technical support levels on a market chart",
                label: "FET technical view",
                width: 1089,
                height: 1280,
              },
            ].map((note) => (
              <article key={note.image} className="research-note">
                <a href="https://x.com/N1sigma" target="_blank" rel="noopener noreferrer" aria-label={`Open ${note.label} on X`}>
                  <div className="research-note__source">
                    <span><b>NISIGMA</b><small>@N1sigma</small></span>
                    <span className="research-note__x" aria-hidden="true">𝕏</span>
                  </div>
                  <img src={note.image} alt={note.alt} width={note.width} height={note.height} loading="lazy" decoding="async" />
                  <span className="research-note__footer">View research on X <ActionMark direction="external" /></span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <aside className="analysis-disclaimer" aria-label="Market research disclaimer">
          <strong>Research disclaimer</strong>
          <p>Market research and educational analysis only. Nothing on this website constitutes financial or investment advice. Cryptocurrency and financial markets involve risk, and market outcomes are uncertain.</p>
        </aside>
      </InnerPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.pricing)).replace(/</g, "\\u003c") }} />
    </>
  );
}
