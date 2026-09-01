import type { Metadata } from "next";
import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";
import { buildCapabilities, malera } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = { title: routeSeo.malera.title, description: routeSeo.malera.description, alternates: { canonical: "/malera" }, openGraph: { type: "website", url: "/malera", title: routeSeo.malera.title, description: routeSeo.malera.description }, twitter: { card: "summary", title: routeSeo.malera.title, description: routeSeo.malera.description } };

export default function MaleraPage() {
  return <><main id="main" className="route-page about-route"><header className="route-hero"><p>Malera / Digital product practice</p><h1>Build the useful form.</h1><div><p>Malera Studio is the professional practice founded by Enis Qetaj for websites, digital products, automation and AI systems.</p><span>Websites / Digital products / AI / Automation</span></div></header><section className="route-section route-domains" aria-labelledby="malera-offer"><div><p>01 / What Malera builds</p><h2 id="malera-offer">A focused studio for digital work that needs clarity.</h2></div><ul>{buildCapabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul></section><section className="case-study__chapter"><div><p>02 / Connection</p><h2>Research informs the build.</h2></div><div><p>{malera.line}</p><a className="button button--primary" href={malera.url} target="_blank" rel="noopener noreferrer">Visit Malera Studio <ActionMark direction="external" /></a></div></section><section className="case-study__close"><div><p>03 / Start a project</p><h2>Bring the problem. Find the useful system.</h2></div><div><Link className="button button--primary" href="/contact">Contact Enis Qetaj <ActionMark direction="forward" /></Link></div></section></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.malera)).replace(/</g, "\\u003c") }} /></>;
}
