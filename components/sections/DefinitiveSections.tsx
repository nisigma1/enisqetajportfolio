/* eslint-disable @next/next/no-img-element -- Local image variants are explicitly art-directed. */
import Link from "next/link";
import { identity, barberProject, malera, media } from "@/data/site";
import { PerspectiveLens } from "@/components/markets/PerspectiveLens";
import { BuildNavigator } from "@/components/build/BuildNavigator";
import { ContactForm } from "@/components/forms/ContactForm";

function ChapterMark({ children }: { children: React.ReactNode }) {
  return <p className="chapter-mark">{children}</p>;
}

export function Hero() {
  return (
    <section id="index" className="hero" aria-labelledby="identity-title">
      <div className="hero-frame">
        <p className="hero-location">Kosovo · Independent practice</p>

        <h1 id="identity-title" className="hero-name">
          <span>Enis</span>
          <span>Qetaj</span>
        </h1>

        <figure className="hero-portrait">
          <span className="aperture-corner corner-nw" aria-hidden="true" />
          <span className="aperture-corner corner-ne" aria-hidden="true" />
          <span className="aperture-corner corner-sw" aria-hidden="true" />
          <span className="aperture-corner corner-se" aria-hidden="true" />
          <picture>
            <source media="(max-width: 599px)" srcSet={media.portrait.mobile.src} width={media.portrait.mobile.width} height={media.portrait.mobile.height} />
            <source media="(max-width: 1023px)" srcSet={media.portrait.tablet.src} width={media.portrait.tablet.width} height={media.portrait.tablet.height} />
            <img
              src={media.portrait.desktop.src}
              alt="Portrait of Enis Qetaj"
              width={media.portrait.desktop.width}
              height={media.portrait.desktop.height}
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1023px) 58vw, 42vw"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
          <figcaption>Enis Qetaj / Kosovo</figcaption>
        </figure>

        <ul className="hero-roles" aria-label="Professional roles">
          {identity.roles.slice(0, 3).map((role) => <li key={role}>{role}</li>)}
        </ul>

        <div className="hero-positioning">
          <p>I study the forces around a decision—then build useful digital products from what becomes clear.</p>
          <a className="text-link" href="#work">View selected work <span aria-hidden="true">↓</span></a>
        </div>

        <p className="hero-availability"><span aria-hidden="true" /> Available for selected freelance work</p>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="about chapter" aria-labelledby="about-title">
      <div className="about-opening">
        <ChapterMark>Perspective</ChapterMark>
        <h2 id="about-title">Research and building begin with the same act: <span>looking closely.</span></h2>
      </div>

      <div className="about-narrative">
        <p className="about-lead">I move between financial markets and digital products. In both, the visible answer is rarely enough.</p>
        <div className="about-copy">
          <p>In markets, I look past a single price move toward structure, fundamentals, liquidity, macro conditions, geopolitics and on-chain behavior.</p>
          <p>In product work, I use the same discipline: understand the real situation, remove what does not help, and give the useful part a clear form.</p>
        </div>
      </div>

      <dl className="about-facts">
        <div><dt>Foundation</dt><dd>Bachelor’s Degree in Marketing</dd><dd className="about-fact-meta">Completed</dd></div>
        <div><dt>In progress</dt><dd>Master’s in Banking and Finance</dd><dd className="about-fact-meta">First year</dd></div>
        <div><dt>Practice</dt><dd>Markets, research and digital products</dd><dd className="about-fact-meta">Kosovo</dd></div>
      </dl>

      <p className="about-close">The output changes. The working principle does not: <strong>context first, then form.</strong></p>
    </section>
  );
}

export function Markets() {
  return (
    <section id="markets" className="markets" aria-labelledby="markets-title">
      <div className="markets-inner">
        <header className="markets-heading">
          <ChapterMark>The wider lens</ChapterMark>
          <h2 id="markets-title">A price is a <span>signal.</span><br />Not the whole situation.</h2>
          <p>Markets move for many reasons. Add context one layer at a time and the shape of the question changes.</p>
        </header>
        <PerspectiveLens />
        <footer className="markets-footnote">
          <p>More context does not guarantee certainty. It improves the question.</p>
          <span>Research and educational context only. Not financial advice.</span>
        </footer>
      </div>
    </section>
  );
}

