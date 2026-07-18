import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return <main className="archive-page"><section><p>{project.category}</p><h1>{project.title}</h1><p>{project.description}</p></section></main>;
}

