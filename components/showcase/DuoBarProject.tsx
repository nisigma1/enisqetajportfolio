/* eslint-disable @next/next/no-img-element -- Responsive derivatives of the supplied venue photographs. */
import type { ReactNode } from "react";
import Link from "next/link";
import { DuoVenueFullSizeLink, DuoVenueImage } from "@/components/media/DuoVenueImage";
import { duoBarProject as project } from "@/data/duo-bar";
import styles from "./DuoBarProject.module.css";

type Photo = {
  src: string;
  small?: string;
  width: number;
  height: number;
  alt: string;
};

function DuoPhoto({ photo, className, sizes, children }: {
  photo: Photo;
  className: string;
  sizes?: string;
  children: ReactNode;
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
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className={styles.caption}>{children}</figcaption>
    </figure>
  );
}

const detailSizes = "(max-width: 767px) calc(100vw - 2rem), (max-width: 1792px) 40vw, 45rem";

export function DuoBarCaseStudy() {
  return (
    <main id="main" className="route-page case-study">
      <header className={styles.masthead}>
        <div>
          <p className="portfolio-kicker">Selected work / Malera POS</p>
          <h1>{project.title}</h1>
          <p className={styles.lede}>I built the point-of-sale app used at DUO Bar. Staff select a table, take an order and close the bill, even without an internet connection.</p>
        </div>
        <dl className={styles.credits}>
          <div><dt>Role</dt><dd>Application development</dd></div>
          <div><dt>Product</dt><dd>Malera POS</dd></div>
        </dl>
      </header>

      <section id="duo-shift" className={styles.story} aria-labelledby="duo-shift-title">
        <header className={styles.chapterHeading}>
          <div>
            <p className="portfolio-kicker">01 / Behind the counter</p>
            <h2 id="duo-shift-title">A shift at DUO Bar</h2>
          </div>
          <p>These photos show separate examples from DUO Bar rather than one recorded order.</p>
        </header>

        <div className={styles.stage}>
          <figure className={styles.photo}>
            <div className={`${styles.frame} ${styles.venue}`}>
              <DuoVenueImage sizes="(max-width: 767px) calc(100vw - 2rem), 54vw" />
            </div>
            <figcaption className={styles.caption}>
              <p className={styles.marker}>At the bar</p>
              <div className={styles.venueCaption}>
                <p>Malera POS on the counter at DUO Bar.</p>
                <DuoVenueFullSizeLink />
              </div>
            </figcaption>
          </figure>

          <DuoPhoto photo={project.photos.terminal} className={styles.terminal} sizes={detailSizes}>
            <h3><span className={styles.step}>01</span> Select a table</h3>
            <p>Staff tap a table on the visual floor plan to open its order. I kept the floor plan and order panel side by side so staff can still see the room.</p>
          </DuoPhoto>
        </div>

        <div className={styles.workflow}>
          <DuoPhoto photo={project.photos.orders} className={styles.orders} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1792px) 54vw, 61rem">
            <h3><span className={styles.step}>02</span> Add to the order</h3>
            <p>Staff add products to the selected table and review its order in the same view.</p>
          </DuoPhoto>

          <section className={styles.bill} aria-labelledby="duo-bill-title">
            <p className={styles.marker}>End of the order</p>
            <h3 id="duo-bill-title"><span className={styles.step}>03</span> Close the bill</h3>
            <p>Staff close the bill for the selected table in Malera POS. The owner can check reports for sales, expenses and profit.</p>
          </section>
        </div>
      </section>

      <section className={styles.operations} aria-labelledby="duo-operations-title">
        <header>
          <p className="portfolio-kicker">02 / How it works</p>
          <h2 id="duo-operations-title">Built to run offline.</h2>
        </header>
        <dl>
          <div><dt>Local operation</dt><dd>The app works without internet, stores data locally in SQLite and receives updates through GitHub.</dd></div>
          <div><dt>Products and stock</dt><dd>The app manages products, prices and inventory. Coffee stock is deducted automatically as orders are placed.</dd></div>
          <div><dt>Staff access</dt><dd>The owner and employees sign in with PINs and get access based on their roles.</dd></div>
        </dl>
      </section>

      <section className={styles.close} aria-labelledby="duo-contact-title">
        <div>
          <p className="portfolio-kicker">03 / Malera POS</p>
          <h2 id="duo-contact-title">Interested in Malera POS for your venue?</h2>
          <p>Malera POS is available to bars and restaurants by monthly subscription.</p>
        </div>
        <Link className="button button--primary" href="/contact?service=digital-project#contact-form">Ask about Malera POS</Link>
      </section>
    </main>
  );
}
