import type { Metadata } from "next";
import { buildCapabilities, problems } from "@/data/site";

export const metadata: Metadata = {
  title: "Build",
  description:
    "Enis Qetaj turns defined needs into focused websites, applications, automation and research interfaces.",
  alternates: { canonical: "/build" },
};

export default function BuildPage() {
  return (
    <main id="main" className="route-page build-route">
      <header className="route-hero">
        <p>Build / Digital products</p>
        <h1>Start with the need.<br />Find the useful form.</h1>
        <div>
          <p>The output follows the problem: a clear website, a focused tool, an automation or a purpose-built interface.</p>
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
  );
}
