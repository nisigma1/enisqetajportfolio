export type ResearchEntry = {
  title: string;
  subtitle: string;
  date: string;
  category: string;
  readingTime: string;
  summary: string;
  coverVisual: string;
  body: string;
  sources: readonly string[];
  footnotes: readonly string[];
  relatedResearch: readonly string[];
};

export const researchCategories = ["Crypto", "Macroeconomics", "Geopolitics", "Global Liquidity", "On-chain", "Market Structure", "Artificial Intelligence"] as const;
export const researchEntries: readonly ResearchEntry[] = [];

