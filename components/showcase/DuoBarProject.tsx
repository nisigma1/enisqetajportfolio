/* eslint-disable @next/next/no-img-element -- Responsive derivatives of the supplied venue photographs. */
import Link from "next/link";
import { duoBarProject as project } from "@/data/duo-bar";
import styles from "./DuoBarProject.module.css";

type Photo = {
  src: string;
  small?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

function DuoPhoto({ photo, className, priority = false, sizes }: {
  photo: Photo;
  className: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={styles.photo}>
      <div className={`${styles.frame} ${className}`}>
        <img
          src={photo.src}
          srcSet={photo.small ? `${photo.small} 720w, ${photo.src} ${photo.width}w` : undefined}
          sizes={photo.small ? sizes : undefined}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </div>
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

const widePhotoSizes = "(max-width: 767px) calc(100vw - 32px), (max-width: 1800px) 94vw, 105rem";

export function DuoBarPreview() {
  return (
    <section id={project.slug} className="inner-section work-project" aria-labelledby="duo-bar-work-title">
      <header className="work-project__header">
        <div><p>Project 04 / Malera POS</p><h2 id="duo-bar-work-title">{project.title}</h2></div>
        <div><p>{project.description}</p><span>{project.category}</span></div>
        <div className="work-project__actions">
          <Link className="button button--primary" href={`/work/${project.slug}`}>Open case study</Link>
        </div>
      </header>
      <DuoPhoto photo={project.photos.terminal} className={styles.lead} sizes={widePhotoSizes} />
    </section>
  );
}

export function DuoBarCaseStudy() {
  return (
    <main id="main" className="route-page case-study">
      <header className="case-study__hero">
        <div><p>Selected work / Malera POS</p><h1>{project.title}</h1></div>
        <div><p>{project.description}</p></div>
      </header>

      <DuoPhoto photo={project.photos.terminal} className={styles.lead} sizes={widePhotoSizes} priority />

      <section className="case-study__chapter">
        <div><p>Day-to-day operations</p><h2>From the floor plan to the final bill.</h2></div>
        <ul className={styles.features}>
          <li><strong>Tables and orders.</strong> Staff use a visual floor plan to select a table, take orders and close the bill.</li>
          <li><strong>Products and stock.</strong> The app manages products, prices and inventory. Coffee stock is deducted automatically as orders are placed.</li>
          <li><strong>PIN access and reports.</strong> The owner and employees sign in with PINs and have access based on their roles. Reports track sales, expenses and profit.</li>
          <li><strong>Offline operation.</strong> The app works without internet, stores data locally in SQLite and receives updates through GitHub.</li>
        </ul>
      </section>

      <section className={styles.gallery} aria-label="Malera POS at DUO Bar">
        <DuoPhoto photo={project.photos.orders} className={styles.orders} sizes="(max-width: 767px) calc(100vw - 32px), 50vw" />
        <DuoPhoto photo={project.photos.venue} className={styles.venue} />
      </section>

      <section className="case-study__close">
        <div><p>Malera POS</p><h2>Interested in Malera POS for your venue?</h2></div>
        <div><Link className="button button--primary" href="/contact?service=digital-project#contact-form">Ask about Malera POS</Link></div>
      </section>
    </main>
  );
}
