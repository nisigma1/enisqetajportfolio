import type { Metadata } from "next";
import Link from "next/link";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ActionMark } from "@/components/ui/ActionMark";
import { barberProject, hixhameProject, siteConfig } from "@/data/site";
import { ogImage, routeSeo } from "@/lib/seo";

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
  return (
    <main id="main" className="route-page work-route">
      <header className="route-hero">
        <p>Selected work / Live proof</p>
        <h1>Real work.<br />Shown with context.</h1>
        <div>
          <p>Verified public work connected to Enis Qetaj and Malera Studio, shown with factual context instead of unsupported claims.</p>
          <span>Context / Journey / Interface / Environment</span>
        </div>
      </header>

      <article className="work-feature">
        <ProjectMedia
          src="/projects/barber-brothers/barber-brothers-cover.webp"
          alt="Barber Brothers premium website and booking case study"
          width={1600}
          height={900}
          mode="landscape"
          priority
        />
        <div>
          <p>{barberProject.category}</p>
          <h2>{barberProject.title}</h2>
          <p>{barberProject.description}</p>
          <Link className="button button--primary" href={`/work/${barberProject.slug}`}>Open case study <ActionMark direction="forward" /></Link>
        </div>
      </article>

      <article className="work-feature work-feature--text">
        <div>
          <p>{hixhameProject.category}</p>
          <h2>{hixhameProject.title}</h2>
          <p>{hixhameProject.description}</p>
          <Link className="button button--quiet" href={`/work/${hixhameProject.slug}`}>Open Hixhame Tina case study <ActionMark direction="forward" /></Link>
        </div>
      </article>
    </main>
  );
}
