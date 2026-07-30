import Link from "next/link";
import { HixhameTinaArtwork } from "@/components/showcase/HixhameTinaArtwork";
import { ActionMark } from "@/components/ui/ActionMark";
import { hixhameProject } from "@/data/site";

const projectFacts = [
  ["Project", "Hixhame Tina"],
  ["Type", "Website design and frontend development"],
  ["Industry", "Women’s wellness"],
  ["Location", "Kolovicë, Prishtina"],
  ["Primary journey", "Service information to direct booking"],
] as const;

const journey = [
  {
    title: "Understand the service",
    copy: "Clear introductory content explains what the service is and who it is intended for.",
  },
  {
    title: "Build confidence",
    copy: "Privacy, hygiene, comfort and women-only positioning are communicated throughout the experience.",
  },
  {
    title: "Contact directly",
    copy: "Phone and WhatsApp actions create a short path from interest to appointment.",
  },
] as const;

const features = [
  ["Privacy-first presentation", "The experience is designed around discretion, comfort and clear communication for women."],
  ["Trust-driven content", "The visual and written direction focuses on useful information rather than exaggerated claims."],
  ["Direct booking", "WhatsApp and telephone actions provide a clear contact path."],
  ["Responsive experience", "The layout adapts intentionally across desktop, tablet and mobile."],
  ["Localized content", "Six verified language routes make the public information easier to access."],
  ["Production deployment", "The website is available through its live public domain."],
] as const;

export function HixhameTinaCaseStudy() {
  return (
    <main id="main" className="route-page hixhame-study">
      <header className="hixhame-study__hero">
        <div>
          <p>Selected work / 02</p>
          <h1>Hixhame<br />Tina</h1>
        </div>
        <div>
          <p>A premium public website for a women-only Hijama service in Prishtina, created to communicate privacy, care and trust while making direct appointment booking simple.</p>
          <div className="hixhame-study__actions">
            <a className="button button--primary" href={hixhameProject.url} target="_blank" rel="noopener noreferrer">
              Visit live website <ActionMark direction="external" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <Link className="button button--quiet" href="/work">
              Back to selected work <ActionMark direction="back" />
            </Link>
          </div>
        </div>
      </header>

      <dl className="hixhame-study__facts">
        {projectFacts.map(([term, detail]) => (
          <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>
        ))}
      </dl>

      <HixhameTinaArtwork
        priority
        caption="Hixhame Tina / Responsive website and digital identity"
        className="hixhame-study__artwork"
      />

      <section className="hixhame-study__chapter" aria-labelledby="hixhame-context">
        <div><p>01 / Context</p><h2 id="hixhame-context">A private service needed a clearer digital presence.</h2></div>
        <p>Hixhame Tina provides Hijama therapy exclusively for women in Kolovicë, Prishtina. The website needed to explain the service calmly, establish trust and make direct contact easy without presenting the experience as clinical or overwhelming.</p>
      </section>

      <section className="hixhame-study__chapter hixhame-study__chapter--accent" aria-labelledby="hixhame-direction">
        <div><p>02 / Design direction</p><h2 id="hixhame-direction">Privacy before promotion.</h2></div>
        <p>The visual system uses warm ivory backgrounds, controlled burgundy accents, editorial typography and carefully selected wellness imagery. The direction feels calm, discreet and professional rather than medical, decorative or aggressively commercial.</p>
      </section>

      <section className="hixhame-study__journey" aria-labelledby="hixhame-journey">
        <header><p>03 / Customer journey</p><h2 id="hixhame-journey">Understand. Build trust. Book directly.</h2></header>
        <ol>
          {journey.map((stage, index) => (
            <li key={stage.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{stage.title}</h3>
              <p>{stage.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="hixhame-study__paired">
        <section aria-labelledby="hixhame-responsive">
          <p>04 / Responsive experience</p>
          <h2 id="hixhame-responsive">One identity across every screen.</h2>
          <p>The desktop experience uses an editorial split layout and strong visual hierarchy. The mobile version simplifies navigation, prioritizes the essential message and keeps booking actions immediately accessible.</p>
        </section>
        <section aria-labelledby="hixhame-languages">
          <p>05 / Language experience</p>
          <h2 id="hixhame-languages">Accessible across languages.</h2>
          <p>All six public locale routes were verified on the live website.</p>
          <ul>{hixhameProject.locales.map((locale) => <li key={locale}>{locale}</li>)}</ul>
        </section>
      </div>

      <section className="hixhame-study__features" aria-labelledby="hixhame-features">
        <header><p>Project characteristics</p><h2 id="hixhame-features">What the experience needed to do.</h2></header>
        <ol>
          {features.map(([title, copy], index) => (
            <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="hixhame-study__close">
        <div><p>06 / Live project</p><h2>The project is public and available to use.</h2></div>
        <div>
          <p>Hixhame Tina is deployed on its production domain and can be reviewed as a functioning public website rather than a visual concept.</p>
          <div className="hixhame-study__actions">
            <a className="button button--primary" href={hixhameProject.url} target="_blank" rel="noopener noreferrer">
              Visit Hixhame Tina <ActionMark direction="external" />
            </a>
            <Link className="button button--quiet" href="/work">
              View selected work <ActionMark direction="back" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
