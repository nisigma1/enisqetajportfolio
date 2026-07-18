/* eslint-disable @next/next/no-img-element -- Art-directed, pre-compressed local crops are intentionally server-first. */
import Link from "next/link";
import { identity, barberProject, malera, problems } from "@/data/site";
import { PerspectiveLens } from "@/components/markets/PerspectiveLens";
import { ContactForm } from "@/components/forms/ContactForm";

export function Hero() {
  return (
    <section id="index" className="cover" aria-labelledby="cover-title">
      <div className="cover-rule" aria-hidden="true" />
      <p className="cover-issue">Independent portfolio<br />Issue 01 / 2026</p>
      <p className="cover-roles">Crypto Trader<br />Markets Researcher<br />AI Product Builder</p>
      <h1 id="cover-title"><span>Enis</span><span>Qetaj</span></h1>
      <picture className="cover-portrait">
        <source media="(max-width: 560px)" srcSet="/images/enis/enis-mobile.webp" />
        <source media="(max-width: 960px)" srcSet="/images/enis/enis-tablet.webp" />
        <img src="/images/enis/enis-desktop.webp" alt="Enis Qetaj" width="1200" height="1500" fetchPriority="high" />
      </picture>
      <div className="cover-thought"><span>01 / A personal note</span><p>I spend a lot of time trying to understand why things move. Then I build.</p></div>
      <a className="cover-action" href="#work"><span>View work</span><b>↓</b></a>
      <p className="cover-place">Based in Kosovo<br /><i /> Available for select projects</p>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="about chapter" aria-labelledby="about-title">
      <header className="chapter-head"><span>02 / About</span><p>Person before profile.</p></header>
      <div className="about-opening"><h2 id="about-title">Markets taught me<br />to <em>look twice.</em></h2><p>What moves first is rarely the whole explanation.</p></div>
      <div className="about-fragments">
        <article className="fragment fragment-intro"><span>A</span><p>Enis Qetaj is from Kosovo. He trades cryptocurrency markets and follows the wider financial forces around them.</p></article>
        <figure className="fragment-photo"><img src="/images/enis/enis-close.webp" alt="Close editorial crop of Enis Qetaj" width="800" height="800" loading="lazy" decoding="async" /><figcaption>Real person / real work</figcaption></figure>
        <article className="fragment fragment-method"><span>B</span><p>His reading moves between technical structure, fundamentals, global liquidity, macroeconomics, geopolitics and on-chain activity.</p></article>
        <article className="fragment fragment-making"><span>C</span><p>He also uses AI to turn ideas into websites, applications, bots and working systems.</p></article>
        <div className="fragment-education">
          {identity.education.map((item) => <div key={item.subject}><span>{item.degree}</span><strong>{item.subject}</strong><p>{item.status}</p></div>)}
        </div>
        <p className="fragment-character">Ambitious enough to keep moving.<br />Curious enough to keep changing his mind.</p>
        <div className="football-note" aria-label="Outside work, Enis follows football"><i /><i /><i /><i /><i /><small>4—3—3 / after hours</small></div>
      </div>
    </section>
  );
}

