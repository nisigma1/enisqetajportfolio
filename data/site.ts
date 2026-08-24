export const siteConfig = {
  name: "Enis Qetaj",
  url: "https://enisqetaj.com",
  title: "Enis Qetaj | Crypto Markets Research, Geopolitics & AI Products",
  description:
    "Enis Qetaj is a Kosovo-based crypto trader, financial-markets researcher and AI product builder focused on crypto, macroeconomics, geopolitics, on-chain analysis and digital products.",
} as const;

export const navigation = [
  { label: "Index", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Markets", href: "/markets" },
  { label: "Work", href: "/work" },
  { label: "Build", href: "/build" },
  { label: "Contact", href: "/contact" },
] as const;

export const identity = {
  name: "Enis Qetaj",
  location: "Kosovo",
  email: "enisqeta5@gmail.com",
  emailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=enisqeta5%40gmail.com",
  phone: "+383 44 857 227",
  phoneHref: "tel:+38344857227",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/enis-qetaj-47a847308" },
    { label: "Instagram", href: "https://www.instagram.com/enis_qeta/" },
    { label: "Facebook", href: "https://www.facebook.com/enis.qeta/" },
    { label: "X", href: "https://x.com/N1sigma" },
  ],
  availability: "Available for selected freelance work",
  roles: [
    "Crypto Trader",
    "Financial Markets Researcher",
    "Research and Analysis",
    "Macroeconomics and Geopolitics",
    "AI Product Builder",
    "Founder of Malera Studio",
    "Independent Freelancer",
  ],
  education: [
    {
      degree: "Bachelor’s Degree",
      subject: "Marketing",
      status: "Completed",
    },
    {
      degree: "Master’s Degree",
      subject: "Banking and Finance",
      status: "First year in progress",
    },
  ],
} as const;

export const cryptoEducation = {
  provider: "Crypto School",
  credential: "Crypto Markets Curriculum",
  status: "Completed",
  mentorRegion: "Kosovo and North Macedonia",
  focus: [
    "Technical analysis",
    "Fundamental analysis",
    "On-chain analysis",
  ],
  summary:
    "Completed Crypto School market training with mentors from Kosovo and North Macedonia, building a more structured way to connect technical, fundamental and on-chain evidence.",
} as const;

export const marketInterests = [
  "Cryptocurrency markets",
  "Technical analysis",
  "Fundamental analysis",
  "Market structure",
  "Macroeconomics",
  "Global liquidity",
  "Monetary policy",
  "Geopolitics",
  "Energy",
  "International trade",
  "Regulation",
  "Strategic resources",
  "On-chain research",
  "Market narratives",
  "Cross-source research and synthesis",
] as const;

export const researchMethod = [
  {
    number: "01",
    title: "Question",
    note: "Define what needs to be understood before collecting more information.",
  },
  {
    number: "02",
    title: "Sources",
    note: "Gather credible evidence and trace important claims back to their origin.",
  },
  {
    number: "03",
    title: "Cross-check",
    note: "Compare where sources and signals agree, conflict or leave a gap.",
  },
  {
    number: "04",
    title: "Interpretation",
    note: "Connect market, macro, geopolitical and on-chain evidence without overstating certainty.",
  },
  {
    number: "05",
    title: "Limitations",
    note: "State what remains uncertain, missing or dependent on changing conditions.",
  },
  {
    number: "06",
    title: "Implications",
    note: "Explain what the connected evidence could mean and what may change the situation.",
  },
] as const;

export const researchDomains = [
  "Cryptocurrency markets",
  "Technical & fundamental analysis",
  "Market structure",
  "Liquidity & monetary policy",
  "Macroeconomics",
  "Energy & strategic resources",
  "Trade, conflict & regulation",
  "On-chain behavior",
  "Market narratives",
] as const;

export const buildCapabilities = [
  "AI applications",
  "Web applications",
  "Websites",
  "Bots",
  "Automation",
  "Digital products",
  "Trading and research interfaces",
] as const;

