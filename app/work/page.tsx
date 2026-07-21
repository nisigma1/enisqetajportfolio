import type { Metadata } from "next";
import Link from "next/link";
import { barberProject, siteConfig } from "@/data/site";

const description =
  "Selected digital work by Enis Qetaj, beginning with the live Barber Brothers booking experience.";

export const metadata: Metadata = {
  title: "Selected Work",
  description,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    siteName: siteConfig.name,
    title: "Selected Work — Enis Qetaj",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Selected work by Enis Qetaj",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Work — Enis Qetaj",
    description,
    images: ["/og.png"],
  },
};

export default function WorkArchive() {
  return (
    <main className="inner-page">
      <header>
        <Link href="/">EQ / Index</Link>
        <span>Selected work</span>
      </header>
      <section className="inner-hero">
        <p>One live project</p>
        <h1>
          Real work.<br />
          <em>Shown with context.</em>
        </h1>
      </section>
      <Link
        className="archive-project"
        href={`/work/${barberProject.slug}`}
      >
        <span>{barberProject.category}</span>
        <h2>{barberProject.title}</h2>
        <i>Open case study ↗</i>
      </Link>
      <section className="archive-next">
        <h2 className="chapter-mark">Archive</h2>
        <p>More work will appear here when it is ready to be documented properly.</p>
      </section>
    </main>
  );
}
