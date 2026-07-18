/* eslint-disable @next/next/no-img-element -- Local, art-directed WebP assets keep imagery server-first and predictable. */
import Link from "next/link";
import { identity, barberProject, malera, problems } from "@/data/site";
import { PerspectiveLens } from "@/components/markets/PerspectiveLens";
import { ContactForm } from "@/components/forms/ContactForm";

function SectionBar({ index, label, note, light = false }: { index: string; label: string; note: string; light?: boolean }) {
  return <header className={`section-bar${light ? " section-bar-light" : ""}`}><span>{index}</span><strong>{label}</strong><p>{note}</p></header>;
}

export function Hero() {
  return (
    <section id="index" className="identity-hero" aria-labelledby="identity-title">
      <div className="hero-context"><span>Independent portfolio · Kosovo</span><span><i /> Available for selected projects</span></div>
      <div className="hero-stage hero-stage-v2">
        <div className="hero-identity">
          <p>Markets · Research · Digital products</p>
          <h1 id="identity-title" className="hero-name"><span>Enis</span><span>Qetaj</span></h1>
        </div>
        <picture className="hero-portrait">
          <source media="(max-width: 560px)" srcSet="/images/enis/enis-mobile.webp" />
          <source media="(max-width: 960px)" srcSet="/images/enis/enis-tablet.webp" />
          <img src="/images/enis/enis-desktop.webp" alt="Portrait of Enis Qetaj" width="1200" height="1500" fetchPriority="high" decoding="async" />
        </picture>
        <div className="hero-roles"><span>Professional identity</span><ul>{identity.roles.map((role) => <li key={role}>{role}</li>)}</ul></div>
        <div className="hero-intro"><p>I turn a wider view of markets, people and products into clear, useful digital work.</p><span>Enis Qetaj / Independent freelancer</span></div>
        <div className="hero-actions"><a className="primary-action" href="#work">View selected work <span>↓</span></a><a className="text-action" href="#contact">Start a conversation ↗</a></div>
      </div>
      <p className="hero-signature">Perspective changes the picture.</p>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="about-section section-shell" aria-labelledby="about-title">
      <SectionBar index="01" label="About" note="A person, not a profile summary." />
      <div className="about-lead"><h2 id="about-title">One person.<br />Two ways of <em>looking closer.</em></h2><p>Enis Qetaj is from Kosovo. His work moves between understanding markets and turning useful ideas into working digital form.</p></div>
      <div className="story-flow">
        <article><h3>Markets</h3><p>Crypto is the starting point. The reading extends into technical structure, fundamentals, global liquidity, macroeconomics, monetary policy, geopolitics and on-chain activity.</p></article>
        <article><h3>Building</h3><p>The same questions carry into products: what is the real problem, what context is missing, and what form would make the answer useful?</p></article>
        <article><h3>Character</h3><p>Ambitious, analytical and independent. Curious enough to keep learning—and to change his mind when the wider picture changes.</p></article>
      </div>
      <div className="education-ledger">
        <p>Education</p>
        {identity.education.map((item) => <article key={item.subject}><span>{item.degree}</span><h3>{item.subject}</h3><p>{item.status}</p></article>)}
        <aside><span>Outside the work</span><p>Football. A different kind of structure, movement and perspective.</p></aside>
      </div>
    </section>
  );
}

