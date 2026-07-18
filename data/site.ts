export const navigation = [
  { label: "Index", href: "#index" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
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
  { name: "Price", question: "What is visible?", note: "Price is the first observation. Useful, immediate—and incomplete.", context: "One signal" },
  { name: "Structure", question: "How is it behaving?", note: "Trend, momentum, positioning and important levels give the observation shape.", context: "Behavior" },
  { name: "Fundamentals", question: "What supports it?", note: "Adoption, token dynamics and the underlying project change what the movement can mean.", context: "Underlying conditions" },
  { name: "Liquidity", question: "Where is capital moving?", note: "Financial conditions help explain when risk can expand, contract or rotate.", context: "Capital flow" },
  { name: "Macro", question: "What environment surrounds it?", note: "Rates, inflation, growth and monetary policy widen the frame beyond one asset.", context: "Economic environment" },
  { name: "Geopolitics", question: "What can redraw the map?", note: "Trade, conflict, energy and policy can change the context quickly.", context: "External forces" },
  { name: "On-chain", question: "What does network activity add?", note: "Flows and behavior recorded on-chain complete another part of the wider picture.", context: "Network behavior" },
] as const;

export const problems = [
  { problem: "I need a digital presence that actually explains the value.", group: "Digital presence", forms: "Website / digital identity", response: "Start with the audience and the decision they need to make, then give the message a focused form." },
  { problem: "I have an idea but it is not a usable product yet.", group: "Product idea", forms: "AI tool / web application", response: "Find the smallest useful version, define the flow, and make the interaction earn its place." },
  { problem: "The same work keeps repeating across my day.", group: "Repetitive work", forms: "Automation / bot", response: "Map the handoffs first. The goal is less friction, not a black box nobody trusts." },
  { problem: "I need a tool made for a very specific job.", group: "Custom tool", forms: "Purpose-built application", response: "Turn the real workflow into an interface that feels obvious to the people doing the work." },
  { problem: "The information is there, but it is hard to use.", group: "Complex information", forms: "Trading / research interface", response: "Create hierarchy, context and a view that helps people connect the right signals." },
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
  url: "https://malera.studio/",
  line: "A small creative studio building digital products, brands and experiences from Kosovo.",
  services: "Websites, mobile apps, video content and AI tools.",
} as const;
