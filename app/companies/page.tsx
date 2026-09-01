import type { Metadata } from "next";
import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";
import { buildCapabilities, malera } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.companies.title,
  description: routeSeo.companies.description,
  alternates: { canonical: "/companies" },
  openGraph: { type: "website", url: "/companies", title: routeSeo.companies.title, description: routeSeo.companies.description },
  twitter: { card: "summary", title: routeSeo.companies.title, description: routeSeo.companies.description },
};

export default function CompaniesPage() {
  return (
    <>
      <main id="main" className="route-page companies-route">
        <header className="route-hero">
          <p>Companies / Professional practice</p>
          <h1>Malera Studio</h1>
          <div>
            <p>A digital product and AI-building practice founded by Enis Qetaj.</p>
            <span>Websites / AI products / Automation</span>
          </div>
        </header>

        <section className="company-profile" aria-labelledby="company-profile-title">
          <div className="company-profile__identity">
            <p>01 / Company</p>
            <span>Founded by Enis Qetaj</span>
            <h2 id="company-profile-title">Build the useful form.</h2>
          </div>
          <div className="company-profile__definition">
            <p>{malera.line}</p>
            <p>Malera expands the building side of Enis’s practice into focused digital systems for real business needs.</p>
            <a className="button button--primary" href={malera.url} target="_blank" rel="noopener noreferrer">
              Visit Malera Studio <ActionMark direction="external" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </section>

        <section className="company-capabilities" aria-labelledby="company-capabilities-title">
          <header><p>02 / Capabilities</p><h2 id="company-capabilities-title">A clear system for digital work.</h2></header>
          <ol>
            {buildCapabilities.map((capability, index) => (
              <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><strong>{capability}</strong></li>
            ))}
          </ol>
        </section>

        <section className="case-study__close">
          <div><p>03 / Connection</p><h2>One person’s perspective. A wider product practice.</h2></div>
          <div><Link className="button button--quiet" href="/contact">Start a build inquiry <ActionMark direction="forward" /></Link></div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.companies)).replace(/</g, "\\u003c") }} />
    </>
  );
}
