/* eslint-disable @next/next/no-img-element -- User-provided research-note captures stay as local, unmodified proof images. */
import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { pricingPlans } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";
import "@/styles/pricing-mobile.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.pricing.title,
  description: routeSeo.pricing.description,
  alternates: { canonical: "/pricing" },
  openGraph: { type: "website", url: "/pricing", title: routeSeo.pricing.title, description: routeSeo.pricing.description },
  twitter: { card: "summary", title: routeSeo.pricing.title, description: routeSeo.pricing.description },
};

const planOverview: Record<(typeof pricingPlans)[number]["id"], string> = {
  technical: "Charts and market structure",
  advanced: "Adds fundamental research",
  complete: "Adds on-chain research",
};

const featuredNote = {
  image: "/images/research-notes/x-bitcoin-mvrv-dark.webp",
  alt: "Archived NISIGMA post with a chart of Bitcoin’s MVRV Z-score and price",
  width: 1089,
  height: 1445,
};

const archivedNotes = [
  {
    image: "/images/research-notes/x-susdt-weekly-dark.webp",
    alt: "Archived NISIGMA post with a weekly chart of USDT dominance",
    label: "USDT dominance · Weekly chart",
    width: 1146,
    height: 1372,
  },
  {
    image: "/images/research-notes/x-strk-onchain-dark.webp",
    alt: "Archived NISIGMA post comparing Starknet on-chain metrics",
    label: "Starknet · On-chain activity",
    width: 1001,
    height: 1572,
  },
  {
    image: "/images/research-notes/x-fet-technical-dark.webp",
    alt: "Archived NISIGMA post with a chart marking FET support levels",
    label: "FET · Technical analysis",
    width: 1157,
    height: 1359,
  },
];

function ResearchCaptureLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="pricing-mobile__capture-link" href={href} target="_blank" rel="noopener noreferrer">
      View full-size capture<span className="visually-hidden">: {label} (opens in a new tab)</span>
    </a>
  );
}

