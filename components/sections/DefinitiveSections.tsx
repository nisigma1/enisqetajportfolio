/* eslint-disable @next/next/no-img-element -- The portrait uses responsive, pre-compressed local art direction with explicit dimensions. */
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
import { ContextCircuit } from "@/components/markets/ContextCircuit";
import { BuildNavigator } from "@/components/build/BuildNavigator";
import { ContactForm } from "@/components/forms/ContactForm";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ActionMark } from "@/components/ui/ActionMark";
import { LetterGlitch } from "@/components/ui/LetterGlitch";
import { PixelCanvas } from "@/components/ui/PixelCanvas";
import { TextRepel } from "@/components/ui/TextRepel";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function PortfolioPixelField() {
  return (
    <PixelCanvas
      className="portfolio-pixel-field"
      gap={7}
      speed={0.06}
      variant="trail"
      colors={["#315df2", "#5f7cff", "#819cff", "#aab9f5"]}
      ambientOnTouch={false}
      maxDpr={1}
      radius={124}
      coarseRadius={92}
      coarseFps={30}
      aria-hidden="true"
    />
  );
}

export function Hero() {
  const focus = [
    ["01", "Crypto markets"],
    ["02", "Financial market research"],
    ["03", "Macro & geopolitics"],
    ["04", "AI product building"],
  ] as const;

  return (
    <section id="index" className="dispatch-hero" aria-labelledby="identity-title">
      <div className="dispatch-hero__meta">
        <p>Kosovo <span>/</span> Independent practice</p>
        <p><span aria-hidden="true" /> Open for selected projects</p>
      </div>

      <div className="dispatch-hero__primary">
        <div className="dispatch-hero__identity">
          <p className="dispatch-hero__issue"><span>The Research Dispatch</span><span>01 / 2026</span></p>
          <h1 id="identity-title">
            <TextRepel
              text="Enis Qetaj"
              className="dispatch-hero__repel"
              radius={168}
              strength={46}
              stiffness={190}
              damping={16}
              mass={0.38}
              keyboardInteractive={false}
              disableOnCoarsePointer={false}
            />
          </h1>
        </div>

        <figure className="author-artifact">
          <picture>
            <source media="(max-width: 767px)" srcSet={media.portrait.mobile.src} width={media.portrait.mobile.width} height={media.portrait.mobile.height} />
            <source media="(max-width: 1023px)" srcSet={media.portrait.tablet.src} width={media.portrait.tablet.width} height={media.portrait.tablet.height} />
            <img
              src={media.portrait.desktop.src}
              alt="Portrait of Enis Qetaj"
              width={media.portrait.desktop.width}
              height={media.portrait.desktop.height}
              sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 48vw, 44vw"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <figcaption>
            <span>Author / researcher / builder</span>
            <span>Kosovo, 2026</span>
          </figcaption>
        </figure>

        <div className="dispatch-hero__pitch">
          <p className="dispatch-hero__thesis">
            I research what moves markets—from structure and liquidity to macro and geopolitics—then build useful digital products from what becomes clear.
          </p>
          <div className="dispatch-hero__actions">
            <a className="button button--primary" href="#work">View selected work <ActionMark direction="down" /></a>
            <a className="button button--quiet" href="#research">Explore research <ActionMark direction="down" /></a>
          </div>
        </div>
      </div>

      <ol className="dispatch-hero__proof" aria-label="Core professional focus">
        {focus.map(([number, label]) => (
          <li key={number}><span>{number}</span><strong>{label}</strong></li>
        ))}
      </ol>

      <p className="dispatch-hero__principle">Context changes the decision.</p>
    </section>
  );
}

export function About() {
  return (
    <section id="research" className="site-section research-practice" aria-labelledby="research-title">
      <div className="section-intro research-practice__intro">
        <SectionLabel>01 / Research practice</SectionLabel>
        <h2 id="research-title">Evidence before narrative.</h2>
        <div>
          <p className="body-large">Research begins by defining the question, not by collecting more noise.</p>
          <p>Markets, macroeconomics and geopolitics become more useful when sources, contradictions and limitations remain visible.</p>
        </div>
      </div>

      <ol className="research-method">
        {researchMethod.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.note}</p>
          </li>
        ))}
      </ol>

      <div className="research-practice__domains">
        <div>
          <SectionLabel>Domains in view</SectionLabel>
          <p>Different forces. One connected research frame.</p>
        </div>
        <ul>
          {researchDomains.map((domain) => <li key={domain}>{domain}</li>)}
        </ul>
      </div>

      <div className="research-practice__note">
        <p>Research and educational content only. Not financial advice.</p>
        <Link href="/research">Open the research practice <ActionMark direction="forward" /></Link>
      </div>
    </section>
  );
}

