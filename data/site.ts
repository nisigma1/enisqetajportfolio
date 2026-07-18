export const navigation = [
  { label: "Index", href: "#index" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Markets", href: "#markets" },
  { label: "Build", href: "#build" },
  { label: "Contact", href: "#contact" },
] as const;

export const identity = {
  name: "Enis Qetaj",
  location: "Kosovo",
  email: "enisqeta5@gmail.com",
  phone: "+383 44 857 227",
  phoneHref: "tel:+38344857227",
  roles: ["Crypto Trader", "Financial Markets Researcher", "AI Product Builder", "Independent Freelancer"],
  education: [
    { degree: "Bachelor’s Degree", subject: "Marketing", status: "Completed" },
    { degree: "Master’s Degree", subject: "Banking and Finance", status: "First year in progress" },
  ],
} as const;

export const marketLayers = [
  { name: "Price", question: "What is happening?", note: "Price is the first visible signal—not the conclusion." },
  { name: "Structure", question: "How is the market behaving?", note: "Trend, momentum, positioning and important levels add shape." },
  { name: "Fundamentals", question: "What supports or weakens it?", note: "Adoption, token dynamics and the underlying project change the reading." },
  { name: "Liquidity", question: "Where is capital moving?", note: "Financial conditions help explain when risk can expand or contract." },
  { name: "Macro", question: "What environment surrounds it?", note: "Rates, inflation and monetary policy set the wider conditions." },
  { name: "Geopolitics", question: "What could change the context?", note: "Trade, conflict, energy and policy can redraw the map quickly." },
  { name: "On-chain", question: "What does activity reveal?", note: "Blockchain flows add another view of positioning and behavior." },
] as const;

export const problems = [
  { problem: "I need a better digital presence.", group: "Presence", forms: "Website, digital identity, landing page", response: "Make the offer easier to understand and harder to forget." },
  { problem: "I have an idea, but not a product.", group: "Product", forms: "Web application, AI tool, prototype", response: "Define the real use case before deciding what to build." },
  { problem: "I repeat the same workflow every day.", group: "Automation", forms: "Automation, bot, connected workflow", response: "Remove repetition while keeping the process visible and controllable." },
  { problem: "I need a custom tool.", group: "Product", forms: "Custom application, internal platform", response: "Shape the tool around the work instead of forcing the work into generic software." },
  { problem: "I need information presented clearly.", group: "Financial interfaces", forms: "Dashboard, research interface, decision tool", response: "Turn scattered inputs into a view people can actually use." },
] as const;

export const barberProject = {
  title: "Barber Brothers",
  slug: "barber-brothers",
  category: "Web Experience / Booking",
  url: "https://barberbrothers.style/",
  description: "A customer-facing web experience for a barber business in Fushë Kosovë, bringing brand information and a direct booking journey into one place.",
  knownFeatures: ["Bilingual brand experience", "Barber selection", "Service, date and time selection", "Direct appointment flow"],
} as const;

export const malera = {
  name: "Malera Studio",
  url: "https://www.malera.studio/",
  line: "A small creative studio building digital products, brands and experiences from Kosovo.",
  services: "Websites, mobile apps, video content and AI tools.",
} as const;

