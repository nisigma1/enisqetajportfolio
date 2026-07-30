export type CryptoCurriculumTrackId = "foundations" | "analysis" | "systems";

export type CryptoCurriculumModule = {
  id: string;
  number: string;
  title: string;
  track: CryptoCurriculumTrackId;
  summary: string;
  whyItMatters: string;
  status: "completed";
  order: number;
};

export type CryptoCurriculumTrack = {
  id: CryptoCurriculumTrackId;
  number: string;
  label: string;
  progressionLabel: string;
};

export const cryptoCurriculumTracks: readonly CryptoCurriculumTrack[] = [
  {
    id: "foundations",
    number: "01",
    label: "Foundations & Security",
    progressionLabel: "Foundation",
  },
  {
    id: "analysis",
    number: "02",
    label: "Analysis & Execution",
    progressionLabel: "Analysis",
  },
  {
    id: "systems",
    number: "03",
    label: "Market Systems & Behavior",
    progressionLabel: "Market behavior",
  },
] as const;

export const cryptoCurriculumModules: readonly CryptoCurriculumModule[] = [
  {
    id: "blockchain-basics",
    number: "01",
    title: "Blockchain Basics",
    track: "foundations",
    summary:
      "Understanding how blockchain technology works and why it enables decentralized digital systems.",
    whyItMatters:
      "Understanding the underlying system makes it easier to separate technological substance from market narrative.",
    status: "completed",
    order: 1,
  },
  {
    id: "bitcoin",
    number: "02",
    title: "Bitcoin",
    track: "foundations",
    summary:
      "Bitcoin’s history, monetary characteristics and role within the broader financial system.",
    whyItMatters:
      "Its monetary design and market role provide essential context for interpreting the wider crypto cycle.",
    status: "completed",
    order: 2,
  },
  {
    id: "ethereum",
    number: "03",
    title: "Ethereum",
    track: "foundations",
    summary:
      "Smart contracts, the Ethereum ecosystem and the fundamentals of staking.",
    whyItMatters:
      "Smart-contract infrastructure connects asset research to applications, network activity and ecosystem risk.",
    status: "completed",
    order: 3,
  },
  {
    id: "wallets",
    number: "04",
    title: "Wallets",
    track: "foundations",
    summary:
      "Wallet types, custody models and the responsible use of digital-asset wallets.",
    whyItMatters:
      "Custody choices define who controls an asset and which operational risks remain.",
    status: "completed",
    order: 4,
  },
  {
    id: "security",
    number: "05",
    title: "Security",
    track: "foundations",
    summary:
      "Protecting digital assets from scams, phishing, operational mistakes and loss of funds.",
    whyItMatters:
      "A sound market thesis has little value when operational security is weak.",
    status: "completed",
    order: 5,
  },
  {
    id: "fundamental-analysis",
    number: "06",
    title: "Fundamental Analysis",
    track: "analysis",
    summary:
      "Evaluating crypto projects beyond market hype through fundamentals, utility, adoption and token structure.",
    whyItMatters:
      "A research thesis needs evidence about utility, adoption and token design—not attention alone.",
    status: "completed",
    order: 6,
  },
  {
    id: "technical-analysis",
    number: "07",
    title: "Technical Analysis",
    track: "analysis",
    summary:
      "Reading charts, market structure, trends and relevant entry or exit areas.",
    whyItMatters:
      "Price structure helps frame timing, invalidation and the conditions surrounding a decision.",
    status: "completed",
    order: 7,
  },
  {
    id: "risk-management",
    number: "08",
    title: "Risk Management",
    track: "analysis",
    summary:
      "Position sizing, stop-loss planning, portfolio exposure and disciplined execution.",
    whyItMatters:
      "Analysis only becomes useful when exposure and invalidation are controlled.",
    status: "completed",
    order: 8,
  },
  {
    id: "defi",
    number: "09",
    title: "DeFi",
    track: "systems",
    summary:
      "Decentralized-finance protocols, yield mechanisms and the risks associated with smart contracts.",
    whyItMatters:
      "Protocol activity and yield matter only when their mechanisms and smart-contract risks are understood.",
    status: "completed",
    order: 9,
  },
  {
    id: "market-narratives",
    number: "10",
    title: "Market Narratives",
    track: "systems",
    summary:
      "Understanding how capital rotates between sectors, themes and market cycles.",
    whyItMatters:
      "Narratives help explain where attention and capital are moving within a broader market cycle.",
    status: "completed",
    order: 10,
  },
  {
    id: "investment-psychology",
    number: "11",
    title: "Investment Psychology",
    track: "systems",
    summary:
      "Managing emotion, bias and decision-making during volatile market conditions.",
    whyItMatters:
      "A repeatable process helps keep emotion and bias from replacing evidence during volatility.",
    status: "completed",
    order: 11,
  },
] as const;
