import Link from "next/link";
import { HixhameTinaArtwork } from "@/components/showcase/HixhameTinaArtwork";
import { ActionMark } from "@/components/ui/ActionMark";
import { hixhameProject } from "@/data/site";

type HixhameTinaPreviewProps = {
  priority?: boolean;
  variant?: "homepage" | "archive";
};

export function HixhameTinaPreview({
  priority = false,
  variant = "archive",
}: HixhameTinaPreviewProps) {
  return (
    <article className={`hixhame-preview hixhame-preview--${variant}`}>
      <div className="hixhame-preview__header">
        <p><span>02</span> Selected work</p>
        <p>{hixhameProject.category}</p>
      </div>

      <div className="hixhame-preview__lead">
        <div>
          <h3>{hixhameProject.title}</h3>
          <p>Privacy, trust and direct booking—translated into one calm digital experience.</p>
        </div>
        <div className="hixhame-preview__summary">
          <p>{hixhameProject.description}</p>
          <div className="hixhame-preview__actions">
            <Link className="button button--primary" href={`/work/${hixhameProject.slug}`}>
              Open case study <ActionMark direction="forward" />
            </Link>
            <a className="button button--quiet" href={hixhameProject.url} target="_blank" rel="noopener noreferrer">
              Visit live website <ActionMark direction="external" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <HixhameTinaArtwork priority={priority} />

      <dl className="hixhame-preview__meta" aria-label="Project summary">
        <div><dt>Focus</dt><dd>Women-only wellness</dd></div>
        <div><dt>Experience</dt><dd>Responsive website</dd></div>
        <div><dt>Journey</dt><dd>Direct WhatsApp booking</dd></div>
        <div><dt>Location</dt><dd>Prishtina, Kosovo</dd></div>
      </dl>
    </article>
  );
}
