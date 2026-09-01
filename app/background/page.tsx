/* eslint-disable @next/next/no-img-element -- Local identity assets use fixed intrinsic dimensions and native lazy loading. */
import type { Metadata } from "next";
import Link from "next/link";
import { CryptoCurriculumSection } from "@/components/education/CryptoCurriculumSection";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
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
      <InnerPageShell
        variant="background"
        eyebrow="Background / Knowledge journey"
        title={<>Marketing.<br />Finance.<br />Crypto Markets.</>}
        summary="Three disciplines that shape how I understand markets, businesses and digital systems."
        meta={["Education", "Applied learning", "Professional practice"]}
      >
        <section className="inner-section background-journey" aria-labelledby="background-journey-title">
          <header className="inner-section__header">
            <p className="inner-section__label">01 / Progression</p>
            <h2 id="background-journey-title">A connected professional foundation.</h2>
            <p>Audience understanding leads into financial systems, then into applied crypto-market research.</p>
          </header>

          <ol className="knowledge-journey">
            {backgroundChapters.map((chapter, index) => (
              <li key={chapter.field} className="journey-field">
                <div className="journey-field__identity">
                  <span className="journey-field__number">{chapter.number}</span>
                  <h3>{chapter.field}</h3>
                  <p className="journey-field__status"><span aria-hidden="true" />{chapter.status}</p>
                </div>

                <div className="journey-field__education">
                  {index < 2 ? (
                    <img src="/images/education/university-of-prishtina.png" width="447" height="447" alt="University of Prishtina seal" loading="lazy" decoding="async" />
                  ) : (
                    <img src="/images/crypto-school-logo.webp" width="960" height="538" alt="Crypto School" loading="lazy" decoding="async" />
                  )}
                  <div>
                    <p>{chapter.degree}</p>
                    <strong>{chapter.institution}</strong>
                    <span>{chapter.faculty}</span>
                  </div>
                </div>

                <div className="journey-field__skills">
                  <p>Skills</p>
                  <ul aria-label={`${chapter.field} primary skills`}>
                    {chapter.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>

                <div className="journey-field__experience"><span>Experience</span><strong>{chapter.experience}</strong></div>
              </li>
            ))}
          </ol>
        </section>

        <CryptoCurriculumSection />

        <section className="inner-section inner-final-cta">
          <div><p className="inner-section__label">03 / Continue</p><h2>See how the foundation becomes working products.</h2></div>
          <div><Link className="button button--primary" href="/work">View selected work <ActionMark direction="forward" /></Link></div>
        </section>
      </InnerPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.background)).replace(/</g, "\\u003c") }} />
    </>
  );
}
