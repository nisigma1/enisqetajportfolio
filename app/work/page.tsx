import Link from "next/link";
import type { Metadata } from "next";
import { barberProject } from "@/data/site";

export const metadata: Metadata = { title: "Selected Work — Enis Qetaj", description: "Real digital work by Enis Qetaj, beginning with Barber Brothers." };
export default function WorkArchive() {
  return <main className="inner-page"><header><Link href="/">EQ / Index</Link><span>Selected work</span></header><section className="inner-hero"><p>01 / Live</p><h1>One real project.<br /><em>Shown properly.</em></h1></section><Link className="archive-project" href={`/work/${barberProject.slug}`}><span>{barberProject.category}</span><strong>{barberProject.title}</strong><i>Open case study ↗</i></Link><section className="archive-next"><span>Next</span><p>More work is being documented.</p></section></main>;
}

