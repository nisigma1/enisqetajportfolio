/* eslint-disable @next/next/no-img-element -- Local art uses native responsive sources. */
import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageStyles } from "@/components/layout/InnerPageStyles";
import { Malera } from "@/components/sections/DefinitiveSections";
import { duoBarProject } from "@/data/duo-bar";
import { barberProject } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";
import styles from "./StudioPage.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.companies.title,
  description: routeSeo.companies.description,
  alternates: { canonical: "/companies" },
  openGraph: { type: "website", url: "/companies", title: routeSeo.companies.title, description: routeSeo.companies.description },
  twitter: { card: "summary", title: routeSeo.companies.title, description: routeSeo.companies.description },
};

const capabilities = [
  {
    name: "Websites and booking",
    description: "Clients choose a service, barber and time online, in Albanian or English.",
    mark: "calendar",
    project: barberProject,
  },
  {
    name: "Business software",
    description: "DUO Bar staff take table orders and track stock, even when the internet is down.",
    mark: "terminal",
    project: duoBarProject,
  },
  {
    name: "AI and automation",
    description: "I build tools and AI agents that sort inquiries or move information between apps.",
    mark: "workflow",
    project: null,
  },
] as const;

const inquiry = "/contact?service=digital-project#contact-form";
const feature = "/projects/duo-bar/malera-pos-at-duo";
const featureSizes = "(max-width: 767px) calc(100vw - 2rem), (max-width: 1312px) 48vw, 36rem";

function ServiceMark({ mark }: { mark: (typeof capabilities)[number]["mark"] }) {
  return (
    <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {mark === "calendar" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-12 5 2 2 4-4" /></>}
      {mark === "terminal" && <><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8 20h8m-4-3.5V20M7 9l2 2-2 2m6 0h4" /></>}
      {mark === "workflow" && <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h9v5m0 4v-4m-3 0 3 3 3-3M6 9v9h5" /></>}
    </svg>
  );
}

export default function CompaniesPage() {
  return (
    <>
      <main id="main" className={`inner-page ${styles.page}`}>
        <InnerPageStyles />
        <header className={styles.hero}>
          <div className={styles.intro}>
            <div className={styles.byline}>
              <img src="/images/education/malera-studio-logo.webp" width={384} height={384} alt="" decoding="async" className={styles.brand} />
              <p className="portfolio-kicker">Independent digital product studio</p>
            </div>
            <h1>Malera Studio</h1>
            <p className={styles.lede}>Online booking. Offline POS.</p>
            <p className={styles.summary}>I build websites, business software and automations that fit how a team works.</p>
            <div className={styles.actions}>
              <Link className="button button--primary" href={inquiry}>Discuss a project</Link>
              <a className="portfolio-text-link" href="#build">Explore services</a>
            </div>
          </div>

          <figure className={styles.feature}>
            <picture className={styles.featurePhoto}>
              <source type="image/avif" srcSet={`${feature}-720.avif 720w, ${feature}-1440.avif 1440w`} sizes={featureSizes} />
              <img src={`${feature}-720.webp`} srcSet={`${feature}-720.webp 720w, ${feature}-1440.webp 1440w`} sizes={featureSizes} width={720} height={520} alt="Malera POS terminal at DUO Bar with a visual floor plan and order panel" fetchPriority="high" decoding="async" />
            </picture>
            <figcaption className={styles.featureCaption}>
              <div>
                <p className={styles.featureKicker}>Built for DUO Bar</p>
                <p className={styles.featureName}>Malera POS</p>
              </div>
              <Link className="portfolio-text-link" href={`/work/${duoBarProject.slug}`} aria-label="See it in use at DUO Bar">See it in use</Link>
            </figcaption>
          </figure>
        </header>

        <section id="build" className={styles.services} aria-labelledby="malera-services-title">
          <header className={styles.serviceHeading}>
            <h2 id="malera-services-title">What Malera builds</h2>
          </header>
          <ul className={styles.serviceList}>
            {capabilities.map(({ name, description, mark, project }) => (
              <li className={styles.service} key={name}>
                <span className={styles.serviceMark}><ServiceMark mark={mark} /></span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  {project && <Link className="portfolio-text-link" href={`/work/${project.slug}`}>{project.title} case study</Link>}
                </div>
              </li>
            ))}
          </ul>
          <p><Link className="portfolio-text-link" href={routeSeo.build.path}>How I build AI products and automations</Link></p>
          <Link className="portfolio-text-link" href="/work">See the case studies</Link>
        </section>

        <div className={`inner-page inner-page--malera ${styles.founderRelationship}`}>
          <Malera headingId="companies-malera-title" />
        </div>

        <section className={styles.inquiry} aria-labelledby="studio-inquiry-title">
          <div>
            <h2 id="studio-inquiry-title">Have a project in mind?</h2>
            <p>Tell me what your customers or staff need to do.</p>
          </div>
          <Link className="button button--primary" href={inquiry}>Tell me about it</Link>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.companies)).replace(/</g, "\\u003c") }} />
    </>
  );
}
