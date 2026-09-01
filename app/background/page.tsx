import type { Metadata } from "next";
import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";
import { cryptoEducation, identity, marketInterests } from "@/data/site";
import { baseStructuredData, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata: Metadata = { title: routeSeo.background.title, description: routeSeo.background.description, alternates: { canonical: "/background" }, openGraph: { type: "website", url: "/background", title: routeSeo.background.title, description: routeSeo.background.description }, twitter: { card: "summary", title: routeSeo.background.title, description: routeSeo.background.description } };

export default function BackgroundPage() {
  return <><main id="main" className="route-page about-route">
    <header className="route-hero"><p>Background / Professional progression</p><h1>From markets to useful systems.</h1><div><p>Enis Qetaj’s background brings marketing, banking and finance, and applied crypto-market learning into one connected practice.</p><span>Marketing / Banking &amp; Finance / Crypto Markets</span></div></header>
    <section className="route-section route-domains" aria-labelledby="background-fields"><div><p>01 / Fields</p><h2 id="background-fields">Three foundations. One way of thinking.</h2></div><ul>{["Marketing", "Banking & Finance", "Crypto Markets"].map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="education-profile" aria-labelledby="background-learning"><header><p>02 / Learning</p><h2 id="background-learning">Formal education and applied market learning.</h2></header><div className="education-profile__degrees"><ul aria-label="Formal education">{identity.education.map((item) => <li key={`${item.degree}-${item.subject}`}>{item.degree} in {item.subject} — {item.status}</li>)}</ul><article className="education-profile__credential"><div><p>Completed curriculum</p><span>{cryptoEducation.provider}</span></div><h3>{cryptoEducation.credential}</h3><p>{cryptoEducation.summary}</p><ul aria-label="Course areas">{cryptoEducation.focus.map((area) => <li key={area}>{area}</li>)}</ul></article></div></section>
    <section className="route-section route-domains" aria-labelledby="background-research"><div><p>03 / Research frame</p><h2 id="background-research">What the practice keeps in view.</h2></div><ul>{marketInterests.map((area) => <li key={area}>{area}</li>)}</ul></section>
    <section className="case-study__close"><div><p>04 / Continue</p><h2>See the work built from this foundation.</h2></div><div><Link className="button button--primary" href="/work">View selected work <ActionMark direction="forward" /></Link></div></section>
  </main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(baseStructuredData(routeSeo.background)).replace(/</g, "\\u003c") }} /></>;
}
