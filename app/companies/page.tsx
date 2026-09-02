/* eslint-disable @next/next/no-img-element -- Local, pre-compressed project proof is rendered with explicit dimensions and native lazy loading. */
import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { Build, Malera } from "@/components/sections/DefinitiveSections";
import { BesianaPhotographyArtwork } from "@/components/showcase/BesianaPhotographyArtwork";
import { ActionMark } from "@/components/ui/ActionMark";
import { barberProject, besianaProject, hixhameProject, malera } from "@/data/site";
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
  const capabilities = [
    ["01", "Websites", "Focused public experiences and service journeys."],
    ["02", "Web applications", "Purpose-built interfaces for real workflows."],
    ["03", "AI products", "Useful AI systems shaped around a clear job."],
    ["04", "Automation", "Less repetitive work and clearer handoffs."],
    ["05", "AI agents", "Task-oriented agents with understandable boundaries."],
    ["06", "Digital systems", "Connected tools, content and operational flows."],
    ["07", "Bots", "Focused conversational and workflow utilities."],
    ["08", "Research interfaces", "Structured views for markets and complex information."],
  ] as const;
  const proof = [
    { project: barberProject, image: "/projects/barber-brothers/barber-brothers-cover.webp", alt: "Barber Brothers website and booking experience", width: 1600, height: 900 },
    { project: hixhameProject, image: "/projects/hixhame-tina/hixhame-tina-case-study.webp", alt: "Hixhame Tina responsive website case study", width: 1672, height: 941 },
    { project: besianaProject, image: null, alt: "Besiana Photography website preview", width: 0, height: 0 },
  ] as const;

  return (
    <>
      <InnerPageShell
        variant="malera"
        eyebrow="Digital building practice"
        title="Malera Studio"
        summary="Digital products, websites and AI systems built around real business needs."
        meta={["Founded by Enis Qetaj", "Digital product practice", "malera.studio"]}
      >
        <section className="inner-section malera-identity" aria-labelledby="malera-identity-title">
          <p className="inner-section__label">01 / Identity</p>
          <div>
            <h2 id="malera-identity-title">A wider practice for building useful systems.</h2>
            <p>{malera.line}</p>
          </div>
          <div>
            <p>Malera is the company expression of Enis’s digital-building work: understanding the business need, designing the right form and delivering a focused product.</p>
            <a className="button button--primary" href={malera.url} target="_blank" rel="noopener noreferrer">Visit malera.studio <ActionMark direction="external" /></a>
          </div>
        </section>

        <section className="inner-section malera-capabilities" aria-labelledby="malera-capabilities-title">
          <header className="inner-section__header">
            <p className="inner-section__label">02 / Capabilities</p>
            <h2 id="malera-capabilities-title">Different forms. One product discipline.</h2>
            <p>The medium follows the job: explain, automate, organize, connect or support a decision.</p>
          </header>
          <ol>
            {capabilities.map(([number, name, description]) => (
              <li key={name}><span>{number}</span><strong>{name}</strong><p>{description}</p></li>
            ))}
          </ol>
        </section>

        <Build sectionLabel="03 / How Malera works" headingId="companies-build-title" />

        <section className="inner-section malera-proof" aria-labelledby="malera-proof-title">
          <header className="inner-section__header">
            <p className="inner-section__label">04 / Selected proof</p>
            <h2 id="malera-proof-title">Real interfaces for real businesses.</h2>
            <p>Selected public work from this portfolio, shown with authentic project media.</p>
          </header>
          <ol>
            {proof.map(({ project, image, alt, width, height }, index) => (
              <li key={project.slug}>
                <Link href={`/work#${project.slug}`}>
                  <span>{String(index + 1).padStart(2, "0")} / {project.category}</span>
                  <strong>{project.title}</strong>
                  <figure>{project.slug === besianaProject.slug ? <BesianaPhotographyArtwork compact /> : <img src={image!} alt={alt} width={width} height={height} loading="lazy" decoding="async" />}</figure>
                  <span>View project <ActionMark direction="forward" /></span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <Malera sectionLabel="05 / Company relationship" headingId="companies-malera-title" />

        <section className="inner-section inner-final-cta malera-cta">
          <div><p className="inner-section__label">06 / Start</p><h2>Bring the need. Build the useful system.</h2></div>
          <div className="malera-cta__actions">
            <a className="button button--primary" href={malera.url} target="_blank" rel="noopener noreferrer">Visit Malera Studio <ActionMark direction="external" /></a>
            <Link className="button button--quiet" href="/contact?service=digital-project">Discuss a project <ActionMark direction="forward" /></Link>
          </div>
        </section>
      </InnerPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.companies)).replace(/</g, "\\u003c") }} />
    </>
  );
}
