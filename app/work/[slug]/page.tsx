import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { barberProject, media, siteConfig } from "@/data/site";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: barberProject.slug }];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== barberProject.slug) notFound();
  const title = `${barberProject.title} — Selected Work`;
  const canonical = `/work/${barberProject.slug}`;
  return {
    title,
    description: barberProject.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title: `${title} — Enis Qetaj`,
      description: barberProject.description,
      images: [{ url: media.barber.exterior.src, width: media.barber.exterior.width, height: media.barber.exterior.height, alt: "Barber Brothers in Fushë Kosovë" }],
    },
    twitter: { card: "summary_large_image", title: `${title} — Enis Qetaj`, description: barberProject.description, images: [media.barber.exterior.src] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (slug !== barberProject.slug) notFound();

  return (
    <main id="main" className="route-page case-study">
      <header className="case-study__hero">
        <div>
          <p>Selected work / 01</p>
          <h1>Barber<br />Brothers</h1>
        </div>
        <div>
          <p>{barberProject.description}</p>
          <a className="button button--primary" href={barberProject.url} target="_blank" rel="noopener noreferrer">
            Visit live site <span aria-hidden="true">↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </header>

      <ProjectMedia
        src={media.barber.exterior.src}
        alt="Barber Brothers exterior in Fushë Kosovë"
        width={media.barber.exterior.width}
        height={media.barber.exterior.height}
        focalPoint={media.barber.exterior.focalPoint}
        mode="landscape"
        caption="01 / Context — a real barber business in Fushë Kosovë"
        priority
        className="case-study__lead"
      />

      <section className="case-study__chapter">
        <div><p>02 / Product idea</p><h2>A clearer path from interest to booking.</h2></div>
        <div>
          <p>The digital experience connects the business identity and service information with an understandable appointment journey.</p>
          <ul>{barberProject.knownFeatures.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="case-study__journey">
        <div>
          <p>03–05 / Customer journey</p>
          <h2>One decision at a time.</h2>
        </div>
        <ol>
          {barberProject.bookingSteps.map((step, index) => (
            <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
          ))}
        </ol>
      </section>

      <section className="case-study__media-pair">
        <ProjectMedia
          src={media.barber.interior.src}
          alt="Interior of Barber Brothers in Fushë Kosovë"
          width={media.barber.interior.width}
          height={media.barber.interior.height}
          focalPoint={media.barber.interior.focalPoint}
          mode="portrait"
          caption="06 / Real environment"
        />
        <ProjectMedia
          src={media.barber.chair.src}
          alt="Barber chair and interior detail at Barber Brothers"
          width={media.barber.chair.width}
          height={media.barber.chair.height}
          focalPoint={media.barber.chair.focalPoint}
          mode="portrait"
          caption="07 / Interface and identity context"
        />
      </section>

      <section className="case-study__close">
        <div>
          <p>08 / Live product</p>
          <h2>The product is available to use—not presented as a concept.</h2>
        </div>
        <div>
          <a className="button button--primary" href={barberProject.url} target="_blank" rel="noopener noreferrer">
            Visit Barber Brothers <span aria-hidden="true">↗</span>
          </a>
          <Link className="button button--quiet" href="/contact">Start a conversation <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
