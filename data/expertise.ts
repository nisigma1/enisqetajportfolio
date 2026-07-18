export type Expertise = {
  title: string;
  description: string;
  keywords: readonly string[];
};

export const expertise: readonly Expertise[] = [
  {
    title: "Crypto Trading",
    description: "Market structure, liquidity, technical setups, positioning, momentum and disciplined risk awareness.",
    keywords: ["Structure", "Liquidity", "Positioning"],
  },
  {
    title: "Financial Markets Research",
    description: "Macroeconomics, monetary policy, global liquidity, financial cycles and major market developments.",
    keywords: ["Macro", "Policy", "Cycles"],
  },
  {
    title: "Technical and Fundamental Analysis",
    description: "Connecting price structure, market data, narratives, adoption, token dynamics and broader economic context.",
    keywords: ["Price", "Data", "Context"],
  },
  {
    title: "Geopolitical Research",
    description: "Studying how conflict, trade, energy, strategic resources and political decisions can influence markets.",
    keywords: ["Trade", "Energy", "Policy"],
  },
  {
    title: "AI Products",
    description: "Building AI-powered applications, websites and useful digital tools around real problems.",
    keywords: ["Products", "Interfaces", "Utility"],
  },
  {
    title: "Bots and Automation",
    description: "Creating systems that reduce repetitive work and improve research, operations and digital workflows.",
    keywords: ["Bots", "Workflows", "Operations"],
  },
] as const;

export const marketTopics = [
  { title: "Technical Analysis", description: "Reading price structure, trends, liquidity, momentum and important market levels." },
  { title: "Fundamental Analysis", description: "Evaluating projects, adoption, narratives, token dynamics and long-term context." },
  { title: "Crypto Market Structure", description: "Studying how liquidity, participants and positioning shape digital-asset markets." },
  { title: "Global Liquidity", description: "Tracking how financial conditions and capital availability influence risk assets and market cycles." },
  { title: "Macroeconomics", description: "Following liquidity, interest rates, inflation, monetary policy and global economic cycles." },
  { title: "Monetary Policy", description: "Interpreting policy decisions and the conditions they create for capital and risk." },
  { title: "Geopolitics", description: "Studying how conflict, trade, energy, strategic resources and political decisions affect markets." },
  { title: "On-chain Research", description: "Using blockchain activity and market data to understand positioning, flows and behavior." },
  { title: "Market Narratives", description: "Separating durable shifts in attention from short-lived market noise." },
  { title: "Investor Behavior", description: "Observing how expectations, positioning and psychology appear in market structure." },
] as const;

