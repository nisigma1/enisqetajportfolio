export type Project = {
  title: string;
  slug: string;
  category: string;
  description: string;
  problem: string;
  approach: string;
  solution: string;
  role: string;
  tools: readonly string[];
  status: "Private" | "In development" | "Published";
  year: string;
  coverVisual: string;
  gallery: readonly string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
};

// Real project case studies will be added here when they are ready to publish.
export const projects: readonly Project[] = [];

