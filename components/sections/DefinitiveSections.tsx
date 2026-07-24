/* eslint-disable @next/next/no-img-element -- Art-directed, pre-compressed local media has explicit dimensions. */
import Link from "next/link";
import {
  barberProject,
  identity,
  malera,
  media,
  projectMedia,
  researchDomains,
  researchMethod,
} from "@/data/site";
import { PerspectiveLens } from "@/components/markets/PerspectiveLens";
import { BuildNavigator } from "@/components/build/BuildNavigator";
import { ContactForm } from "@/components/forms/ContactForm";

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="recon-kicker">{children}</p>;
}

export function Hero() {
  return (
    <section id="index" className="recon-hero" aria-labelledby="identity-title">
      <div className="recon-hero-grid">
        <p className="recon-hero-place">Kosovo / Independent practice</p>
        <p className="recon-hero-status"><span aria-hidden="true" /> Available for selected work</p>

        <h1 id="identity-title" className="recon-name">
          <span>Enis</span>
          <span>Qetaj</span>
        </h1>

        <figure className="recon-portrait">
          <picture>
            <source media="(max-width: 599px)" srcSet={media.portrait.mobile.src} width={media.portrait.mobile.width} height={media.portrait.mobile.height} />
            <source media="(max-width: 1023px)" srcSet={media.portrait.tablet.src} width={media.portrait.tablet.width} height={media.portrait.tablet.height} />
            <img
              src={media.portrait.desktop.src}
              alt="Portrait of Enis Qetaj"
              width={media.portrait.desktop.width}
              height={media.portrait.desktop.height}
              sizes="(max-width: 599px) 67vw, (max-width: 1023px) 52vw, 43vw"
              fetchPriority="high"
              decoding="sync"
            />
          </picture>
          <figcaption>Portrait / 2026</figcaption>
        </figure>

        <div className="recon-hero-disciplines" aria-label="Professional disciplines">
          <span>Crypto markets</span>
          <span>Research</span>
          <span>Geopolitics</span>
          <span>AI products</span>
        </div>

        <div className="recon-hero-statement">
          <p>I research what moves markets—from structure and liquidity to macro and geopolitics—then build useful digital products from what becomes clear.</p>
          <div>
            <a className="recon-button is-solid" href="#work">View selected work <span aria-hidden="true">↓</span></a>
            <a className="recon-button" href="#research">Explore research <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <p className="recon-hero-axis" aria-hidden="true">PERSON → RESEARCH → PERSPECTIVE → PROOF → BUILD</p>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="research" className="recon-section recon-research" aria-labelledby="research-title">
      <header className="recon-section-head">
        <Kicker>01 / Research practice</Kicker>
        <h2 id="research-title">A disciplined way to make <em>context legible.</em></h2>
        <p>Research is not a content category here. It is the method behind how I read markets, geopolitics and product problems.</p>
      </header>

      <div className="research-ledger">
        <div className="research-ledger-intro">
          <p>Working method</p>
          <strong>Question → evidence → contradiction → implication</strong>
          <span>No invented certainty. No single signal treated as the whole picture.</span>
        </div>
        <ol>
          {researchMethod.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.note}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="research-domains">
        <Kicker>Research field</Kicker>
        <ul>{researchDomains.map((domain) => <li key={domain}>{domain}</li>)}</ul>
        <div>
          <p>Education</p>
          <strong>Bachelor’s in Marketing <span>Completed</span></strong>
          <strong>Master’s in Banking and Finance <span>First year in progress</span></strong>
        </div>
      </div>

      <div className="research-archive-note">
        <span>Research archive</span>
        <p>Notes will be published when the evidence, sourcing and argument are ready. The archive structure is prepared; no placeholder articles are presented as work.</p>
        <Link href="/research">Open the research framework <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}

export function Markets() {
  return (
    <section id="markets" className="recon-markets" aria-labelledby="markets-title">
      <div className="recon-markets-inner">
        <header className="recon-markets-head">
          <Kicker>02 / Context Atlas</Kicker>
          <h2 id="markets-title">A price is a <em>signal.</em><br />Not the whole situation.</h2>
          <p>Expand the field one evidence layer at a time. Geopolitics enters from outside the original market frame and can redraw it.</p>
        </header>
        <PerspectiveLens />
        <footer className="recon-markets-foot">
          <p>More context does not guarantee certainty. It improves the question.</p>
          <span>Research and educational context only. Not financial advice.</span>
        </footer>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="recon-section recon-work" aria-labelledby="work-title">
      <header className="recon-section-head work-head">
        <Kicker>03 / Selected proof</Kicker>
        <h2 id="work-title">A real service.<br /><em>A clearer path to booking.</em></h2>
        <p>Barber Brothers is presented as a case study—not a decorative gallery. The live product connects brand, information and a direct appointment journey.</p>
      </header>

      <div className="case-index" aria-label="Case study chapters">
        {barberProject.chapters.map((chapter, index) => (
          <span key={chapter}><i>{String(index + 1).padStart(2, "0")}</i>{chapter}</span>
        ))}
      </div>

      <figure className="case-place">
        <img
          src={projectMedia[0].src}
          alt={projectMedia[0].alt}
          width={projectMedia[0].width}
          height={projectMedia[0].height}
          sizes="(max-width: 767px) calc(100vw - 32px), 58vw"
          loading="lazy"
          decoding="async"
        />
        <figcaption>
          <Kicker>Context / Fushë Kosovë</Kicker>
          <h3>The digital experience begins with a real business and a real customer decision.</h3>
          <p>{barberProject.description}</p>
        </figcaption>
      </figure>

      <div className="case-product">
        <div className="case-identity">
          <img src={media.barber.identity.src} alt="Barber Brothers brand mark" width={media.barber.identity.width} height={media.barber.identity.height} loading="lazy" decoding="async" />
          <Kicker>Product idea</Kicker>
          <h3>Premium service.<br />No waiting.</h3>
        </div>
        <div className="case-flow">
          <Kicker>Verified live journey</Kicker>
          <ol>
            {barberProject.bookingSteps.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
            ))}
          </ol>
          <a className="recon-button is-solid" href={`${barberProject.url}booking`} target="_blank" rel="noreferrer">Open live booking <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a>
        </div>
      </div>

      <div className="case-environment">
        <figure>
          <img src={projectMedia[1].src} alt={projectMedia[1].alt} width={projectMedia[1].width} height={projectMedia[1].height} sizes="(max-width: 767px) calc(100vw - 32px), 38vw" loading="lazy" decoding="async" />
          <figcaption>Real environment / project evidence</figcaption>
        </figure>
        <div>
          <Kicker>Interface ↔ environment</Kicker>
          <h3>The interface earns its place by making the next decision obvious.</h3>
          <p>Service, barber, date, time and customer details appear as one understandable sequence. The physical business stays part of the product identity.</p>
          <a className="recon-button" href={barberProject.url} target="_blank" rel="noreferrer">Visit Barber Brothers <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a>
        </div>
      </div>
    </section>
  );
}

