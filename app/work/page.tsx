import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { BarberBrothersShowcase } from "@/components/showcase/BarberBrothersShowcase";
import { HixhameTinaPreview } from "@/components/showcase/HixhameTinaPreview";
import { BesianaPhotographyPreview } from "@/components/showcase/BesianaPhotographyPreview";
import { StructuredData } from "@/components/seo/StructuredData";
import { ActionMark } from "@/components/ui/ActionMark";
import { Meteors } from "@/components/ui/Meteors";
import { StrokeText } from "@/components/ui/StrokeText";
import { barberProject, besianaProject, hixhameProject, siteConfig } from "@/data/site";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";

const description = routeSeo.work.description;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.work.title,
  description,
  alternates: { canonical: "/work" },
  openGraph: { type: "website", url: "/work", siteName: siteConfig.name, title: routeSeo.work.title, description, images: [ogImage()] },
  twitter: { card: "summary_large_image", title: routeSeo.work.title, description, images: ["/og.png"] },
};

export default function WorkArchive() {
  const projects = [barberProject, hixhameProject, besianaProject] as const;

  return (
    <>
      <InnerPageShell
        variant="work"
        eyebrow="Work / Selected digital products"
        title={
          <span className="work-stroke-heading">
            <span className="visually-hidden">Built for real businesses.</span>
            <StrokeText text="Built for real" height="clamp(4.35rem, 6.9vw, 6.1rem)" />
            <StrokeText text="businesses." height="clamp(4.35rem, 6.9vw, 6.1rem)" drawDuration={0.95} reverse />
          </span>
        }
        summary="Three live digital experiences, shown through their actual interfaces, journeys and visual systems."
        meta={["Websites", "Service journeys", "Responsive systems"]}
        mastheadDecoration={<Meteors />}
      >
        <nav className="inner-section project-index" aria-label="Selected project index">
          <p className="inner-section__label">01 / Project index</p>
          <ol>
            {projects.map((project, index) => (
              <li key={project.slug}>
                <a href={`#${project.slug}`}>
                  <span className="project-index__number">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{project.title}</strong>
                  <span>{project.category}</span>
                  <ActionMark direction="down" />
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id={barberProject.slug} className="inner-section work-project work-project--barber" aria-labelledby="barber-work-title">
          <header className="work-project__header">
            <div><p>02 / Project 01</p><h2 id="barber-work-title">{barberProject.title}</h2></div>
            <div><p>{barberProject.description}</p><span>{barberProject.category} / {barberProject.location}</span></div>
            <div className="work-project__actions">
              <Link className="button button--primary" href={`/work/${barberProject.slug}`}>Open case study <ActionMark direction="forward" /></Link>
              <a className="button button--quiet" href={barberProject.url} target="_blank" rel="noopener noreferrer">Visit live website <ActionMark direction="external" /></a>
            </div>
          </header>
          <BarberBrothersShowcase priority />
        </section>

        <section id={hixhameProject.slug} className="inner-section work-project work-project--hixhame" aria-label="Hixhame Tina project">
          <HixhameTinaPreview />
        </section>

        <section id={besianaProject.slug} className="inner-section work-project work-project--besiana" aria-label="Besiana Photography project">
          <BesianaPhotographyPreview />
        </section>
      </InnerPageShell>
      <StructuredData data={baseStructuredData(routeSeo.work)} />
    </>
  );
}
