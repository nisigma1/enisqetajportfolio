import type { Metadata } from "next";
import Link from "next/link";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ActionMark } from "@/components/ui/ActionMark";
import { barberProject, media, siteConfig } from "@/data/site";

const description = "Selected digital work by Enis Qetaj, beginning with the live Barber Brothers customer and booking experience.";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Selected Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: { type: "website", url: "/work", siteName: siteConfig.name, title: "Selected Work — Enis Qetaj", description, images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Selected Work — Enis Qetaj", description, images: ["/og.png"] },
};

export default function WorkArchive() {
  return (
    <main id="main" className="route-page work-route">
      <header className="route-hero">
        <p>Selected work / Live proof</p>
        <h1>Real work.<br />Shown with context.</h1>
        <div>
          <p>One fully documented project is more useful than a wall of unsupported claims.</p>
          <span>Context / Journey / Interface / Environment</span>
        </div>
      </header>

      <article className="work-feature">
        <ProjectMedia
          src={media.barber.exterior.src}
          alt="Barber Brothers exterior in Fushë Kosovë"
          width={media.barber.exterior.width}
          height={media.barber.exterior.height}
          focalPoint={media.barber.exterior.focalPoint}
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
    </main>
  );
}