export function Markets() {
  return (
    <section id="markets" className="site-section markets-practice" aria-labelledby="markets-title">
      <div className="section-intro markets-practice__intro">
        <SectionLabel>02 / Context circuit</SectionLabel>
        <h2 id="markets-title">A signal is only the beginning.</h2>
        <div>
          <p className="body-large">Price makes a move visible. Context changes what that move can mean.</p>
          <p>Research, markets and product building use the same discipline: connect the signal to the context before acting.</p>
        </div>
      </div>
      <ContextCircuit />
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="site-section selected-work" aria-labelledby="work-title">
      <div className="section-intro selected-work__intro">
        <SectionLabel>03 / Selected proof</SectionLabel>
        <h2 id="work-title">A real business. A working digital journey.</h2>
        <div>
          <p className="body-large">{barberProject.title} / {barberProject.location}</p>
          <p>{barberProject.description}</p>
        </div>
      </div>

      <div className="case-story">
        <ProjectMedia
          {...projectMedia[0]}
          mode="landscape"
          caption="01 / Context — the real business in Fushë Kosovë"
          className="case-story__place"
        />

        <article className="case-story__idea">
          <SectionLabel>02 / Product idea</SectionLabel>
          <h3>Make the path to booking feel as direct as the service.</h3>
          <p>A bilingual customer experience connects the business identity, service information and a clear appointment journey.</p>
          <img
            src={media.barber.identity.src}
            alt="Barber Brothers brand mark"
            width={media.barber.identity.width}
            height={media.barber.identity.height}
            loading="lazy"
            decoding="async"
          />
        </article>

        <article className="case-story__flow">
          <SectionLabel>03–05 / Customer journey</SectionLabel>
          <h3>One decision at a time.</h3>
          <ol>
            {barberProject.bookingSteps.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>
            ))}
          </ol>
          <a className="button button--primary" href={`${barberProject.url}booking`} target="_blank" rel="noreferrer">
            Open live booking <ActionMark direction="external" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </article>

        <ProjectMedia
          {...projectMedia[1]}
          mode="portrait"
          caption="06 / Real environment — interface and place share one identity"
          className="case-story__environment"
        />

        <article className="case-story__result">
          <SectionLabel>07–08 / Responsive execution & live product</SectionLabel>
          <h3>The product is the proof.</h3>
          <p>The live experience supports Albanian and English, service and barber selection, date and time choice, customer details and a booking summary.</p>
          <div>
            <a className="button button--primary" href={barberProject.url} target="_blank" rel="noreferrer">
              Visit live site <ActionMark direction="external" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <Link className="button button--quiet" href={`/work/${barberProject.slug}`}>Read the case study <ActionMark direction="forward" /></Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Build() {
  return (
    <section id="build" className="site-section building-practice" aria-labelledby="build-title">
      <div className="section-intro building-practice__intro">
        <SectionLabel>04 / Building practice</SectionLabel>
        <h2 id="build-title">Start with the need. Find the useful form.</h2>
        <div>
          <p className="body-large">A website, AI product, automation or interface should begin with the job it needs to do.</p>
          <p>Select the sentence closest to your situation to see how the need can be reframed.</p>
        </div>
      </div>
      <BuildNavigator />
      <ol className="build-process" aria-label="Working process">
        {["Understand", "Shape", "Design", "Build", "Refine"].map((step, index) => (
          <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>
        ))}
      </ol>
    </section>
  );
}

export function Malera() {
  return (
    <section className="site-section malera-practice" aria-labelledby="malera-title">
      <LetterGlitch
        className="malera-practice__glitch"
        glitchColors={["#315df2", "#5f7cff", "#8facff", "#dce5ff"]}
        glitchSpeed={42}
        outerVignette
        smooth
        characters="MALERASTUDIO0123456789+-/[]{}<>"
      />
      <SectionLabel>05 / Professional practice</SectionLabel>
      <div className="malera-practice__relationship" aria-label="Relationship between Enis Qetaj and Malera Studio">
        <div>
          <span>Person</span>
          <strong>Enis Qetaj</strong>
          <p>Research, markets, geopolitics and independent perspective.</p>
        </div>
        <div className="malera-practice__bridge" aria-hidden="true">
          <span>Expands into</span>
          <i />
        </div>
        <div>
          <span>Practice</span>
          <strong>Malera Studio</strong>
          <p>Professional digital-building practice for products and experiences.</p>
        </div>
      </div>
      <div className="malera-practice__close">
        <h2 id="malera-title">When the problem needs a wider practice.</h2>
        <div>
          <p>{malera.line}</p>
          <a className="button button--quiet" href={malera.url} target="_blank" rel="noreferrer">
            Visit Malera Studio <ActionMark direction="external" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="site-section contact-chapter" aria-labelledby="contact-title">
      <div className="contact-chapter__intro">
        <SectionLabel>06 / Start a conversation</SectionLabel>
        <h2 id="contact-title">Bring the context.<br />We’ll find the useful form.</h2>
        <p>For selected freelance projects, digital products, websites, automation and research interfaces.</p>
      </div>

      <div className="contact-chapter__layout">
        <aside>
          <span>Direct contact</span>
          <strong>{identity.name}</strong>
          <p>{identity.location}<br />Independent practice</p>
          <a href={identity.emailHref} target="_blank" rel="noreferrer">{identity.email}</a>
          <a href={identity.phoneHref}>{identity.phone}</a>
          <a href={malera.url} target="_blank" rel="noreferrer">Malera Studio <ActionMark direction="external" /></a>
          <small>The form prepares an email draft. Nothing is sent or stored by this site.</small>
        </aside>
        <ContactForm />
      </div>
    </section>
  );
}

export function QuietArchive() {
  return <Link className="button button--quiet" href="/work">Selected archive <ActionMark direction="forward" /></Link>;
}
