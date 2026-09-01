/* eslint-disable @next/next/no-img-element -- Local identity assets use fixed intrinsic dimensions and native lazy loading. */
import type { Metadata } from "next";
import Link from "next/link";
import { CryptoCurriculumSection } from "@/components/education/CryptoCurriculumSection";
import { ActionMark } from "@/components/ui/ActionMark";
import { backgroundChapters } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.background.title,
  description: routeSeo.background.description,
  alternates: { canonical: "/background" },
  openGraph: { type: "website", url: "/background", title: routeSeo.background.title, description: routeSeo.background.description },
  twitter: { card: "summary", title: routeSeo.background.title, description: routeSeo.background.description },
};

export default function BackgroundPage() {
  return (
    <>
      <main id="main" className="route-page background-route">
        <header className="route-hero">
          <p>Background / Knowledge progression</p>
          <h1>Three fields. One analytical practice.</h1>
          <div>
            <p>Marketing established the audience lens. Banking and finance widened the market frame. Crypto markets connected the system to applied research.</p>
            <span>Marketing → Banking &amp; Finance → Crypto Markets</span>
          </div>
        </header>

        <section className="background-progression" aria-labelledby="background-progression-title">
          <header className="background-progression__intro">
            <p>01 / Education &amp; practice</p>
            <h2 id="background-progression-title">Knowledge accumulated through connected chapters.</h2>
          </header>

          <ol className="background-chapters">
            {backgroundChapters.map((chapter, index) => (
              <li key={chapter.field} className="background-chapter">
                <div className="background-chapter__field">
                  <span>{chapter.number}</span>
                  <h3>{chapter.field}</h3>
                </div>

                <div className="background-chapter__education">
                  <div>
                    <p>{chapter.degree}</p>
                    <strong>{chapter.institution}</strong>
                    <span>{chapter.faculty}</span>
                  </div>
                  {index < 2 ? (
                    <img src="/images/education/university-of-prishtina.png" width="447" height="447" alt="University of Prishtina seal" loading="lazy" decoding="async" />
                  ) : (
                    <img src="/images/crypto-school-logo.webp" width="960" height="538" alt="Crypto School" loading="lazy" decoding="async" />
                  )}
                  <p className="background-chapter__status"><span aria-hidden="true" />{chapter.status}</p>
                </div>

                <div className="background-chapter__practice">
                  <p>Primary skills</p>
                  <ul aria-label={`${chapter.field} primary skills`}>
                    {chapter.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                  <div><span>Experience</span><strong>{chapter.experience}</strong></div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <CryptoCurriculumSection />

        <section className="case-study__close">
          <div><p>04 / Continue</p><h2>See how the foundation becomes working products.</h2></div>
          <div><Link className="button button--primary" href="/work">View selected work <ActionMark direction="forward" /></Link></div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.background)).replace(/</g, "\\u003c") }} />
    </>
  );
}