export function Markets() {
  return (
    <section id="markets" className="markets-section section-shell" aria-labelledby="markets-title">
      <SectionBar index="02" label="Markets" note="How Enis widens the frame." />
      <div className="markets-lead"><div><span>The wider lens</span><h2 id="markets-title">A chart is only<br />the <em>beginning.</em></h2></div><p>Move from one visible signal to a connected view of structure, capital, policy and behavior. No fake market data—only the relationships Enis considers.</p></div>
      <PerspectiveLens />
      <p className="market-disclaimer">Research and educational context only. Not financial advice.</p>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="work-section section-shell" aria-labelledby="work-title">
      <SectionBar index="03" label="Selected work" note="Proof before decoration." light />
      <div className="case-heading"><div><span>01 / Live project</span><h2 id="work-title">Barber Brothers</h2><p>{barberProject.category}</p></div><a className="project-action" href={barberProject.url} target="_blank" rel="noreferrer">Visit live site <span>↗</span></a></div>

      <div className="product-proof">
        <figure className="project-primary"><img src="/images/barber/space-1.webp" alt="Barber Brothers interior in Fushë Kosovë" width="1023" height="1534" loading="lazy" decoding="async" /><figcaption>Brotherspace / Fushë Kosovë</figcaption></figure>
        <div className="live-product" aria-label="Verified extract from the live Barber Brothers website">
          <div className="live-product-bar"><span>barberbrothers.style</span><span>Live product extract</span></div>
          <div className="live-product-body">
            <img src="/images/barber/hero-logo.webp" alt="Barber Brothers" width="720" height="480" loading="lazy" decoding="async" />
            <span>N°01 / Fushë Kosovë / 09:30—20:30</span>
            <h3>Premium service.<br />No waiting.</h3>
            <p>Precision cuts. Real appointments. No phone calls.</p>
            <a href="https://barberbrothers.style/booking" target="_blank" rel="noreferrer">Book appointment ↗</a>
          </div>
        </div>
        <div className="case-context"><p>{barberProject.description}</p><ul>{barberProject.knownFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
      </div>

      <div className="booking-proof">
        <div className="booking-interface" aria-label="Verified structure of the live Barber Brothers booking flow">
          <div className="booking-interface-head"><span>Live booking flow</span><span>No account / no phone call</span></div>
          <h3>Book online</h3>
          <div className="booking-steps"><span className="current">01 Service</span><span>02 Barber</span><span>03 Date</span><span>04 Time</span><span>05 Details</span></div>
          <div className="service-options" aria-label="Services shown on the live booking page"><p className="selected">Haircut <span>5€ · 30 min</span></p><p>Beard trim <span>2€ · 30 min</span></p><p>All-in-One Combo <span>15€ · 60 min</span></p></div>
          <div className="booking-summary"><span>Next step</span><strong>Choose barber</strong><a href="https://barberbrothers.style/booking" target="_blank" rel="noreferrer">Open live booking ↗</a></div>
        </div>
        <figure className="project-detail"><img src="/images/barber/space-2.webp" alt="Barber Brothers chair and interior detail" width="1024" height="1461" loading="lazy" decoding="async" /><figcaption>Physical identity / real space</figcaption></figure>
        <figure className="project-exterior"><img src="/images/barber/space-3.webp" alt="Exterior entrance of Barber Brothers" width="1024" height="1024" loading="lazy" decoding="async" /><figcaption>Entrance / Fushë Kosovë</figcaption></figure>
      </div>
      <div className="work-conversion"><p>Have something that needs the same clarity between identity and function?</p><a href="#contact">Tell me what you are working on <span>↘</span></a></div>
      <div className="future-work"><span>Next</span><p>More work is being documented.</p><Link href="/work">Open the work archive ↗</Link></div>
    </section>
  );
}

export function Build() {
  const process = ["Understand", "Shape", "Design", "Build", "Refine"];
  return (
    <section id="build" className="build-section section-shell" aria-labelledby="build-title">
      <SectionBar index="04" label="Build" note="Start with the human problem." />
      <div className="build-lead"><h2 id="build-title">The technology<br />comes <em>after the need.</em></h2><p>A website, application, bot or AI tool is only useful when it makes a real situation clearer, faster or easier.</p></div>
      <div className="problem-list">
        {problems.map((item, index) => <details key={item.problem} open={index === 0}><summary><span>0{index + 1}</span><strong>{item.problem}</strong><i>View response</i></summary><div><p>{item.response}</p><dl><dt>Useful form</dt><dd>{item.forms}</dd></dl></div></details>)}
      </div>
      <div className="build-process"><p>How the work moves</p><ol>{process.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol></div>
    </section>
  );
}

export function Malera() {
  return (
    <section id="studio" className="studio-section section-shell" aria-labelledby="studio-title">
      <SectionBar index="05" label="Malera Studio" note="The professional building practice." light />
      <div className="studio-relationship"><div><span>Enis Qetaj</span><p>Person<br />Markets<br />Research<br />Independent identity</p></div><i aria-hidden="true" /><div><span>Malera Studio</span><p>Websites<br />Applications<br />AI tools<br />Automation</p></div></div>
      <div className="studio-main"><div><span>Built from Kosovo</span><h2 id="studio-title">Malera<br />Studio</h2></div><div className="studio-copy"><p>{malera.line}</p><p>{malera.services}</p><a className="studio-action" href={malera.url} target="_blank" rel="noreferrer">Visit Malera Studio <span>↗</span></a></div></div>
      <div className="studio-clarity"><p>Enis is the person and perspective.</p><p>Malera is the vehicle for professional digital product work.</p></div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="contact-section section-shell" aria-labelledby="contact-title">
      <SectionBar index="06" label="Contact" note="Human to human." />
      <div className="contact-layout">
        <div className="contact-intro"><p className="availability"><i /> Available for selected freelance projects</p><h2 id="contact-title">Have something<br /><em>interesting in mind?</em></h2><p>Send a short note. If Enis can help, the next step can be a simple conversation.</p><div className="direct-links"><a href={`mailto:${identity.email}`}>{identity.email}</a><a href={identity.phoneHref}>{identity.phone}</a><a href={malera.url} target="_blank" rel="noreferrer">Malera Studio ↗</a></div></div>
        <ContactForm />
      </div>
    </section>
  );
}
