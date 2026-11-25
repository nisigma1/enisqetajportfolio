/* eslint-disable @next/next/no-img-element -- Optimized local captures of the public websites. */
import styles from "./LiveProjects.module.css";

const projects = [
  {
    slug: "gramoz-shala",
    name: "Gramoz Shala",
    type: "Engineering portfolio",
    description: "Gramoz’s studies, experience and certifications come together around three ideas: sense, control and apply.",
    url: "https://gramozshala.com/",
    domain: "gramozshala.com",
    cover: "gramoz-shala-hero",
    alt: "Gramoz Shala’s engineering portfolio with his student role, name and portrait",
    mobile: { width: 860, height: 1044 },
  },
  {
    slug: "besastore",
    name: "BesaStore",
    type: "Secondhand fashion",
    description: "A secondhand catalog for a Prishtina shop. Browse by category, open an item and ask about it on Instagram.",
    url: "https://besastore.site/",
    domain: "besastore.site",
    cover: "besastore-home",
    alt: "Four garments against a dark backdrop in BesaStore’s interactive homepage showcase",
    mobile: { width: 780, height: 800 },
  },
  {
    slug: "leonita-bajrami",
    name: "Leonita Bajrami",
    type: "Artist website",
    description: "Visitors can explore Leonita’s paintings across three gallery rooms, browse the collection and ask about a commission.",
    url: "https://leonita.art/",
    domain: "leonita.art",
    cover: "leonita-bajrami-gallery",
    alt: "A waterfall landscape and other paintings on the walls of Leonita Bajrami’s virtual gallery room",
    mobile: { width: 780, height: 585 },
  },
  {
    slug: "albion-selmanaj",
    name: "Albion Selmanaj",
    type: "Finance portfolio",
    description: "Albion’s accounting and finance experience, areas of expertise and education, organized in one professional portfolio.",
    url: "https://www.albionselmanaj.com/",
    domain: "albionselmanaj.com",
    alt: "Albion Selmanaj’s portrait in his dark green finance portfolio",
    mobile: { width: 390, height: 440 },
  },
] as const;

export function LiveProjects() {
  return (
    <section className={styles.section} id="more-websites" aria-labelledby="live-projects-title">
      <header className={styles.intro}>
        <div>
          <p className="portfolio-kicker">More work</p>
          <h2 id="live-projects-title">Websites in use</h2>
        </div>
        <p>An artist’s gallery, a secondhand shop, and two personal portfolios.</p>
      </header>
      <ul className={styles.projects} role="list">
        {projects.map((project) => (
          <li key={project.slug}>
            <article className={styles.project} data-project={project.slug} aria-labelledby={`${project.slug}-title`}>
              <div className={styles.copy}>
                <p className="portfolio-kicker">{project.type}</p>
                <h3 id={`${project.slug}-title`}>{project.name}</h3>
                <p>{project.description}</p>
                <a className={styles.link} href={project.url} aria-label={`Visit ${project.domain}, ${project.name} website`}>
                  {project.domain}
                </a>
              </div>
              <picture className={styles.preview}>
                <source
                  media="(max-width: 767px)"
                  srcSet={`/projects/portfolio-editions/${"cover" in project ? project.cover : project.slug}-mobile.webp`}
                  width={project.mobile.width}
                  height={project.mobile.height}
                />
                <img
                  src={`/projects/portfolio-editions/${"cover" in project ? project.cover : project.slug}.webp`}
                  width={1200}
                  height={750}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
