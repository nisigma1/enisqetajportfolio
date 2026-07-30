/* eslint-disable @next/next/no-img-element -- Authenticated, pre-compressed project captures are art-directed locally. */

import { ActionMark } from "@/components/ui/ActionMark";
import { barberProject } from "@/data/site";

type BarberBrothersShowcaseProps = {
  priority?: boolean;
  variant?: "portfolio" | "cover";
};

type DetailIconProps = {
  type: "clock" | "location" | "phone" | "instagram";
};

const projectAssets = {
  homepage: {
    src: "/projects/barber-brothers/homepage.webp",
    width: 1440,
    height: 900,
  },
  booking: {
    src: "/projects/barber-brothers/booking.webp",
    width: 840,
    height: 1200,
  },
  work: {
    src: "/projects/barber-brothers/work-detail.webp",
    width: 1136,
    height: 486,
  },
  space: {
    src: "/projects/barber-brothers/space-detail.webp",
    width: 576,
    height: 710,
  },
} as const;

function DetailIcon({ type }: DetailIconProps) {
  const paths = {
    clock: <><circle cx="12" cy="12" r="7.5" /><path d="M12 7.5v5l3 2" /></>,
    location: <><path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    phone: <path d="M7.2 3.7 10 7.5 8.4 9.1c1.1 2.4 2.9 4.2 5.3 5.3l1.7-1.6 3.7 2.8c.5.4.6 1 .3 1.6l-1.1 2c-.3.6-.9.9-1.6.8C9.9 19 5 14.1 4 7.3c-.1-.7.2-1.3.8-1.6l2-1.1c.5-.3 1.1-.2 1.5.3Z" />,
    instagram: <><rect x="4.5" y="4.5" width="15" height="15" rx="4" /><circle cx="12" cy="12" r="3.3" /><circle cx="17.2" cy="6.9" r=".7" fill="currentColor" stroke="none" /></>,
  } as const;

  return (
    <span className="bb-showcase__detail-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        {paths[type]}
      </svg>
    </span>
  );
}

function BarberBrothersIdentity() {
  return (
    <div className="bb-showcase__identity">
      <p className="bb-showcase__eyebrow">Website design</p>
      <h3 id="barber-brothers-showcase-title">Barber<br />Brothers</h3>
      <p className="bb-showcase__subtitle">Premium barbershop website design</p>

      <p className="bb-showcase__philosophy">
        Discipline in the process.<br />
        <em>Elegance in the result.</em>
      </p>

      <dl className="bb-showcase__details">
        <div>
          <dt><DetailIcon type="clock" /><span>Working hours</span></dt>
          <dd><strong>09:30–20:30</strong><small>Monday–Saturday</small></dd>
        </div>
        <div>
          <dt><DetailIcon type="location" /><span>Location</span></dt>
          <dd><strong>Fushe Kosove</strong><small>Xhemajli Mustafa Street</small></dd>
        </div>
        <div>
          <dt><DetailIcon type="phone" /><span>Primary phone</span></dt>
          <dd><a href="tel:+38345990079"><strong>+383 45 990 079</strong></a></dd>
        </div>
        <div>
          <dt><DetailIcon type="instagram" /><span>Instagram</span></dt>
          <dd><a href="https://instagram.com/brotherscutss" target="_blank" rel="noopener noreferrer"><strong>@brotherscutss</strong></a></dd>
        </div>
      </dl>

      <ul className="bb-showcase__capabilities" aria-label="Project capabilities">
        <li><strong>Online booking</strong><span>Fast. Simple. 24/7.</span></li>
        <li><strong>Work gallery</strong><span>Real cuts. Real detail.</span></li>
        <li><strong>Space showcase</strong><span>The experience.</span></li>
      </ul>
    </div>
  );
}

function ProjectCapture({
  asset,
  alt,
  className,
  priority = false,
}: {
  asset: (typeof projectAssets)[keyof typeof projectAssets];
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <img
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
      />
    </figure>
  );
}

function BarberBrothersFooter() {
  return (
    <footer className="bb-showcase__footer">
      <div className="bb-showcase__brand">
        <img src="/images/barber/hero-logo.webp" alt="" width="720" height="480" loading="lazy" decoding="async" />
        <span><strong>Barber Brothers</strong><small>Fushe Kosove</small></span>
      </div>
      <p>Discipline in the process. <em>Elegance in the result.</em></p>
      <nav aria-label="Barber Brothers project links">
        <div>
          <strong>Navigate</strong>
          <a href={barberProject.url} target="_blank" rel="noopener noreferrer">Home <ActionMark direction="external" /></a>
          <a href={`${barberProject.url}ourwork`} target="_blank" rel="noopener noreferrer">Our Work <ActionMark direction="external" /></a>
          <a href={`${barberProject.url}brotherspace`} target="_blank" rel="noopener noreferrer">BROTHERSPACE <ActionMark direction="external" /></a>
          <a href={`${barberProject.url}booking`} target="_blank" rel="noopener noreferrer">Book <ActionMark direction="external" /></a>
        </div>
        <div>
          <strong>Visit</strong>
          <a href="https://maps.app.goo.gl/Gc8ro72mKUt859Vt5" target="_blank" rel="noopener noreferrer">Open Google Maps <ActionMark direction="external" /></a>
          <a href="https://instagram.com/brotherscutss" target="_blank" rel="noopener noreferrer">@brotherscutss <ActionMark direction="external" /></a>
          <a href="tel:+38345990079">+383 45 990 079</a>
          <a href="tel:+38345990003">+383 45 990 003</a>
        </div>
      </nav>
    </footer>
  );
}

export function BarberBrothersShowcase({
  priority = false,
  variant = "portfolio",
}: BarberBrothersShowcaseProps) {
  return (
    <section
      className={`bb-showcase bb-showcase--${variant}`}
      aria-labelledby="barber-brothers-showcase-title"
    >
      <BarberBrothersIdentity />

      <div className="bb-showcase__product">
        <div className="bb-showcase__laptop" aria-label="Barber Brothers homepage">
          <span className="bb-showcase__laptop-camera" aria-hidden="true" />
          <ProjectCapture
            asset={projectAssets.homepage}
            alt="Barber Brothers homepage showing the Premium Service, No Waiting message."
            className="bb-showcase__homepage"
            priority={priority}
          />
        </div>

        <div className="bb-showcase__proof-grid">
          <article className="bb-showcase__proof-card">
            <div><p>Our Work</p><h4>Real Details</h4><em>Precise cuts. Quiet craft.</em></div>
            <ProjectCapture
              asset={projectAssets.work}
              alt="Barber Brothers gallery showing authentic haircut work."
              className="bb-showcase__work"
            />
          </article>
          <article className="bb-showcase__proof-card">
            <div><p>BROTHERSPACE</p><h4>The Space</h4><em>Quiet light. Controlled detail.</em></div>
            <ProjectCapture
              asset={projectAssets.space}
              alt="Barber Brothers shop interior in Fushe Kosove."
              className="bb-showcase__space"
            />
          </article>
        </div>
      </div>

      <article className="bb-showcase__booking">
        <header><p>Product proof</p><h4>Book Online</h4><span>Service · Barber · Date · Time · Details</span></header>
        <ProjectCapture
          asset={projectAssets.booking}
          alt="Barber Brothers online booking interface with service, barber, date and customer-detail steps."
          className="bb-showcase__booking-capture"
          priority={priority}
        />
        <a href={`${barberProject.url}booking`} target="_blank" rel="noopener noreferrer">
          Open live booking <ActionMark direction="external" />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </article>

      <BarberBrothersFooter />
    </section>
  );
}
