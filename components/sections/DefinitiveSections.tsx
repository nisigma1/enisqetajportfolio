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
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ActionMark } from "@/components/ui/ActionMark";
import { PixelImage } from "@/components/ui/PixelImage";
import { TextRepel } from "@/components/ui/TextRepel";
import { VisibilityFigure } from "@/components/performance/VisibilityFigure";
import {
  DeferredBuildNavigator,
  DeferredContextCircuit,
  DeferredLetterGlitch,
  DeferredTextRoll,
  AdaptivePortfolioPixelField,
} from "@/components/performance/DeferredIslands";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function PortfolioPixelField() {
  return <AdaptivePortfolioPixelField />;
}

export function Hero() {
  return (
    <section id="index" className="dispatch-hero dispatch-hero--portfolio" aria-labelledby="identity-title">
      <div className="dispatch-hero__primary">
        <div className="dispatch-hero__identity">
          <p className="portfolio-kicker">Based in {identity.location}</p>
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
              disableOnCoarsePointer
            />
          </h1>
          <div className="dispatch-hero__proposition">
            <p className="dispatch-hero__line">From booking a chair to closing a tab.</p>
            <p className="dispatch-hero__entity-copy">Through Malera Studio, I build websites, booking systems, and offline point-of-sale software for businesses.</p>
          </div>
          <div className="dispatch-hero__actions" id="work">
            <Link className="button button--primary" href="/work">View selected work</Link>
            <Link className="portfolio-text-link dispatch-hero__research-link" href="/pricing">Crypto Analysis</Link>
          </div>
        </div>

        <VisibilityFigure className="author-artifact">
          <span className="author-artifact__orbit" aria-hidden="true" />
          <PixelImage
            src={media.portrait.desktop.src}
            tabletSrc={media.portrait.tablet.src}
            mobileSrc={media.portrait.mobile.src}
            compactSrc={media.portrait.mobile.compactSrc}
            alt="Portrait of Enis Qetaj"
            customGrid={{ rows: 6, cols: 4 }}
            grayscaleAnimation
            pixelFadeInDuration={720}
            maxAnimationDelay={760}
            colorRevealDelay={980}
            aspectRatio={media.portrait.desktop.aspectRatio}
            objectPosition={media.portrait.desktop.objectPosition}
          />
          <figcaption>Enis Qetaj</figcaption>
        </VisibilityFigure>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="research" className="site-section research-practice" aria-labelledby="research-title">
      <div className="section-intro research-practice__intro">
        <SectionLabel>01 / Research practice</SectionLabel>
        <h2 id="research-title"><DeferredTextRoll>Evidence before narrative.</DeferredTextRoll></h2>
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
        <SectionLabel>03 / Context circuit</SectionLabel>
        <h2 id="markets-title">A signal is only the beginning.</h2>
        <div>
          <p className="body-large">Price makes a move visible. Context changes what that move can mean.</p>
          <p>Research, markets and product building use the same discipline: connect the signal to the context before acting.</p>
        </div>
      </div>
      <DeferredContextCircuit />
      <div className="selected-work__actions"><Link className="button button--quiet" href="/markets">Open the market framework <ActionMark direction="forward" /></Link></div>
    </section>
  );
}

export function LegacyWork() {
  return (
    <section id="work" className="site-section selected-work" aria-labelledby="work-title">
      <div className="section-intro selected-work__intro">
        <SectionLabel>04 / Selected proof</SectionLabel>
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

export function Work() {
  return (
    <section id="work" className="site-section selected-work" aria-labelledby="work-title">
      <div className="section-intro selected-work__intro">
        <SectionLabel>04 / Selected proof</SectionLabel>
        <h2 id="work-title">A real business. A working digital journey.</h2>
        <div>
          <p className="body-large">{barberProject.title} / {barberProject.location}</p>
          <p>{barberProject.description}</p>
        </div>
      </div>

      <div className="selected-work__actions">
        <Link className="button button--primary" href="/work">Explore selected work <ActionMark direction="forward" /></Link>
      </div>
    </section>
  );
}

type ReusableSectionProps = {
  sectionLabel?: string;
  headingId?: string;
};

export function Build({
  sectionLabel = "05 / Building practice",
  headingId = "build-title",
}: ReusableSectionProps = {}) {
  return (
    <section id="build" className="site-section building-practice" aria-labelledby={headingId}>
      <div className="section-intro building-practice__intro">
        <SectionLabel>{sectionLabel}</SectionLabel>
        <h2 id={headingId}>Start with the need. Find the useful form.</h2>
        <div>
          <p className="body-large">A website, AI product, automation or interface should begin with the job it needs to do.</p>
          <p>Select the sentence closest to your situation to see how the need can be reframed.</p>
        </div>
      </div>
      <DeferredBuildNavigator />
      <ol className="build-process" aria-label="Working process">
        {["Understand", "Shape", "Design", "Build", "Refine"].map((step, index) => (
          <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>
        ))}
      </ol>
    </section>
  );
}

export function Malera({
  sectionLabel = "Company relationship",
  headingId = "malera-title",
}: ReusableSectionProps = {}) {
  return (
    <section id="malera" className="site-section malera-practice" aria-labelledby={headingId}>
      <DeferredLetterGlitch />
      <header className="malera-practice__intro">
        <p className="portfolio-kicker">{sectionLabel}</p>
        <h2 id={headingId}>Founder and studio</h2>
      </header>
      <div className="malera-practice__relationship" aria-label="Relationship between Enis Qetaj and Malera Studio">
        <div>
          <span>Founder</span>
          <h3>Enis Qetaj</h3>
          <p>I founded Malera Studio. My crypto market research is independent of the studio.</p>
        </div>
        <div className="malera-practice__bridge" aria-hidden="true">
          <span>Founded</span>
          <i />
        </div>
        <div>
          <span>Company</span>
          <h3>Malera Studio</h3>
          <p>The studio is where I design and build software for businesses.</p>
          <a className="portfolio-text-link" href={malera.url}>Visit malera.studio</a>
        </div>
      </div>
    </section>
  );
}

export function HomePortfolioLinks() {
  return (
    <div className="home-portfolio-links">
      <section id="research" aria-labelledby="home-research-title">
        <h2 id="home-research-title">How I research markets</h2>
        <p>I look at liquidity, macroeconomics and on-chain data alongside price.</p>
        <Link className="portfolio-text-link" href="/research">Read my research approach</Link>
      </section>
      <section id="contact" aria-labelledby="home-contact-title">
        <h2 id="home-contact-title">Get in touch</h2>
        <p>Have a project in mind or a question about the research?</p>
        <Link className="portfolio-text-link" href="/contact">Contact Enis</Link>
      </section>
    </div>
  );
}

export function QuietArchive() {
  return <Link className="button button--quiet" href="/work">Selected archive <ActionMark direction="forward" /></Link>;
}