export function Build() {
  return (
    <section id="build" className="recon-section recon-build" aria-labelledby="build-title">
      <header className="recon-section-head">
        <Kicker>04 / Building practice</Kicker>
        <h2 id="build-title">A need becomes useful when its <em>shape becomes clear.</em></h2>
        <p>Select the sentence closest to the real situation. The interaction shows how context changes the form of the product.</p>
      </header>
      <BuildNavigator />
      <ol className="build-sequence" aria-label="Working sequence">
        {["Understand", "Shape", "Design", "Build", "Refine"].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
      </ol>
    </section>
  );
}

export function Malera() {
  return (
    <section className="recon-section recon-malera" aria-labelledby="malera-title">
      <Kicker>05 / Natural extension</Kicker>
      <div className="malera-statement">
        <p>Independent perspective and research</p>
        <span aria-hidden="true">→</span>
        <p>Professional product practice</p>
      </div>
      <div className="malera-title">
        <h2 id="malera-title">Enis Qetaj becomes<br /><em>Malera Studio</em> when the problem needs a wider practice.</h2>
        <div><p>{malera.line}</p><a className="recon-button" href={malera.url} target="_blank" rel="noreferrer">Visit Malera Studio <span aria-hidden="true">↗</span><span className="visually-hidden"> (opens in a new tab)</span></a></div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="recon-section recon-contact" aria-labelledby="contact-title">
      <header className="recon-section-head">
        <Kicker>06 / Start a conversation</Kicker>
        <h2 id="contact-title">Bring the context.<br /><em>We’ll find the useful form.</em></h2>
      </header>
      <div className="contact-shell">
        <aside>
          <span>Direct contact</span>
          <strong>{identity.name}</strong>
          <p>{identity.location}<br />Independent practice</p>
          <a href={`mailto:${identity.email}`}>{identity.email}</a>
          <a href={identity.phoneHref}>{identity.phone}</a>
          <small>The form prepares an email draft. Nothing is sent or stored by this site.</small>
        </aside>
        <ContactForm />
      </div>
      <p className="contact-end">Context first. Then build.</p>
    </section>
  );
}

export function QuietArchive() {
  return <Link className="recon-button" href="/work">Selected archive <span aria-hidden="true">↗</span></Link>;
}
