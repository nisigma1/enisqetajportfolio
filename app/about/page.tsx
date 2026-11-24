import type { Metadata } from "next";
import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";
import { barberProject, buildCapabilities, cryptoEducation, hixhameProject, identity, malera, marketInterests, nisigmaOnChain } from "@/data/site";
import { duoBarProject } from "@/data/duo-bar";
import { StructuredData } from "@/components/seo/StructuredData";
import { baseStructuredData, routeSeo } from "@/lib/seo";

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
        <header className="route-hero">
          <p>NISIGMA</p>
          <h1>About Enis Qetaj</h1>
          <div>
            <p>Enis Qetaj, known online as NISIGMA, is a Kosovo-based financial-markets researcher, crypto trader and founder of Malera Studio. He studies markets through technical and fundamental analysis, liquidity, macroeconomics and on-chain data. Through Malera Studio, he builds AI automations and web applications for businesses.</p>
            <span>Kosovo / Markets / AI Products / Malera Studio</span>
          </div>
        </header>

        <section className="route-section route-domains" aria-labelledby="about-positioning">
          <div>
            <p>01 / Positioning</p>
            <h2 id="about-positioning">Research, markets and useful digital products.</h2>
          </div>
          <ul>
            {identity.roles.map((role) => <li key={role}>{role}</li>)}
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
            <p>06 / Selected work and contact</p>
            <h2>Selected projects</h2>
          </div>
          <div>
            <p>I created Nisigma OnChain on CryptoQuant to bring the data I use for crypto market research into one dashboard. At Malera Studio, my work includes the Barber Brothers booking flow and <Link className="portfolio-text-link" href={`/work/${duoBarProject.slug}`}>Malera POS for DUO Bar</Link>.</p>
            <Link className="button button--primary" href={nisigmaOnChain.path}>Explore Nisigma OnChain <ActionMark direction="forward" /></Link>
            <Link className="button button--quiet" href={`/work/${barberProject.slug}`}>View Barber Brothers <ActionMark direction="forward" /></Link>
            <Link className="button button--quiet" href={`/work/${hixhameProject.slug}`}>View Hixhame Tina <ActionMark direction="forward" /></Link>
            <Link className="button button--quiet" href="/contact">Contact Enis Qetaj <ActionMark direction="forward" /></Link>
          </div>
        </section>
      </main>
      <StructuredData data={structuredData} />
    </>
  );
}
