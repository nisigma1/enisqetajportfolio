/* eslint-disable @next/next/no-img-element -- Local identity assets use fixed intrinsic dimensions and native lazy loading. */
import type { Metadata } from "next";
import Link from "next/link";
import { CryptoCurriculumSection } from "@/components/education/CryptoCurriculumSection";
import { SmmAiCertification } from "@/components/education/SmmAiCertification";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { ActionMark } from "@/components/ui/ActionMark";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { backgroundChapters } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";
import "@/styles/background-journey.css";

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
        eyebrow="Background"
        title={<>Marketing.<br />Finance.<br />Crypto Markets.</>}
        summary="I studied marketing, am pursuing a master’s in banking and finance, and completed training in crypto markets and AI-assisted social media."
        meta={["University of Prishtina", "Crypto School", "Hallakate"]}
      >
        <section className="inner-section background-journey" aria-labelledby="background-journey-title">
          <header className="inner-section__header">
            <p className="inner-section__label">01 / Background</p>
            <h2 id="background-journey-title">Education and applied experience</h2>
          </header>

          <ol className="knowledge-journey">
            {backgroundChapters.map((chapter, index) => (
              <li key={chapter.field} className="journey-field">
                <div className="journey-field__identity">
                  <span className="journey-field__number">{chapter.number}</span>
                  <h3>{chapter.field}</h3>
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
                    <p className="journey-field__status" data-in-progress={chapter.status === "In progress" ? "true" : undefined}>
                      <span aria-hidden="true" />{chapter.status}
                    </p>
                  </div>
                </div>

                <div className="journey-field__skills">
                  <p>Skills</p>
                  <ul aria-label={`${chapter.field} primary skills`}>
                    {chapter.skills.map((skill) => <li key={skill}>{skill}</li>)}
                  </ul>
                </div>

                <div className="journey-field__experience">
                  <span>Applied experience</span>
                  <strong>
                    <NumberTicker value={Number.parseInt(chapter.experience, 10)} suffix="+" />
                    <span>years</span>
                  </strong>
                </div>
              </li>
            ))}
            <SmmAiCertification />
            <li id="malera-studio-experience" className="journey-field journey-field--studio">
              <div className="journey-field__identity">
                <span className="journey-field__number">05</span>
                <h3>Malera Studio</h3>
              </div>

              <div className="journey-field__education">
                <img src="/images/education/malera-studio-logo.webp" width="384" height="384" alt="Malera Studio logo" loading="lazy" decoding="async" />
                <div>
                  <p>Professional experience</p>
                  <strong>Digital product studio</strong>
                  <span className="journey-field__studio-summary">I developed these skills by building tools for businesses.</span>
                </div>
              </div>

              <div className="journey-field__skills">
                <p>Hands-on practice</p>
                <ul aria-label="What I learned to build at Malera Studio">
                  <li>Apps</li>
                  <li>Websites</li>
                  <li>Workflow automation</li>
                  <li>AI agents</li>
                </ul>
              </div>

              <div className="journey-field__experience journey-field__studio-role">
                <span>Role</span>
                <strong>Founder</strong>
                <Link className="portfolio-text-link" href="/companies">About the studio</Link>
              </div>
            </li>
          </ol>
        </section>

        <CryptoCurriculumSection />

        <section className="inner-section inner-final-cta">
          <div><p className="inner-section__label">03 / Continue</p><h2>See the software I’ve built.</h2></div>
          <div><Link className="button button--primary" href="/work">View selected work <ActionMark direction="forward" /></Link></div>
        </section>
      </InnerPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.background)).replace(/</g, "\\u003c") }} />
    </>
  );
}
