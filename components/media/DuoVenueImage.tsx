/* eslint-disable @next/next/no-img-element -- Authenticated project photography with explicit responsive sources. */
import { duoBarProject } from "@/data/duo-bar";

const { venue } = duoBarProject.photos;
const wide = "(min-width: 1024px)";
const compact = "(max-width: 719px)";

export function DuoVenueImage({ sizes }: { sizes: string }) {
  return (
    <picture>
      <source media={wide} type="image/avif" srcSet={venue.uhd.avif} width={venue.uhd.width} height={venue.uhd.height} />
      <source media={wide} type="image/webp" srcSet={venue.uhd.src} width={venue.uhd.width} height={venue.uhd.height} />
      <source media={compact} type="image/avif" srcSet={venue.compact} />
      <source media={compact} type="image/webp" srcSet={venue.src} />
      <img
        src={venue.src}
        srcSet={`${venue.src} 720w, ${venue.large} 1440w`}
        sizes={sizes}
        width={venue.width}
        height={venue.height}
        alt={venue.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}

export function DuoVenueFullSizeLink() {
  return <a className="portfolio-text-link" href={venue.uhd.src}>View 4K photo</a>;
}
