import type { Metadata } from "next";
import Link from "next/link";
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
  return (
    <>
      <main id="main" className="route-page pricing-route">
        <header className="route-hero">
          <p>Pricing / Monthly subscription</p>
          <h1>Crypto market analysis.</h1>
          <div>
            <p>Structured market analysis combining technical, fundamental and on-chain research depending on the selected plan.</p>
            <span>Research and educational analysis / 1 month</span>
          </div>
        </header>

        <section className="pricing-depth" aria-labelledby="pricing-depth-title">
          <header>
            <p>01 / Analysis depth</p>
            <h2 id="pricing-depth-title">Choose the depth of research you need.</h2>
          </header>
          <ol className="pricing-plans">
            {pricingPlans.map((plan) => (
              <li key={plan.id} className="pricing-plan">
                <div className="pricing-plan__identity"><span>{plan.number}</span><h3>{plan.name}</h3></div>
                <p className="pricing-plan__price"><strong>€{plan.price}</strong><span>/ month</span></p>
                <p className="pricing-plan__description">{plan.description}</p>
                <ul aria-label={`${plan.name} plan features`}>
                  {plan.features.map((feature) => <li key={feature}><span aria-hidden="true">+</span>{feature}</li>)}
                  {plan.liveSessions !== "—" && <li><span aria-hidden="true">+</span>{plan.liveSessions} live research session{plan.liveSessions.startsWith("2") ? "s" : ""}</li>}
                </ul>
                <div className="pricing-plan__meta"><span>Subscription</span><strong>{plan.duration}</strong></div>
                <Link className="button button--primary" href={`/contact?plan=${plan.id}`}>Request this plan <ActionMark direction="forward" /></Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="pricing-comparison" aria-labelledby="pricing-comparison-title">
          <header><p>02 / Comparison</p><h2 id="pricing-comparison-title">Compare the research framework.</h2></header>
          <div className="pricing-comparison__desktop">
            <table>
              <caption className="visually-hidden">Comparison of Technical, Advanced and Complete monthly plans</caption>
              <thead><tr><th scope="col">Feature</th>{pricingPlans.map((plan) => <th scope="col" key={plan.id}>{plan.name}<span>€{plan.price}</span></th>)}</tr></thead>
              <tbody>{comparisonRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={`${row.label}-${pricingPlans[index].id}`} data-included={value === "Included" ? "true" : undefined}><span aria-hidden="true">{value === "Included" ? "✓" : value === "Not included" ? "—" : value}</span><span className="visually-hidden">{value}</span></td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="pricing-comparison__mobile" aria-label="Mobile plan comparison">
            {pricingPlans.map((plan, planIndex) => (
              <article key={plan.id}>
                <h3>{plan.name} <span>€{plan.price} / month</span></h3>
                <dl>{comparisonRows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.values[planIndex]}</dd></div>)}</dl>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-service-notes" aria-label="Service details">
          <article><p>03 / Research assistance</p><h2>Understand the framework.</h2><p>Research assistance includes help understanding the analysis, key market variables and the analytical framework during the active subscription.</p></article>
          <article><p>04 / Live sessions</p><h2>Discuss the current context.</h2><p>Live market research sessions can cover market structure, asset analysis, technical context, fundamental developments, on-chain developments where relevant and macro market context.</p></article>
        </section>

        <aside className="pricing-disclaimer" aria-label="Market research disclaimer">
          <strong>Research disclaimer</strong>
          <p>Market research and educational analysis only. Nothing on this website constitutes financial or investment advice. Cryptocurrency and financial markets involve risk, and market outcomes are uncertain.</p>
        </aside>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.pricing)).replace(/</g, "\\u003c") }} />
    </>
  );
}
