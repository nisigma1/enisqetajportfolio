/* eslint-disable @next/next/no-img-element -- Pre-compressed local project photography avoids client image runtime. */
import Link from "next/link";
import { notFound } from "next/navigation";
import { barberProject } from "@/data/site";

export function generateStaticParams() { return [{ slug: barberProject.slug }]; }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== barberProject.slug) notFound();
  return <main className="case-page"><header><Link href="/">EQ / Index</Link><Link href="/work">All work</Link></header><section className="case-title"><p>{barberProject.category}</p><h1>Barber<br />Brothers</h1><a href={barberProject.url} target="_blank" rel="noreferrer">Visit live site ↗</a></section><section className="case-description"><p>{barberProject.description}</p><ul>{barberProject.knownFeatures.map((item) => <li key={item}>{item}</li>)}</ul></section><div className="case-gallery"><img src="/images/barber/space-1.webp" alt="Barber Brothers interior" width="1023" height="1534" loading="lazy" decoding="async" /><img src="/images/barber/space-2.webp" alt="Barber Brothers chair and interior detail" width="1024" height="1461" loading="lazy" decoding="async" /><img src="/images/barber/space-3.webp" alt="Barber Brothers exterior" width="1024" height="1024" loading="lazy" decoding="async" /></div><footer><p>No invented outcome. The live experience is the proof.</p><Link href="/contact">Have something similar in mind? ↗</Link></footer></main>;
}
