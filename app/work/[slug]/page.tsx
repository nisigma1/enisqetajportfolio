import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ActionMark } from "@/components/ui/ActionMark";
import { barberProject, hixhameProject, media, siteConfig } from "@/data/site";
import { ogImage, routeSeo } from "@/lib/seo";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export const dynamicParams = false;

const projects = {
  [barberProject.slug]: {
    data: barberProject,
    seo: routeSeo.barber,
    number: "01",
  },
  [hixhameProject.slug]: {
    data: hixhameProject,
    seo: routeSeo.hixhame,
    number: "02",
  },
} as const;

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug as keyof typeof projects];
  if (!project) notFound();
  const canonical = project.seo.path;
  const image = slug === barberProject.slug
    ? [{ url: media.barber.exterior.src, width: media.barber.exterior.width, height: media.barber.exterior.height, alt: "Barber Brothers service and barber booking interface" }]
    : [ogImage()];
  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title: project.seo.title,
      description: project.seo.description,
      images: image,
    },
    twitter: { card: "summary_large_image", title: project.seo.title, description: project.seo.description, images: [image[0].url] },
  };
}

function HixhameCaseStudy() {
  return (
    <main id="main" className="route-page case-study">
      <header className="case-study__hero">
        <div>
          <p>Selected work / 02</p>
          <h1>Hixhame<br />Tina</h1>
        </div>
        <div>
          <p>{hixhameProject.description}</p>
          <a className="button button--primary" href={hixhameProject.url} target="_blank" rel="noopener noreferrer">
            Visit Hixhame Tina <ActionMark direction="external" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </header>

      <section className="case-study__chapter">
        <div><p>01 / Overview</p><h2>A focused public website for a real service.</h2></div>
        <div>
          <p>The Hixhame Tina project is included as verified selected work. The page keeps the case study factual: public website, mobile-friendly presentation, clear service information and a direct contact path.</p>
          <ul>{hixhameProject.knownFeatures.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="case-study__close">
        <div>
          <p>02 / Live project</p>
          <h2>The work is public and can be reviewed directly.</h2>
        </div>
        <div>
          <a className="button button--primary" href={hixhameProject.url} target="_blank" rel="noopener noreferrer">
            Open live website <ActionMark direction="external" />
          </a>
          <Link className="button button--quiet" href="/build">Explore Enis Qetaj&apos;s build practice <ActionMark direction="forward" /></Link>
        </div>
      </section>
    </main>
  );
}

function BarberCaseStudy() {
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
            Visit Barber Brothers <ActionMark direction="external" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </header>

      <ProjectMedia
        src={media.barber.exterior.src}
        alt="Barber Brothers service and barber booking interface"
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
            Visit Barber Brothers <ActionMark direction="external" />
          </a>
          <Link className="button button--quiet" href="/contact">Start a conversation <ActionMark direction="forward" /></Link>
        </div>
      </section>
    </main>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (slug === barberProject.slug) return <BarberCaseStudy />;
  if (slug === hixhameProject.slug) return <HixhameCaseStudy />;
  notFound();
}
