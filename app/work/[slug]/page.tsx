import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarberBrothersShowcase } from "@/components/showcase/BarberBrothersShowcase";
import { HixhameTinaCaseStudy } from "@/components/showcase/HixhameTinaCaseStudy";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ActionMark } from "@/components/ui/ActionMark";
import { StructuredData } from "@/components/seo/StructuredData";
import { barberProject, hixhameProject, media, siteConfig } from "@/data/site";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";

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
    ? [{ url: "/projects/barber-brothers/barber-brothers-og.webp?v=20260730", width: 1200, height: 630, alt: "Barber Brothers premium website and booking case study" }]
    : slug === hixhameProject.slug
      ? [{ url: "/projects/hixhame-tina/hixhame-tina-case-study.webp", width: 1672, height: 941, alt: "Hixhame Tina women-only Hijama website shown on desktop and mobile" }]
      : [ogImage()];
  const socialTitle = slug === hixhameProject.slug
    ? "Hixhame Tina — Website Case Study"
    : project.seo.title;
  const socialDescription = slug === hixhameProject.slug
    ? "A women-focused wellness website combining calm visual direction, responsive design and direct appointment booking."
    : project.seo.description;
  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title: socialTitle,
      description: socialDescription,
      images: image,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description: socialDescription, images: [image[0].url] },
  };
}

function HixhameCaseStudy() {
  return <HixhameTinaCaseStudy />;
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

      <BarberBrothersShowcase priority />

      <section className="case-study__chapter">
        <div><p>02 / Product idea</p><h2>A clearer path from interest to booking.</h2></div>
        <div>
          <p>The digital experience connects the Barber Brothers identity, real work and space with an understandable appointment journey.</p>
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

      <section className="case-study__media-pair case-study__media-pair--legacy" hidden aria-hidden="true">
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
  const project = projects[slug as keyof typeof projects];
  if (!project) notFound();

  return (
    <>
      {slug === barberProject.slug ? <BarberCaseStudy /> : <HixhameCaseStudy />}
      <StructuredData data={baseStructuredData(project.seo)} />
    </>
  );
}