export const marketLayers = [
  {
    id: "price",
    number: "01",
    name: "Price",
    question: "What is visible?",
    note: "Price is the first observation. Useful, immediate—and incomplete.",
    context: "One signal",
    indicators: ["Technical analysis", "Market structure", "Market narratives"],
    change: "The move becomes observable—but it is still isolated.",
  },
  {
    id: "structure",
    number: "02",
    name: "Structure",
    question: "How is it behaving?",
    note: "Trend, momentum, positioning and important levels give the observation shape.",
    context: "Behavior",
    indicators: ["Market structure", "Technical analysis", "Market narratives"],
    change: "The isolated move gains a pattern.",
  },
  {
    id: "fundamentals",
    number: "03",
    name: "Fundamentals",
    question: "What supports it?",
    note: "Fundamental analysis tests what supports the move and where the narrative may be incomplete.",
    context: "Underlying conditions",
    indicators: ["Fundamental analysis", "Market narratives", "Cryptocurrency markets"],
    change: "The pattern gains underlying conditions.",
  },
  {
    id: "liquidity",
    number: "04",
    name: "Liquidity",
    question: "Where is capital moving?",
    note: "Financial conditions help explain when risk can expand, contract or rotate.",
    context: "Capital flow",
    indicators: ["Global liquidity", "Monetary policy", "Market structure"],
    change: "The conditions gain capital flow.",
  },
  {
    id: "macro",
    number: "05",
    name: "Macro",
    question: "What environment surrounds it?",
    note: "Rates, inflation, growth and monetary policy widen the frame beyond one asset.",
    context: "Economic environment",
    indicators: ["Macroeconomics", "Global liquidity", "Monetary policy"],
    change: "The asset gains an economic environment.",
  },
  {
    id: "geopolitics",
    number: "06",
    name: "Geopolitics",
    question: "What can redraw the map?",
    note: "Trade, conflict, energy and policy can change the context quickly.",
    context: "External forces",
    indicators: ["Geopolitics", "Monetary policy", "Global liquidity"],
    change: "The environment gains external forces.",
  },
  {
    id: "on-chain",
    number: "07",
    name: "On-chain",
    question: "What does network activity add?",
    note: "Flows and behavior recorded on-chain complete another part of the wider picture.",
    context: "Network behavior",
    indicators: ["On-chain research", "Cryptocurrency markets", "Market narratives"],
    change: "The picture gains behavior recorded on the network.",
  },
] as const;

export const problems = [
  {
    problem: "I need a digital presence that explains the value.",
    group: "Digital presence",
    need: "Make the value understandable.",
    reframe: "Start with the audience and the decision they need to make.",
    forms: "Website / digital identity",
    response: "Give the message a focused digital form.",
  },
  {
    problem: "I have an idea that needs to become a product.",
    group: "Product idea",
    need: "Turn an idea into something useful.",
    reframe: "Find the smallest useful version and define its essential flow.",
    forms: "AI application / web application",
    response: "Shape an interaction that earns its place.",
  },
  {
    problem: "I repeat work that should be automated.",
    group: "Repetitive work",
    need: "Remove recurring friction.",
    reframe: "Map the workflow and its handoffs before choosing technology.",
    forms: "Automation / bot",
    response: "Build a system people can understand and trust.",
  },
  {
    problem: "I need a custom tool.",
    group: "Custom tool",
    need: "Support a specific job.",
    reframe: "Understand the real workflow and the people doing the work.",
    forms: "Purpose-built web application",
    response: "Turn the workflow into a clear interface.",
  },
  {
    problem: "I need complex information to become understandable.",
    group: "Complex information",
    need: "See what matters and why.",
    reframe: "Create hierarchy and connect each signal to its context.",
    forms: "Trading / research interface",
    response: "Build a view that supports clearer decisions.",
  },
] as const;

export const barberProject = {
  title: "Barber Brothers",
  slug: "barber-brothers",
  category: "Web experience / booking",
  url: "https://www.barberbrothers.style/",
  location: "Fushë Kosovë",
  description:
    "A bilingual customer-facing web experience for a barber business in Fushë Kosovë, connecting brand information with a direct booking journey.",
  knownFeatures: [
    "Albanian and English experience",
    "Service selection",
    "Barber selection",
    "Date and time selection",
    "Customer details and booking summary",
  ],
  bookingSteps: ["Service", "Barber", "Date", "Time", "Customer details"],
  chapters: [
    "Business context",
    "Product idea",
    "Customer journey",
    "Interface detail",
    "Real environment",
    "Responsive experience",
    "Live product",
  ],
} as const;

export const hixhameProject = {
  title: "Hixhame Tina",
  slug: "hixhame-tina",
  category: "Website / Women’s wellness",
  url: "https://hixhametina.com/",
  location: "Kolovicë, Prishtina",
  phone: "+383 45 836 605",
  phoneHref: "tel:+38345836605",
  instagram: "@hixhametina",
  instagramUrl: "https://www.instagram.com/hixhametina/",
  description:
    "A premium multilingual website for a women-only Hijama service in Prishtina, designed around privacy, trust, clear information and direct appointment booking.",
  knownFeatures: [
    "Privacy-first presentation",
    "Trust-driven content",
    "Direct WhatsApp and telephone booking",
    "Responsive experience",
    "Six working language routes",
    "Production deployment",
  ],
  locales: ["Albanian", "English", "German", "French", "Turkish", "Italian"],
} as const;

