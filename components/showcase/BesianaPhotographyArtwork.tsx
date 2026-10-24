/* eslint-disable @next/next/no-img-element -- Authentic local project photography and browser-captured interface. */
import "@/styles/besiana-showcase.css";

type BesianaPhotographyArtworkProps = {
  compact?: boolean;
  priority?: boolean;
};

export function BesianaPhotographyArtwork({
  compact = false,
  priority = false,
}: BesianaPhotographyArtworkProps) {
  return (
    <figure className={`besiana-artwork${compact ? " besiana-artwork--compact" : ""}`}>
      <img
        className="besiana-artwork__authentic"
        src={compact ? "/projects/besiana-photography/besiana-authentic-portrait.webp" : "/projects/besiana-photography/besiana-interface-1440.webp"}
        srcSet={compact
          ? "/projects/besiana-photography/besiana-authentic-portrait-480.webp 480w, /projects/besiana-photography/besiana-authentic-portrait.webp 768w"
          : "/projects/besiana-photography/besiana-interface-768.webp 768w, /projects/besiana-photography/besiana-interface-1440.webp 1440w"}
        sizes={compact ? "(max-width: 767px) calc(100vw - 80px), 30vw" : "(max-width: 767px) calc(100vw - 32px), (max-width: 1504px) calc(100vw - 64px), 1440px"}
        alt={compact ? "Couple photographed among trees by Besiana Photography" : "Actual Besiana Photography website, captured in the browser in October 2026"}
        width={compact ? 768 : 1440}
        height={compact ? 1024 : 900}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </figure>
  );
}
