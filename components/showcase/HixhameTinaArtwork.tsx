type HixhameTinaArtworkProps = {
  priority?: boolean;
  caption?: string;
  className?: string;
};

const artwork = {
  avif: "/projects/hixhame-tina/hixhame-tina-case-study.avif",
  webp: "/projects/hixhame-tina/hixhame-tina-case-study.webp",
  width: 1672,
  height: 941,
} as const;

export function HixhameTinaArtwork({
  priority = false,
  caption,
  className = "",
}: HixhameTinaArtworkProps) {
  return (
    <figure className={`hixhame-artwork ${className}`.trim()}>
      <picture>
        <source srcSet={artwork.avif} type="image/avif" />
        <img
          src={artwork.webp}
          alt="Hixhame Tina women-only Hijama website case study showing desktop and mobile responsive interfaces."
          width={artwork.width}
          height={artwork.height}
          sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 4rem), 1440px"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
        />
      </picture>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
