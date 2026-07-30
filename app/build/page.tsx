import type { Metadata } from "next";
import { buildCapabilities, problems } from "@/data/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.build.title,
  description: routeSeo.build.description,
  alternates: { canonical: "/build" },
  openGraph: { type: "website", url: "/build", title: routeSeo.build.title, description: routeSeo.build.description, images: [ogImage()] },
  twitter: { card: "summary_large_image", title: routeSeo.build.title, description: routeSeo.build.description, images: ["/og.png"] },
};

export default function BuildPage() {
  return (
    <>
      <main id="main" className="route-page build-route">
      <header className="route-hero">
        <p>Build / Digital products</p>
        <h1>AI products, websites and automation</h1>
        <div>
          <p>Enis Qetaj builds AI applications, websites, web applications, automation, bots, AI agents and research interfaces through Malera Studio.</p>
          <span>Context / Product / System</span>
        </div>
      </header>

      <section className="route-section route-build-matrix" aria-labelledby="build-matrix-title">
        <div>
          <p>01 / Problem-led practice</p>
          <h2 id="build-matrix-title">The form follows the job.</h2>
        </div>
        <ol>
          {problems.map((item, index) => (
            <li key={item.problem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.problem}</h3>
              <p>{item.reframe}</p>
              <strong>{item.forms}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="route-section route-domains" aria-labelledby="build-capabilities-title">
        <div>
          <p>02 / Useful forms</p>
          <h2 id="build-capabilities-title">What I build.</h2>
        </div>
        <ul>
          {buildCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
        </ul>
      </section>
      </main>
      <StructuredData data={baseStructuredData(routeSeo.build)} />
    </>
  );
}