export const besianaProject = {
  title: "Besiana Photography",
  slug: "besiana-photography",
  category: "Website / Photography",
  url: "https://besianaphotography.com/",
  location: "Kosovo",
  description:
    "A warm, story-led photography website for Besiana Photography, designed to make real moments, services and contact paths feel easy to explore.",
  knownFeatures: [
    "Wedding, engagement and event photography",
    "Portrait, family and business sessions",
    "Responsive visual portfolio",
    "Direct WhatsApp contact",
  ],
} as const;

export const projectMedia = [
  {
    id: "barber-place",
    role: "REAL_ENVIRONMENT",
    src: "/images/barber/space-3.webp",
    width: 1200,
    height: 960,
    aspectRatio: "5 / 4",
    display: "cover",
    mobileDisplay: "cover",
    focalPoint: "50% 50%",
    alt: "Barber Brothers exterior in Fushë Kosovë",
  },
  {
    id: "barber-interior",
    role: "EDITORIAL_PORTRAIT",
    src: "/images/barber/space-1.webp",
    width: 1023,
    height: 1537,
    aspectRatio: "1023 / 1537",
    display: "cover",
    mobileDisplay: "cover",
    focalPoint: "50% 42%",
    alt: "Interior of Barber Brothers in Fushë Kosovë",
  },
  {
    id: "barber-detail",
    role: "INTERFACE_CONTEXT",
    src: "/images/barber/space-2.webp",
    width: 1086,
    height: 1448,
    aspectRatio: "3 / 4",
    display: "cover",
    mobileDisplay: "cover",
    focalPoint: "52% 44%",
    alt: "Barber chair and interior detail at Barber Brothers",
  },
] as const;

export const malera = {
  name: "Malera Studio",
  url: "https://malera.studio/",
  line: "The professional studio founded by Enis Qetaj for digital products, websites, AI applications and automation.",
} as const;

export const media = {
  portrait: {
    role: "IDENTITY_PORTRAIT",
    desktop: {
      src: "/images/enis/enis-desktop.webp",
      width: 1125,
      height: 1500,
      aspectRatio: "3 / 4",
      displayMode: "contain",
      mobileDisplayMode: "contain",
      focalPoint: "50% 50%",
      objectPosition: "50% 50%",
      loadingPriority: "high",
    },
    tablet: {
      src: "/images/enis/enis-tablet.webp",
      width: 900,
      height: 1200,
      aspectRatio: "3 / 4",
      displayMode: "contain",
      mobileDisplayMode: "contain",
      focalPoint: "50% 50%",
      objectPosition: "50% 50%",
      loadingPriority: "high",
    },
    mobile: {
      src: "/images/enis/enis-mobile.webp",
      width: 750,
      height: 1000,
      aspectRatio: "3 / 4",
      displayMode: "contain",
      mobileDisplayMode: "contain",
      focalPoint: "50% 50%",
      objectPosition: "50% 50%",
      loadingPriority: "high",
    },
  },
  barber: {
    identity: {
      src: "/images/barber/hero-logo.webp",
      width: 720,
      height: 480,
      aspectRatio: "3 / 2",
      role: "PROJECT_IDENTITY",
      displayMode: "contain",
      mobileDisplayMode: "contain",
      focalPoint: "50% 50%",
      loadingPriority: "lazy",
      display: "contain",
    },
    interior: {
      src: "/images/barber/space-1.webp",
      width: 1023,
      height: 1537,
      aspectRatio: "1023 / 1537",
      role: "EDITORIAL_PORTRAIT",
      displayMode: "cover",
      mobileDisplayMode: "cover",
      focalPoint: "50% 42%",
      loadingPriority: "lazy",
      display: "cover",
      objectPosition: "50% 42%",
    },
    chair: {
      src: "/images/barber/space-2.webp",
      width: 1086,
      height: 1448,
      aspectRatio: "3 / 4",
      role: "EDITORIAL_PORTRAIT",
      displayMode: "cover",
      mobileDisplayMode: "cover",
      focalPoint: "52% 44%",
      loadingPriority: "lazy",
      display: "cover",
      objectPosition: "52% 44%",
    },
    exterior: {
      src: "/images/barber/space-3.webp",
      width: 1200,
      height: 960,
      aspectRatio: "5 / 4",
      role: "EDITORIAL_LANDSCAPE",
      displayMode: "cover",
      mobileDisplayMode: "cover",
      focalPoint: "50% 50%",
      loadingPriority: "lazy",
      display: "cover",
      objectPosition: "50% 50%",
    },
  },
} as const;
