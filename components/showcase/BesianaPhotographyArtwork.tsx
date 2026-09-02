/* eslint-disable @next/next/no-img-element -- These are locally cached assets from the live Besiana Photography website. */

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
      <div className="besiana-artwork__site">
        <header className="besiana-artwork__nav">
          <span className="besiana-artwork__brand">
            <img src="/projects/besiana-photography/besiana-nav-mark-live.webp" alt="" width={256} height={256} loading="lazy" decoding="async" />
            <b>Besiana Photography</b>
          </span>
          <span className="besiana-artwork__links" aria-hidden="true"><i>Home</i><i>Portfolio</i><i>Services</i><i>Book</i></span>
          <span className="besiana-artwork__locale" aria-hidden="true">AL / EN</span>
        </header>

        <div className="besiana-artwork__hero">
          <div className="besiana-artwork__copy">
            <span>Besiana Photography · Kosovo</span>
            <h4>Moments that feel.<br />Photographs that remain.</h4>
            <p>A live photography experience for weddings, portraits, celebrations and businesses.</p>
            <em>Book on WhatsApp</em>
          </div>
          <div className="besiana-artwork__photo">
            <img
              src="/projects/besiana-photography/besiana-hero-live.webp"
              alt="Couple photographed for Besiana Photography"
              width={1200}
              height={1600}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding={priority ? "sync" : "async"}
            />
            <span>Weddings · portraits · stories</span>
          </div>
        </div>

        <footer className="besiana-artwork__footer" aria-hidden="true"><span>Portfolio</span><span>Light · rhythm · detail</span><span>01 / 03</span></footer>
      </div>

      <div className="besiana-artwork__phone" aria-hidden="true">
        <span className="besiana-artwork__notch" />
        <img src="/projects/besiana-photography/besiana-hero-live.webp" alt="" width={1200} height={1600} loading="lazy" decoding="async" />
        <span>Moments<br />that feel.</span>
      </div>
    </figure>
  );
}
