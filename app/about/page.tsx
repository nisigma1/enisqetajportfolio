import type { Metadata } from "next";
import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";
import { buildCapabilities, cryptoEducation, hixhameProject, identity, malera, marketInterests, nisigmaOnChain } from "@/data/site";
import { duoBarProject } from "@/data/duo-bar";
import { StructuredData } from "@/components/seo/StructuredData";
import { baseStructuredData, routeSeo } from "@/lib/seo";
import styles from "./About.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.about.title,
  description: routeSeo.about.description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: routeSeo.about.title,
    description: routeSeo.about.description,
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: routeSeo.about.title,
    description: routeSeo.about.description,
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  const structuredData = baseStructuredData(routeSeo.about);

  return (
    <>
      <main id="main" className="route-page about-route">
        <header className={styles.intro}>
          <h1>Enis Qetaj</h1>
          <p>Enis Qetaj, known online as Nisigma (<a href={identity.social.find((profile) => profile.label === "X")?.href}>@N1sigma</a>), is the founder of <a href={malera.url}>Malera Studio</a> in Kosovo. He builds websites, applications and AI automations and researches financial markets using on-chain data.</p>
        </header>

        <section className={styles.proofs} aria-labelledby="about-proofs">
          <h2 id="about-proofs">Selected projects</h2>
          <div className={styles.grid}>
            <article className={styles.proof}>
              <h3>Barber Brothers</h3>
              <p>Clients needed a way to book online, from choosing a service and barber to picking a date and available time.</p>
              <p>I helped build the booking flow as part of the Malera Studio team.</p>
              <a className="portfolio-text-link" href="https://barberbrothers.style/booking">Try the live booking flow</a>
            </article>
            <article className={styles.proof}>
              <h3>DUO Bar POS</h3>
              <p>DUO Bar needed a way to track tables and orders during service, including when offline.</p>
              <p>I worked on the DUO Bar application built on Malera POS.</p>
              <Link className="portfolio-text-link" href={`/work/${duoBarProject.slug}`}>See the system at DUO Bar</Link>
              <figure>
                {/* Use the existing optimized venue photo without the image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={duoBarProject.photos.orders.small} width={duoBarProject.photos.orders.width} height={duoBarProject.photos.orders.height} alt={duoBarProject.photos.orders.alt} loading="lazy" decoding="async" />
                <figcaption>The floor plan and order panel on the DUO Bar terminal.</figcaption>
              </figure>
            </article>
            <article className={styles.proof}>
              <h3>Nisigma OnChain</h3>
              <p>I wanted one place to see how active blockchain networks are, how investors behave and where capital is moving.</p>
              <p>I built a public CryptoQuant dashboard that brings those metrics together.</p>
              <a className="portfolio-text-link" href={nisigmaOnChain.dashboardUrl}>Open the dashboard on CryptoQuant</a>
              <Link className="portfolio-text-link" href={nisigmaOnChain.path}>Read my methodology</Link>
            </article>
          </div>
          <ul className={styles.profiles} aria-label="Enis Qetaj profiles">
            {identity.social.filter((profile) => profile.label === "LinkedIn").map((profile) => (
              <li key={profile.label}><a href={profile.href}>{profile.label}</a></li>
            ))}
            <li><a href={identity.githubUrl}>GitHub</a></li>
          </ul>
        </section>

        <section className="case-study__chapter">
          <div><p>02 / Practice</p><h2>Malera Studio connects the build side.</h2></div>
          <div>
            <p>Enis also builds websites, AI applications, automation systems, bots, AI agents and digital products through Malera Studio.</p>
            <p><a className="button button--quiet" href={malera.url} target="_blank" rel="noopener noreferrer">Visit Malera Studio <ActionMark direction="external" /></a></p>
          </div>
        </section>

        <section className="route-section route-domains" aria-labelledby="about-research">
          <div>
            <p>03 / Research areas</p>
            <h2 id="about-research">What Enis Qetaj studies.</h2>
          </div>
          <ul>
            {marketInterests.map((area) => <li key={area}>{area}</li>)}
          </ul>
        </section>

        <section className="route-section route-domains" aria-labelledby="about-build">
          <div>
            <p>04 / Digital-building areas</p>
            <h2 id="about-build">What Enis Qetaj builds.</h2>
          </div>
          <ul>
            {buildCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
        </section>

        <section className="education-profile" aria-labelledby="education-title">
          <header>
            <p>05 / Education</p>
            <h2 id="education-title">Formal education and applied market learning.</h2>
          </header>
          <div className="education-profile__degrees">
            <ul aria-label="Formal education">
              {identity.education.map((item) => (
                <li key={`${item.degree}-${item.subject}`}>{item.degree} in {item.subject} — {item.status}</li>
              ))}
            </ul>
            <article className="education-profile__credential">
              <div>
                <p>Completed curriculum</p>
                <span>{cryptoEducation.provider}</span>
              </div>
              <h3>{cryptoEducation.credential}</h3>
              <p>{cryptoEducation.summary}</p>
              <ul aria-label="Course areas">
                {cryptoEducation.focus.map((area) => <li key={area}>{area}</li>)}
              </ul>
            </article>
          </div>
        </section>

        <section className="case-study__close">
          <div>
            <p>06 / Contact</p>
            <h2>More work and contact</h2>
          </div>
          <div>
            <Link className="button button--quiet" href={`/work/${hixhameProject.slug}`}>View Hixhame Tina <ActionMark direction="forward" /></Link>
            <Link className="button button--quiet" href="/contact">Contact Enis Qetaj <ActionMark direction="forward" /></Link>
          </div>
        </section>
      </main>
      <StructuredData data={structuredData} />
    </>
  );
}
