import type { Metadata } from "next";
import Link from "next/link";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
import { Malera } from "@/components/sections/DefinitiveSections";
import { Ferrofluid } from "@/components/ui/Ferrofluid";
import { FoldText } from "@/components/ui/FoldText";
import { duoBarProject } from "@/data/duo-bar";
import { barberProject } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.companies.title,
  description: routeSeo.companies.description,
  alternates: { canonical: "/companies" },
  openGraph: { type: "website", url: "/companies", title: routeSeo.companies.title, description: routeSeo.companies.description },
  twitter: { card: "summary", title: routeSeo.companies.title, description: routeSeo.companies.description },
};

const capabilities = [
  {
    name: "Websites and booking",
    description: "A booking website where clients choose a service, barber and appointment time in Albanian or English.",
    project: barberProject,
  },
  {
    name: "Business software",
    description: "An offline point-of-sale system that bar staff use to take orders by table, track stock and check reports.",
    project: duoBarProject,
  },
  {
    name: "AI and automation",
    description: "Custom tools for repetitive work, such as sorting inquiries or moving information between apps.",
    project: null,
  },
] as const;

export default function CompaniesPage() {
  return (
    <>
      <InnerPageShell
        variant="malera"
        eyebrow="Digital product studio"
        title={<FoldText text="Malera Studio" className="malera-fold-heading" />}
        summary="An independent studio that builds websites, software and automations for businesses."
        mastheadDecoration={<Ferrofluid className="malera-ferrofluid" dpr={1.2} colors={["#3d5bd8", "#6f91ff", "#dce8ff"]} speed={0.1} scale={1.45} turbulence={0.68} fluidity={0.12} rimWidth={0.22} sharpness={2.3} shimmer={0.7} glow={1.15} flowDirection="right" opacity={0.72} mouseInteraction={false} />}
      >
        <section id="build" className="studio-services" aria-labelledby="malera-services-title">
          <div>
            <h2 id="malera-services-title">What Malera builds</h2>
            <Link className="portfolio-text-link" href="/work">See the case studies</Link>
          </div>
          <dl>
            {capabilities.map(({ name, description, project }) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>
                  <p>{description}</p>
                  {project && <Link className="portfolio-text-link" href={`/work/${project.slug}`}>{project.title} case study</Link>}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Malera headingId="companies-malera-title" />

        <section className="studio-inquiry" aria-labelledby="studio-inquiry-title">
          <div>
            <h2 id="studio-inquiry-title">Have a project in mind?</h2>
            <p>Tell me what you want the website or software to do.</p>
          </div>
          <Link className="button button--primary" href="/contact?service=digital-project#contact-form">Discuss a project</Link>
        </section>
      </InnerPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.companies)).replace(/</g, "\\u003c") }} />
    </>
  );
}
