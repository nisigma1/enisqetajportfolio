/* eslint-disable @next/next/no-img-element -- Local pre-compressed project photography is served without a client image runtime. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { barberProject, media, siteConfig } from "@/data/site";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: barberProject.slug }];
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
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
      images: [
        {
          url: media.barber.exterior.src,
          width: media.barber.exterior.width,
          height: media.barber.exterior.height,
          alt: "Barber Brothers in Fushë Kosovë",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Enis Qetaj`,
      description: barberProject.description,
      images: [media.barber.exterior.src],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (slug !== barberProject.slug) notFound();

  return (
    <main className="case-page">
      <header>
        <Link href="/">EQ / Index</Link>
        <Link href="/work">All work</Link>
      </header>
      <section className="case-title">
        <p>{barberProject.category}</p>
        <h1>
          Barber
          <br />
          Brothers
        </h1>
        <a
          href={barberProject.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit live site ↗<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </section>
      <section className="case-description" aria-labelledby="case-context-title">
        <h2 id="case-context-title" className="visually-hidden">Project context</h2>
        <p>{barberProject.description}</p>
        <ul>
          {barberProject.knownFeatures.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="case-gallery" aria-labelledby="case-gallery-title">
        <h2 id="case-gallery-title" className="visually-hidden">Project gallery</h2>
        <img
          src={media.barber.interior.src}
          alt="Barber Brothers interior in Fushë Kosovë"
          width={media.barber.interior.width}
          height={media.barber.interior.height}
          loading="lazy"
          decoding="async"
        />
        <img
          src={media.barber.chair.src}
          alt="Barber chair and interior detail at Barber Brothers"
          width={media.barber.chair.width}
          height={media.barber.chair.height}
          loading="lazy"
          decoding="async"
        />
        <img
          src={media.barber.exterior.src}
          alt="Barber Brothers exterior in Fushë Kosovë"
          width={media.barber.exterior.width}
          height={media.barber.exterior.height}
          loading="lazy"
          decoding="async"
        />
      </section>
      <footer>
        <p>The live product is the proof.</p>
        <Link href="/contact">Start a conversation ↗</Link>
      </footer>
    </main>
  );
}