export function Markets() {
  return (
    <section id="markets" className="markets chapter" aria-labelledby="markets-title">
      <header className="chapter-head"><span>03 / Markets</span><p>How Enis looks at markets.</p></header>
      <div className="markets-intro"><h2 id="markets-title">Price is the beginning.<br /><em>Not the whole story.</em></h2><p>A single signal can be useful. A wider view makes it meaningful.</p></div>
      <PerspectiveLens />
      <p className="markets-note">Research and educational content only. Not financial advice.</p>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="work chapter" aria-labelledby="work-title">
      <header className="chapter-head chapter-head-light"><span>04 / Selected work</span><p>One real product, shown properly.</p></header>
      <div className="work-title-wrap"><p>Web Experience / Booking</p><h2 id="work-title"><span>Barber</span><span>Brothers</span></h2><a className="project-live" href={barberProject.url} target="_blank" rel="noreferrer">Visit live site <span>↗</span></a></div>
      <div className="project-spread">
        <figure className="project-image project-image-main"><img src="/images/barber/space-1.webp" alt="Barber Brothers interior with geometric ceiling lights" width="1023" height="1534" loading="lazy" decoding="async" /><figcaption>Brotherspace / Fushë Kosovë</figcaption></figure>
        <div className="project-copy"><p>{barberProject.description}</p><ul>{barberProject.knownFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
        <figure className="project-image project-image-detail"><img src="/images/barber/space-2.webp" alt="Barber Brothers chair and interior detail" width="1024" height="1461" loading="lazy" decoding="async" /><figcaption>Controlled detail / real space</figcaption></figure>
        <div className="booking-fragment" aria-label="A factual summary of the live booking journey"><span>Live booking journey</span><ol><li>Choose service</li><li>Choose barber</li><li>Choose date</li><li>Choose time</li><li>Confirm details</li></ol><a href="https://barberbrothers.style/booking" target="_blank" rel="noreferrer">Open booking ↗</a></div>
        <figure className="project-image project-image-exterior"><img src="/images/barber/space-3.webp" alt="Exterior entrance of Barber Brothers" width="1024" height="1024" loading="lazy" decoding="async" /><figcaption>Entrance / the physical brand</figcaption></figure>
        <figure className="project-mark"><img src="/images/barber/hero-logo.webp" alt="Barber Brothers brand mark" width="720" height="480" loading="lazy" decoding="async" /></figure>
      </div>
      <div className="project-close"><p>Have something similar in mind?</p><a href="#contact">Tell me about it <span>↘</span></a></div>
      <div className="more-work"><span>Next</span><p>More work is being documented.</p><Link href="/work">Open the archive ↗</Link></div>
    </section>
  );
}

export function Build() {
  return (
    <section id="build" className="build chapter" aria-labelledby="build-title">
      <header className="chapter-head"><span>05 / Build</span><p>Start with the problem.</p></header>
      <div className="build-intro"><h2 id="build-title">The useful form<br />comes <em>second.</em></h2><p>A website, bot or AI tool is only useful when it solves the right thing.</p></div>
      <div className="problem-map">
        {problems.map((item, index) => (
          <details key={item.problem} open={index === 0}>
            <summary><span>0{index + 1}</span><strong>“{item.problem}”</strong><i>Open</i></summary>
            <div><small>{item.group}</small><p>{item.response}</p><dl><dt>Useful forms</dt><dd>{item.forms}</dd></dl></div>
          </details>
        ))}
      </div>
      <div className="malera-transition">
        <div className="malera-kicker"><span>Personal work</span><i /> <span>Studio practice</span></div>
        <p className="malera-overline">The professional extension</p>
        <h3>Malera<br />Studio</h3>
        <div className="malera-copy"><p>{malera.line}</p><p>{malera.services}</p><a className="action-link action-link-light" href={malera.url} target="_blank" rel="noreferrer">Visit Malera Studio <span>↗</span></a></div>
      </div>
      <div className="build-cta"><p>Have a problem worth shaping?</p><a href="#contact">Discuss a project <span>↓</span></a></div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="contact chapter" aria-labelledby="contact-title">
      <header className="chapter-head"><span>06 / Contact</span><p>Person to person.</p></header>
      <div className="contact-grid">
        <div className="contact-intro"><p className="contact-available"><i /> Available for select projects</p><h2 id="contact-title">Have something<br /><em>worth talking about?</em></h2><p>Send a short note. If it makes sense, we can take it from there.</p></div>
        <ContactForm />
      </div>
      <div className="contact-direct"><div><span>Enis Qetaj</span><p>Crypto Trader<br />Financial Markets Researcher<br />AI Product Builder</p></div><div><span>Direct</span><a href={`mailto:${identity.email}`}>{identity.email}</a><a href={identity.phoneHref}>{identity.phone}</a></div><div><span>Studio</span><a href={malera.url} target="_blank" rel="noreferrer">Malera Studio ↗</a></div></div>
    </section>
  );
}
