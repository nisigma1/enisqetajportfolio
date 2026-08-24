/* eslint-disable @next/next/no-img-element -- The project cover is a locally cached, art-directed social preview. */
import { ActionMark } from "@/components/ui/ActionMark";
import { besianaProject } from "@/data/site";

type BesianaPhotographyPreviewProps = {
  variant?: "homepage" | "archive";
};

export function BesianaPhotographyPreview({ variant = "archive" }: BesianaPhotographyPreviewProps) {
  return (
    <article className={`besiana-preview besiana-preview--${variant}`}>
      <div className="besiana-preview__header">
        <p><span>03</span> Selected work</p>
        <p>{besianaProject.category}</p>
      </div>
      <div className="besiana-preview__lead">
        <div>
          <h3>{besianaProject.title}</h3>
          <p>Momente që ndihen.<br />Fotografi që mbesin.</p>
        </div>
        <div className="besiana-preview__summary">
          <p>{besianaProject.description}</p>
          <a className="button button--primary" href={besianaProject.url} target="_blank" rel="noopener noreferrer">
            Visit live website <ActionMark direction="external" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
      <a className="besiana-preview__art" href={besianaProject.url} target="_blank" rel="noopener noreferrer" aria-label="Visit Besiana Photography website">
        <img src="/projects/besiana-photography/besiana-photography-og.jpg" alt="Besiana Photography website preview" width={1200} height={630} loading="lazy" decoding="async" />
        <span className="besiana-preview__art-label">besianaphotography.com <ActionMark direction="external" /></span>
      </a>
      <dl className="besiana-preview__meta" aria-label="Project summary">
        <div><dt>Focus</dt><dd>Wedding, portrait &amp; events</dd></div>
        <div><dt>Experience</dt><dd>Story-led photography site</dd></div>
        <div><dt>Services</dt><dd>Family, business &amp; celebrations</dd></div>
        <div><dt>Location</dt><dd>{besianaProject.location}</dd></div>
      </dl>
    </article>
  );
}
