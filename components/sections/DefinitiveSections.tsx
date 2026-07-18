/* eslint-disable @next/next/no-img-element -- Local responsive assets avoid an image runtime. */
import Link from "next/link";
import { identity, barberProject, malera } from "@/data/site";
import { PerspectiveLens } from "@/components/markets/PerspectiveLens";
import { BuildNavigator } from "@/components/build/BuildNavigator";
import { ContactForm } from "@/components/forms/ContactForm";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function Hero() {
  return <section id="index" className="hero" aria-labelledby="identity-title">
    <div className="hero-topline"><span>Independent portfolio</span><span>Kosovo · 2026</span><span><i /> Available for selected freelance work</span></div>
    <div className="hero-composition">
      <div className="hero-copy">
        <Eyebrow>Markets / research / digital products</Eyebrow>
        <h1 id="identity-title"><span>Enis</span> <strong>Qetaj</strong></h1>
        <p className="hero-statement">I study the forces around a decision — then build the tools that make those decisions clearer.</p>
        <div className="hero-actions"><a className="button button-primary" href="#work">View selected work <b>↓</b></a><a className="button button-quiet" href="#contact">Start a conversation ↗</a></div>
      </div>
      <picture className="hero-portrait">
        <img src="/images/enis/enis-original.jpeg" alt="Portrait of Enis Qetaj" width="1365" height="2048" fetchPriority="high" decoding="async" />
      </picture>
      <ul className="hero-roles" aria-label="Professional roles"><li>Crypto Trader</li><li>Financial Markets Researcher</li><li>AI Product Builder</li></ul>
      <p className="hero-coordinate"><span>01</span> Context changes the picture.</p>
    </div>
  </section>;
}

export function About() {
  return <section id="about" className="about section" aria-labelledby="about-title">
    <Eyebrow>01 / A working perspective</Eyebrow>
    <div className="about-heading"><h2 id="about-title">Two disciplines. One way of thinking.</h2><p>Markets taught Enis to question the visible signal. Building taught him to turn that question into something people can use.</p></div>
    <div className="about-thread">
      <article><span>Markets</span><h3>Reading the system around the move.</h3><p>Crypto, market structure, fundamentals, liquidity, macroeconomics, policy, geopolitics and on-chain behavior.</p></article>
      <article><span>Building</span><h3>Giving useful ideas a working form.</h3><p>AI applications, websites, web products, bots, automation and interfaces for research or decisions.</p></article>
      <article><span>Learning</span><h3>Marketing, then finance.</h3><p>Bachelor&apos;s degree in Marketing. First year of a Master&apos;s degree in Banking and Finance. Football remains the off-screen reset.</p></article>
    </div>
  </section>;
}

export function Markets() {
  return <section id="markets" className="markets context-section" aria-labelledby="markets-title"><div className="context-lens-shell"><header className="context-editorial"><Eyebrow>02 / Context lens</Eyebrow><h2 id="markets-title">Price is where the question starts.</h2><p>Build the picture one layer at a time. The meaning of a move changes as its context becomes visible.</p><div><span>Markets move.</span><strong>Context explains why.</strong></div></header><PerspectiveLens /></div><p className="context-disclaimer">Research and education only. Not financial advice.</p></section>;
}

export function Work() {
  return <section id="work" className="work section" aria-labelledby="work-title">
    <div className="work-heading"><div><Eyebrow>03 / Selected proof</Eyebrow><h2 id="work-title">A real booking journey, built for a real business.</h2></div><p>Barber Brothers is a live web experience with a direct path from service discovery to appointment booking.</p></div>
    <div className="work-visuals">
      <figure className="work-main"><img src="/images/barber/space-1.webp" alt="Barber Brothers interior in Fushë Kosovë" width="1023" height="1534" loading="lazy" decoding="async" /><figcaption><span>Barber Brothers</span><span>Interior / Fushë Kosovë</span></figcaption></figure>
      <div className="work-product">
        <div className="product-address"><span>barberbrothers.style</span><span>Live booking experience</span></div>
        <div className="product-browser" aria-hidden="true"><div className="product-browser-bar"><span /><span /><span /><b>Book now</b></div><div className="product-browser-body"><small>BARBER BROTHERS</small><strong>Choose your<br />appointment.</strong><div><span>Service</span><span>Barber</span><span>Date &amp; time</span></div></div></div>
        <div className="product-copy"><p>Premium service.<br />No waiting.</p><span>Service / barber / date / time</span></div>
      </div>
      <aside className="work-note"><Eyebrow>What it needed</Eyebrow><p>{barberProject.description}</p><ul>{barberProject.knownFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></aside>
    </div>
    <div className="booking-story"><figure className="booking-image"><img src="/images/barber/space-2.webp" alt="Barber Brothers chair and interior detail" width="1024" height="1461" loading="lazy" decoding="async" /><figcaption>Designed for the room, not a template.</figcaption></figure><div className="booking-copy"><Eyebrow>Booking, without friction</Eyebrow><h3>Choose the service. Choose the barber. Find the time.</h3><p>The booking flow stays focused so the next step is always obvious.</p><a className="button button-inverse" href={barberProject.url} target="_blank" rel="noreferrer">Visit live site ↗</a></div><figure className="booking-detail"><img src="/images/barber/space-3.webp" alt="Barber Brothers exterior entrance" width="1024" height="1024" loading="lazy" decoding="async" /><figcaption>Fushë Kosovë</figcaption></figure></div>
  </section>;
}

export function Malera() {
  return <section id="studio" className="malera section" aria-labelledby="malera-title">
    <Eyebrow>04 / The professional extension</Eyebrow>
    <div className="malera-grid"><div><span>Enis Qetaj</span><p>Person<br />Markets<br />Research<br />Independent thinking</p></div><i aria-hidden="true">→</i><div><span>Malera Studio</span><p>Websites<br />Applications<br />AI tools<br />Automation</p></div></div>
    <div className="malera-close"><h2 id="malera-title">The person stays visible. The practice scales with the problem.</h2><div><p>{malera.line}</p><a className="button button-inverse" href={malera.url} target="_blank" rel="noreferrer">Visit Malera Studio ↗</a></div></div>
  </section>;
}

export function Build() {
  return <section id="build" className="build section" aria-labelledby="build-title">
    <div className="build-heading"><div><Eyebrow>05 / From a need to a useful form</Eyebrow><h2 id="build-title">Start with the situation, not the technology.</h2></div><p>A clean product decision comes after the real problem is understood.</p></div>
    <BuildNavigator />
  </section>;
}

export function Contact() {
  return <section id="contact" className="contact section" aria-labelledby="contact-title">
    <div className="contact-heading"><Eyebrow>06 / Conversation</Eyebrow><h2 id="contact-title">Have a real problem worth solving?</h2><p>Send a short note. If there is a good fit, the next step is a direct conversation.</p></div>
    <div className="contact-grid"><div className="contact-direct"><strong>Enis Qetaj</strong><a href={`mailto:${identity.email}`}>{identity.email}</a><a href={identity.phoneHref}>{identity.phone}</a><a href={malera.url} target="_blank" rel="noreferrer">Malera Studio ↗</a></div><ContactForm /></div>
  </section>;
}

export function QuietArchive() { return <Link className="quiet-archive" href="/work">Selected archive ↗</Link>; }
