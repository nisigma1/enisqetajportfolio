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

      <HixhameTinaArtwork priority={priority} />

      <div className="hixhame-preview__body">
        <div>
          <h3>{hixhameProject.title}</h3>
          <p>{hixhameProject.description}</p>
        </div>
        <ul aria-label="Project summary">
          <li>Women-only wellness service</li>
          <li>Responsive website</li>
          <li>Direct WhatsApp booking</li>
          <li>Prishtina, Kosovo</li>
        </ul>
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
    </article>
  );
}
