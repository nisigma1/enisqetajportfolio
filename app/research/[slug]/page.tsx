import { notFound } from "next/navigation";
import { researchEntries } from "@/data/research";
export function generateStaticParams() { return researchEntries.map((entry) => ({ slug: entry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") })); }
export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = researchEntries.find((item) => item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
  if (!entry) notFound();
  return <main className="archive-page"><article><p>{entry.category}</p><h1>{entry.title}</h1><p>{entry.summary}</p></article></main>;
}

