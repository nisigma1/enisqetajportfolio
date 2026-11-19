/* eslint-disable @next/next/no-img-element -- Published, size-checked project imagery. */
import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { StructuredData } from "@/components/seo/StructuredData";
import { barberProject, besianaProject, hixhameProject, siteConfig } from "@/data/site";
import { duoBarProject } from "@/data/duo-bar";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";
import styles from "./WorkArchive.module.css";

const description = routeSeo.work.description;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.work.title,
  description,
  alternates: { canonical: "/work" },
  openGraph: { type: "website", url: "/work", siteName: siteConfig.name, title: routeSeo.work.title, description, images: [ogImage()] },
  twitter: { card: "summary_large_image", title: routeSeo.work.title, description, images: ["/og.png"] },
};

type WorkEntry = {
  project: { slug: string; title: string };
  category: string;
  summary: string;
  image: { src: string; srcSet?: string; avif?: string; width: number; height: number; alt: string };
};

const duoCover = "/projects/duo-bar/malera-pos-at-duo";
const duoCoverWidths = [720, 1440, 2160, 3024];
const duoCoverSizes = "(max-width: 859px) calc(100vw - 2rem), (max-width: 1792px) 57vw, 1012px";
const duoCoverSources = (format: "avif" | "webp") =>
  duoCoverWidths.map((width) => `${duoCover}-${width}.${format} ${width}w`).join(", ");
const projects: WorkEntry[] = [
  {
    project: barberProject,
    category: "Website and booking",
    summary: "A bilingual site where clients can choose a service, barber and appointment time.",
    image: { src: "/projects/barber-brothers/barber-brothers-cover.webp", width: 1600, height: 900, alt: "Barber Brothers website and appointment booking screens" },
  },
  {
    project: hixhameProject,
    category: "Wellness website",
    summary: "A multilingual site with direct booking for a women-only hijama service in Prishtina.",
    image: { src: "/projects/hixhame-tina/hixhame-tina-case-study.webp", avif: "/projects/hixhame-tina/hixhame-tina-case-study.avif", width: 1672, height: 941, alt: "The Hixhame Tina website on desktop and mobile" },
  },
  {
    project: besianaProject,
    category: "Photography website",
    summary: "A site for exploring Besiana’s wedding and portrait photography and getting in touch about a session.",
    image: {
      src: "/projects/besiana-photography/besiana-interface-1440.webp",
      srcSet: "/projects/besiana-photography/besiana-interface-768.webp 768w, /projects/besiana-photography/besiana-interface-1440.webp 1440w",
      width: 1440, height: 900,
      alt: "Besiana Photography’s live website with a couple pictured among trees",
    },
  },
];

export default function WorkArchive() {
  return (
    <>
      <InnerPageShell
        variant="work"
        title="Selected work"
        summary="Websites, online booking and point-of-sale software I built for businesses in Kosovo."
      >
        <ul className={`work-gallery ${styles.gallery}`} aria-label="Project case studies">
          <li id={duoBarProject.slug} className={styles.featureItem}>
            <article className={`work-entry ${styles.feature}`} aria-labelledby="duo-bar-title">
              <div className={styles.featureInfo}>
                <p className="portfolio-kicker">Featured case study / Hospitality software</p>
                <h2 id="duo-bar-title">{duoBarProject.title}</h2>
                <p className={styles.featureSummary}>Staff use Malera POS to take orders, close bills and track stock, even when the internet is down.</p>
                <Link className="button button--primary" href={`/work/${duoBarProject.slug}`}>View DUO Bar case study</Link>
              </div>
              <picture className={styles.cover}>
                <source type="image/avif" srcSet={duoCoverSources("avif")} sizes={duoCoverSizes} />
                <img
                  src={`${duoCover}-1440.webp`}
                  srcSet={duoCoverSources("webp")}
                  sizes={duoCoverSizes}
                  width={3024}
                  height={2184}
                  alt="Malera POS on the DUO Bar terminal, with the floor plan and the order panel for table J10"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </article>
          </li>
          {projects.map(({ project, category, summary, image }) => (
            <li key={project.slug} id={project.slug}>
              <article className="work-entry" aria-labelledby={`${project.slug}-title`}>
                <picture className="work-entry__image">
                  {image.avif && <source type="image/avif" srcSet={image.avif} />}
                  <img
                    src={image.src}
                    srcSet={image.srcSet}
                    sizes={image.srcSet ? "(max-width: 639px) calc(100vw - 2rem), (max-width: 959px) 46vw, (max-width: 1792px) 31vw, 34rem" : undefined}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className="work-entry__copy">
                  <p className="portfolio-kicker">{category}</p>
                  <h2 id={`${project.slug}-title`}>{project.title}</h2>
                  <p>{summary}</p>
                  <Link className="portfolio-text-link" href={`/work/${project.slug}`} aria-label={`View case study: ${project.title}`}>View case study</Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </InnerPageShell>
      <StructuredData data={baseStructuredData(routeSeo.work)} />
    </>
  );
}