export function Work() {
  const bookingSteps = [
    ["01", "Service", "Choose the service needed."],
    ["02", "Barber", "Select from the available team."],
    ["03", "Date", "Find an available day."],
    ["04", "Time", "Choose a clear appointment slot."],
    ["05", "Details", "Confirm the customer information."],
  ] as const;

  return (
    <section id="work" className="work chapter" aria-labelledby="work-title">
      <header className="work-heading">
        <div>
          <ChapterMark>Selected proof / 01</ChapterMark>
          <h2 id="work-title">A real business.<br />A useful booking path.</h2>
        </div>
        <div className="work-summary">
          <p>Barber Brothers is a live bilingual web experience for a barber business in Fushë Kosovë—connecting brand, information and appointment booking.</p>
          <a className="text-link" href={barberProject.url} target="_blank" rel="noreferrer">Visit the live product <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a>
        </div>
      </header>

      <figure className="work-context-media">
        <img
          src={media.barber.exterior.src}
          alt="The Barber Brothers entrance in Fushë Kosovë"
          width={media.barber.exterior.width}
          height={media.barber.exterior.height}
          sizes="(max-width: 767px) calc(100vw - 40px), 62vw"
          loading="lazy"
          decoding="async"
        />
        <figcaption><strong>Context</strong><span>A digital product connected to a real place and real service.</span></figcaption>
      </figure>

      <div className="work-product">
        <div className="work-product-intro">
          <img src={media.barber.identity.src} alt="Barber Brothers brand mark" width={media.barber.identity.width} height={media.barber.identity.height} loading="lazy" decoding="async" />
          <div><ChapterMark>Verified live journey</ChapterMark><h3>Premium service.<br />No waiting.</h3><p>The live experience guides a customer from intent to a bookable appointment without making the path feel complicated.</p></div>
        </div>

        <section className="booking-proof" aria-labelledby="booking-proof-title">
          <div className="booking-proof-heading"><h3 id="booking-proof-title">Live booking flow, simplified</h3><small>Based on the verified live product</small></div>
          <ol>{bookingSteps.map(([number, title, note]) => <li key={title}><span>{number}</span><strong>{title}</strong><p>{note}</p></li>)}</ol>
          <a href={`${barberProject.url}booking`} target="_blank" rel="noreferrer">Open live booking <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a>
        </section>
      </div>

      <div className="work-environment">
        <figure><img src={media.barber.interior.src} alt="Interior of Barber Brothers" width={media.barber.interior.width} height={media.barber.interior.height} sizes="(max-width: 767px) calc(100vw - 40px), 42vw" loading="lazy" decoding="async" /><figcaption>Inside the business</figcaption></figure>
        <div><ChapterMark>Physical ↔ digital</ChapterMark><h3>The interface is only useful when it supports the experience around it.</h3><p>The product keeps the next decision visible: service, barber, date, time, then details. The real environment remains part of the identity—not background decoration.</p><a className="text-link" href={barberProject.url} target="_blank" rel="noreferrer">Experience Barber Brothers <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a></div>
      </div>
    </section>
  );
}

export function Build() {
  return (
    <section id="build" className="build chapter" aria-labelledby="build-title">
      <header className="build-heading">
        <ChapterMark>From need to useful form</ChapterMark>
        <h2 id="build-title">Start with what needs to become <span>clearer.</span></h2>
        <p>Technology comes after the situation is understood. Choose the sentence closest to the real need.</p>
      </header>
      <BuildNavigator />
      <ol className="build-process" aria-label="Working process"><li>Understand</li><li>Shape</li><li>Design</li><li>Build</li><li>Refine</li></ol>
    </section>
  );
}

export function Malera() {
  return (
    <section className="malera chapter" aria-labelledby="malera-title">
      <div className="malera-bridge">
        <ChapterMark>When the problem needs a wider practice</ChapterMark>
        <div className="malera-relation" role="group" aria-label="Relationship between Enis Qetaj and Malera Studio">
          <div><span>Personal practice</span><strong>Enis Qetaj</strong><p>Perspective, research and independent product work.</p></div>
          <span className="malera-becomes">becomes</span>
          <div><span>Professional practice</span><strong>Malera Studio</strong><p>Websites, applications, AI tools and automation.</p></div>
        </div>
      </div>
      <div className="malera-close">
        <h2 id="malera-title">The person stays visible.<br />The practice scales with the problem.</h2>
        <div><p>{malera.line}</p><a className="text-link" href={malera.url} target="_blank" rel="noreferrer">Visit Malera Studio <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a></div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="contact chapter" aria-labelledby="contact-title">
      <header className="contact-heading">
        <ChapterMark>Start a conversation</ChapterMark>
        <h2 id="contact-title">Bring the context.<br /><span>We’ll find the useful form.</span></h2>
      </header>

      <div className="contact-frame">
        <aside className="contact-direct" aria-label="Direct contact details">
          <strong>{identity.name}</strong>
          <span>{identity.location}</span>
          <a href={`mailto:${identity.email}`}>{identity.email}</a>
          <a href={identity.phoneHref}>{identity.phone}</a>
          <a href={malera.url} target="_blank" rel="noreferrer">Malera Studio ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
        </aside>
        <ContactForm />
      </div>

      <p className="contact-signature">Context first. Then build.</p>
    </section>
  );
}

export function QuietArchive() {
  return <Link className="text-link" href="/work">Selected archive <span aria-hidden="true">↗</span></Link>;
}
