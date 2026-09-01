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

const comparisonRows = [
  { label: "Technical", values: ["Included", "Included", "Included"] },
  { label: "Fundamental", values: ["Not included", "Included", "Included"] },
  { label: "On-chain", values: ["Not included", "Not included", "Included"] },
  { label: "Research assistance", values: ["Included", "Included", "Included"] },
  { label: "Live sessions", values: ["None", "1 / week", "2 / week"] },
  { label: "Duration", values: ["1 month", "1 month", "1 month"] },
] as const;

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
            <p className="inner-section__label">01 / Analysis depth</p>
            <h2 id="analysis-depth-title">Choose the analytical framework you need.</h2>
            <p>Each level includes the layers before it. The progression explains the difference in scope and price.</p>
          </header>
          <ol className="analysis-plans">
            {pricingPlans.map((plan, planIndex) => (
              <li key={plan.id} className="analysis-plan">
                <div className="analysis-plan__identity">
                  <span className="analysis-plan__number">{plan.number}</span>
                  <h3>{plan.name}</h3>
                  <p><strong>€{plan.price}</strong><span>/ 1 month</span></p>
                </div>
                <ol className="analysis-plan__layers" aria-label={`${plan.name} analysis layers`}>
                  {analysisLayers.map((layer, layerIndex) => (
                    <li key={layer} data-included={layerIndex <= planIndex ? "true" : undefined}>
                      <span aria-hidden="true">{layerIndex <= planIndex ? "●" : "○"}</span>{layer}
                    </li>
                  ))}
                </ol>
                <div className="analysis-plan__scope">
                  <p>{plan.description}</p>
                  <ul aria-label={`${plan.name} plan features`}>
                    {plan.features.map((feature) => <li key={feature}><span aria-hidden="true">+</span>{feature}</li>)}
                    {plan.liveSessions !== "—" && <li><span aria-hidden="true">+</span>{plan.liveSessions} live research session{plan.liveSessions.startsWith("2") ? "s" : ""}</li>}
                  </ul>
                </div>
                <Link className="button button--primary" href={`/contact?service=crypto-analysis&plan=${plan.id}`}>Select {plan.name} <ActionMark direction="forward" /></Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="inner-section analysis-comparison" aria-labelledby="analysis-comparison-title">
          <header className="inner-section__header"><p className="inner-section__label">02 / Comparison</p><h2 id="analysis-comparison-title">Compare the research framework.</h2><p>Exact differences across analysis, assistance, live sessions and subscription duration.</p></header>
          <div className="analysis-comparison__desktop">
            <table>
              <caption className="visually-hidden">Comparison of Technical, Advanced and Complete monthly plans</caption>
              <thead><tr><th scope="col">Feature</th>{pricingPlans.map((plan) => <th scope="col" key={plan.id}>{plan.name}<span>€{plan.price}</span></th>)}</tr></thead>
              <tbody>{comparisonRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={`${row.label}-${pricingPlans[index].id}`} data-included={value === "Included" ? "true" : undefined}><span aria-hidden="true">{value === "Included" ? "✓" : value === "Not included" ? "—" : value}</span><span className="visually-hidden">{value}</span></td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="analysis-comparison__mobile" aria-label="Mobile plan comparison">
            {pricingPlans.map((plan, planIndex) => (
              <article key={plan.id}>
                <h3>{plan.name} <span>€{plan.price} / month</span></h3>
                <dl>{comparisonRows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.values[planIndex]}</dd></div>)}</dl>
              </article>
            ))}
          </div>
        </section>

        <section className="inner-section analysis-support" aria-label="Service details">
          <article>
            <p className="inner-section__label">03 / Research assistance</p>
            <h2>Understand the analysis, not only the conclusion.</h2>
            <p>Research assistance helps you understand the analysis, important market variables and the analytical framework during your active subscription.</p>
          </article>
          <article>
            <p className="inner-section__label">04 / Live research sessions</p>
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

        <aside className="analysis-disclaimer" aria-label="Market research disclaimer">
          <strong>Research disclaimer</strong>
          <p>Market research and educational analysis only. Nothing on this website constitutes financial or investment advice. Cryptocurrency and financial markets involve risk, and market outcomes are uncertain.</p>
        </aside>
      </InnerPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.pricing)).replace(/</g, "\\u003c") }} />
    </>
  );
}
