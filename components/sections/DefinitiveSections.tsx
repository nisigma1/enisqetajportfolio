/* eslint-disable @next/next/no-img-element -- Responsive local assets are explicitly art-directed. */
import Link from "next/link";
import { identity, barberProject, malera, media } from "@/data/site";
import { PerspectiveLens } from "@/components/markets/PerspectiveLens";
import { BuildNavigator } from "@/components/build/BuildNavigator";
import { ContactForm } from "@/components/forms/ContactForm";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Hero() {
  return <section id="index" className="hero" aria-labelledby="identity-title">
    <div className="hero-topline"><span>Independent portfolio</span><span>Kosovo · 2026</span><span><i /> Available for selected freelance projects</span></div>
    <div className="hero-composition">
      <div className="hero-copy">
        <Eyebrow>Markets / research / digital products</Eyebrow>
        <h1 id="identity-title"><span>Enis</span><strong>Qetaj</strong></h1>
        <ul className="hero-roles" aria-label="Professional roles"><li>Crypto Trader</li><li>Financial Markets Researcher</li><li>AI Product Builder</li></ul>
        <p className="hero-statement">I study the forces around a decision—then build the tools that make those decisions clearer.</p>
        <div className="hero-actions"><a className="button button-primary" href="#work">View selected work <b>↓</b></a><a className="button button-quiet" href="#contact">Start a conversation ↗</a></div>
      </div>
      <picture className="hero-portrait">
        <source media="(max-width: 639px)" srcSet={media.portrait.mobile.src} />
        <source media="(max-width: 1023px)" srcSet={media.portrait.tablet.src} />
        <img src={media.portrait.desktop.src} alt="Portrait of Enis Qetaj" width={media.portrait.desktop.width} height={media.portrait.desktop.height} fetchPriority="high" decoding="async" />
      </picture>
      <aside className="hero-principle"><span>Working principle</span><p>Perspective changes the picture.</p></aside>
    </div>
  </section>;
}

export function About() {
  return <section id="about" className="about section" aria-labelledby="about-title">
    <Eyebrow>A human working perspective</Eyebrow>
    <div className="about-heading"><h2 id="about-title">Markets sharpen the question. Building gives it form.</h2><p>Enis moves between research and product work with the same habit: look beyond the obvious signal, understand the situation, then make the next decision clearer.</p></div>
    <div className="about-thread">
      <article><span>What he studies</span><h3>The system around the move.</h3><p>Crypto markets, structure, fundamentals, liquidity, macroeconomics, policy, geopolitics and on-chain behavior.</p></article>
      <article><span>What he builds</span><h3>Useful tools for real decisions.</h3><p>AI applications, websites, web products, bots, automation and interfaces for research or complex information.</p></article>
      <article><span>What grounds it</span><h3>Marketing, finance and curiosity.</h3><p>Bachelor&apos;s degree in Marketing. First year of a Master&apos;s in Banking and Finance. Football remains the off-screen reset.</p></article>
    </div>
  </section>;
}

export function Markets() {
  return <section id="markets" className="markets context-section" aria-labelledby="markets-title">
    <div className="context-lens-shell">
      <header className="context-editorial"><Eyebrow>The wider lens</Eyebrow><h2 id="markets-title">Price begins the question. Context changes the answer.</h2><p>Move through seven layers. Each one changes the frame without pretending to predict the market.</p><div><span>Research practice</span><strong>One signal becomes a more coherent view.</strong></div></header>
      <PerspectiveLens />
    </div>
    <p className="context-disclaimer">Research and educational context only. Not financial advice.</p>
  </section>;
}

export function Work() {
  return <section id="work" className="work section" aria-labelledby="work-title">
    <div className="work-heading"><div><Eyebrow>Selected proof</Eyebrow><h2 id="work-title">Barber Brothers turns discovery into a direct booking journey.</h2></div><div className="work-intro"><p>A live bilingual web experience for a real barber business in Fushë Kosovë.</p><a className="button project-cta" href={barberProject.url} target="_blank" rel="noreferrer">Visit live site ↗</a></div></div>
    <div className="project-stage">
      <figure className="project-primary"><img src={media.barber.interior.src} alt="Barber Brothers interior in Fushë Kosovë" width={media.barber.interior.width} height={media.barber.interior.height} loading="lazy" decoding="async" /><figcaption><span>Barber Brothers</span><span>Interior / Fushë Kosovë</span></figcaption></figure>
      <aside className="project-identity"><img src={media.barber.identity.src} alt="Barber Brothers brand mark" width={media.barber.identity.width} height={media.barber.identity.height} loading="lazy" decoding="async" /><p>Premium service.<br /><em>No waiting.</em></p><span>Brand information, barber selection and a direct appointment flow.</span></aside>
      <div className="project-facts"><span>What the live experience supports</span><ul>{barberProject.knownFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
    </div>
    <div className="booking-story">
      <figure className="booking-image"><img src={media.barber.chair.src} alt="Barber Brothers chair and interior detail" width={media.barber.chair.width} height={media.barber.chair.height} loading="lazy" decoding="async" /><figcaption>Space and identity</figcaption></figure>
      <div className="booking-copy"><Eyebrow>Booking without friction</Eyebrow><h3>Choose the barber. Choose the service. Find the time.</h3><p>The flow keeps the next action obvious and gives the live product—not a decorative mockup—the final word.</p><a className="button button-inverse" href={barberProject.url} target="_blank" rel="noreferrer">Visit live site ↗</a></div>
      <figure className="booking-detail"><img src={media.barber.exterior.src} alt="Barber Brothers exterior entrance" width={media.barber.exterior.width} height={media.barber.exterior.height} loading="lazy" decoding="async" /><figcaption>Fushë Kosovë</figcaption></figure>
    </div>
  </section>;
}

export function Malera() {
  return <section id="studio" className="malera section" aria-labelledby="malera-title">
    <Eyebrow>Professional building practice</Eyebrow>
    <div className="malera-bridge"><div><span>Enis Qetaj</span><p>Person<br />Markets<br />Research<br />Independent thinking</p></div><i aria-hidden="true">→</i><div><span>Malera Studio</span><p>Websites<br />Applications<br />AI tools<br />Automation</p></div></div>
    <div className="malera-close"><h2 id="malera-title">The person stays visible. The practice scales with the problem.</h2><div><p>{malera.line}</p><a className="button studio-cta" href={malera.url} target="_blank" rel="noreferrer">Visit Malera Studio ↗</a></div></div>
  </section>;
}

export function Build() {
  return <section id="build" className="build section" aria-labelledby="build-title">
    <div className="build-heading"><div><Eyebrow>From need to useful form</Eyebrow><h2 id="build-title">Start with what needs to change.</h2></div><p>The technology comes after the situation is understood.</p></div>
    <BuildNavigator />
  </section>;
}

export function Contact() {
  return <section id="contact" className="contact section" aria-labelledby="contact-title">
    <div className="contact-heading"><Eyebrow>Start a conversation</Eyebrow><h2 id="contact-title">Have a real problem worth solving?</h2><p>Share the situation in a few lines. If there is a useful fit, the next step is a direct conversation with Enis.</p></div>
    <div className="contact-grid"><div className="contact-direct"><strong>Enis Qetaj</strong><span>Kosovo · Independent freelancer</span><a href={`mailto:${identity.email}`}>{identity.email}</a><a href={identity.phoneHref}>{identity.phone}</a></div><ContactForm /></div>
  </section>;
}

export function QuietArchive() { return <Link className="quiet-archive" href="/work">Selected archive ↗</Link>; }