export default function PricingPage() {
  const analysisLayers = ["Technical", "Fundamental", "On-chain"] as const;

  return (
    <>
      <InnerPageShell
        variant="analysis"
        eyebrow="Monthly research plans"
        title="Crypto market analysis"
        summary="Choose how much detail you want: chart analysis, fundamental research, or a plan that also covers on-chain data."
      >
        <section className="inner-section analysis-depth" aria-labelledby="analysis-depth-title">
          <nav aria-label="Monthly plan overview">
            <ul className="analysis-plan-overview" role="list">
              {pricingPlans.map((plan) => (
                <li key={plan.id} data-featured={plan.id === "advanced" ? "true" : undefined}>
                  <a href={`#plan-${plan.id}`}>
                    <span className="analysis-plan-overview__name">{plan.name}</span>
                    <span className="analysis-plan-overview__price"><strong>€{plan.price}</strong> <span>/ month</span></span>
                    <span className="analysis-plan-overview__scope">{planOverview[plan.id]}</span>
                    <span className="pricing-mobile__sessions">
                      {plan.liveSessions === "—" ? "No live sessions" : `${plan.liveSessions.split(" / ")[0]} live session${plan.liveSessions.startsWith("2") ? "s" : ""} / week`}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="pricing-mobile__sample-link" href="#research-example">See a research example</a>
          <h2 id="analysis-depth-title" className="analysis-section-heading">What each plan includes</h2>
          <ol className="analysis-plans" role="list">
            {pricingPlans.map((plan, planIndex) => (
              <li
                key={plan.id}
                id={`plan-${plan.id}`}
                className="analysis-plan"
                data-featured={plan.id === "advanced" ? "true" : undefined}
                tabIndex={-1}
              >
                <div className="analysis-plan__identity">
                  <div className="analysis-plan__heading">
                    <span className="analysis-plan__number" aria-hidden="true">{plan.number}</span>
                    <h3 id={`plan-${plan.id}-title`}>{plan.name}</h3>
                  </div>
                  <p className="analysis-plan__description">{plan.description}</p>
                  <p className="analysis-plan__price"><strong>€{plan.price}</strong><span>/ month</span></p>
                </div>
                <ul className="analysis-plan__layers" aria-label={`${plan.name} analysis layers`}>
                  {analysisLayers.map((layer, layerIndex) => (
                    <li key={layer} data-included={layerIndex <= planIndex ? "true" : undefined}>
                      <span aria-hidden="true">{layerIndex <= planIndex ? "✓" : "—"}</span>
                      <span>{layer}<span className="visually-hidden">{layerIndex <= planIndex ? " included" : " not included"}</span></span>
                    </li>
                  ))}
                </ul>
                <div className="analysis-plan__scope">
                  <ul aria-label={`${plan.name} plan features`}>
                    {plan.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
                    {plan.liveSessions !== "—" && <li><span aria-hidden="true">✓</span>{plan.liveSessions} live research session{plan.liveSessions.startsWith("2") ? "s" : ""}</li>}
                  </ul>
                </div>
                <Link className="button button--primary" href={`/contact?service=crypto-analysis&plan=${plan.id}#contact-form`} aria-describedby={`plan-${plan.id}-title`}>Request this plan</Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="research-example" className="inner-section research-notes research-notes--sample" aria-labelledby="research-notes-title" tabIndex={-1}>
          <div className="research-notes__grid">
            <article className="research-note research-note--featured">
              <header className="research-note__intro">
                <p className="inner-section__label">Research example / On-chain analysis</p>
                <h2 id="research-notes-title" className="analysis-section-heading">Bitcoin MVRV market context</h2>
                <p>I compared Bitcoin’s MVRV Z-score with its price history. The note shows how I use an on-chain metric to add context without treating it as a signal that the market has bottomed.</p>
                <p className="research-note__meta">Archived research from NISIGMA. It does not reflect current market conditions.</p>
                <a href="https://x.com/N1sigma" target="_blank" rel="noopener noreferrer">View NISIGMA’s profile on X</a>
              </header>
              <figure className="research-note__capture">
                <div className="research-note__visual"><img src={featuredNote.image} alt={featuredNote.alt} width={featuredNote.width} height={featuredNote.height} loading="lazy" decoding="async" /></div>
                <figcaption className="research-note__footer">
                  <span>Published on X by NISIGMA</span>
                  <ResearchCaptureLink href={featuredNote.image} label="Bitcoin MVRV market context" />
                </figcaption>
              </figure>
            </article>
          </div>
        </section>

        <section className="inner-section analysis-membership-flow" aria-labelledby="analysis-membership-flow-title">
          <header className="inner-section__header">
            <p className="inner-section__label">Start membership</p>
            <h2 id="analysis-membership-flow-title">From request to Discord</h2>
            <p>Send a request for the plan you want. Enis replies by email with payment instructions. Your Discord invite comes after payment is confirmed.</p>
          </header>
          <ol role="list">
            <li>
              <span aria-hidden="true">01</span>
              <h3>Request your plan</h3>
              <p>Pick a plan above to open the contact form with your selection filled in.</p>
            </li>
            <li>
              <span aria-hidden="true">02</span>
              <h3>Get payment instructions</h3>
              <p>Choose bank transfer (Raiffeisen) or crypto payment in the form. Enis sends the instructions by email.</p>
            </li>
            <li>
              <span aria-hidden="true">03</span>
              <h3>Receive your invite</h3>
              <p>Once payment is confirmed, Enis shares the Discord invite by email.</p>
            </li>
          </ol>
        </section>

        <section className="inner-section analysis-support" aria-label="Service details">
          <article>
            <p className="inner-section__label">Research assistance</p>
            <h2>Ask about the analysis</h2>
            <p>Research assistance helps you understand the analysis, important market variables and the analytical framework during your active subscription.</p>
          </article>
          <article>
            <p className="inner-section__label">Live research sessions</p>
            <h2>Discuss the current market</h2>
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

        <section className="inner-section research-notes" aria-labelledby="research-archive-title">
          <h2 id="research-archive-title" className="analysis-section-heading">More published research</h2>
          <div className="research-notes__grid research-notes__grid--archive">
            {archivedNotes.map((note) => (
              <figure key={note.image} className="research-note research-note--archived">
                <div className="research-note__visual"><img src={note.image} alt={note.alt} width={note.width} height={note.height} loading="lazy" decoding="async" /></div>
                <figcaption className="research-note__footer">
                  <span>{note.label}</span>
                  <ResearchCaptureLink href={note.image} label={note.label} />
                </figcaption>
              </figure>
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
