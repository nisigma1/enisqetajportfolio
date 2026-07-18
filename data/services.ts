export type Service = {
  title: string;
  what: string;
  forWhom: string;
  problem: string;
  deliverables: string;
};

export const services: readonly Service[] = [
  { title: "AI-powered websites", what: "A focused website with useful AI-assisted experiences.", forWhom: "Independent teams and growing businesses.", problem: "Turns a complex offer into a clear, interactive experience.", deliverables: "Strategy, interface, responsive build and AI integration." },
  { title: "Business websites", what: "A credible digital home built around real visitor decisions.", forWhom: "Businesses that need clarity and a stronger presence.", problem: "Replaces scattered information with a coherent journey.", deliverables: "Structure, design, development and launch support." },
  { title: "AI applications", what: "A functional product that applies AI to a defined workflow.", forWhom: "Teams with a specific research or operations problem.", problem: "Makes repeatable knowledge work faster and easier to use.", deliverables: "Prototype, interface, model workflow and product logic." },
  { title: "Custom web applications", what: "A browser-based tool shaped around a particular process.", forWhom: "Teams whose workflow does not fit generic software.", problem: "Connects people, information and actions in one system.", deliverables: "Product definition, interface and functional build." },
  { title: "Bots", what: "A focused assistant for monitoring, routing or repetitive tasks.", forWhom: "Operators, researchers and small teams.", problem: "Reduces manual repetition without hiding the workflow.", deliverables: "Conversation flow, integrations and deployment structure." },
  { title: "Workflow automation", what: "A connected process that moves routine work between tools.", forWhom: "Teams with clear, repeated operational steps.", problem: "Removes avoidable handoffs and inconsistent execution.", deliverables: "Workflow map, automation and maintainable documentation." },
  { title: "Trading dashboards", what: "A clear interface for organizing market information.", forWhom: "Traders and research teams with defined data sources.", problem: "Turns fragmented inputs into a usable research view.", deliverables: "Information architecture, interface and data-ready build." },
  { title: "Financial research tools", what: "A purpose-built system for collecting and interpreting research.", forWhom: "Market researchers and finance-focused teams.", problem: "Creates structure around sources, notes and relationships.", deliverables: "Research workflow, taxonomy, interface and prototype." },
  { title: "Landing pages", what: "A concise page centered on one audience and action.", forWhom: "New products, campaigns and independent launches.", problem: "Communicates value quickly without generic sales language.", deliverables: "Messaging structure, visual direction and responsive page." },
  { title: "Digital prototypes", what: "A working expression of an idea before full investment.", forWhom: "Founders and teams testing a product direction.", problem: "Makes assumptions visible and easier to evaluate.", deliverables: "Scope, interactive prototype and next-step blueprint." },
] as const;

export const productTypes = [
  { title: "Website", audience: "A business or independent practice that needs a credible digital home.", problem: "Unclear positioning and a fragmented visitor journey.", deliverables: "Strategy, editorial interface, responsive build and launch.", flow: ["Audience", "Story", "Interface", "System"] },
  { title: "AI Application", audience: "A team with a specific knowledge-work problem.", problem: "Valuable information is difficult to access or act on.", deliverables: "Product definition, AI workflow and usable application.", flow: ["Problem", "Context", "Model", "Product"] },
  { title: "Web Platform", audience: "A team coordinating people, information and repeat actions.", problem: "Work is spread across disconnected tools and views.", deliverables: "Information architecture, core flows and platform interface.", flow: ["Roles", "Data", "Flows", "Platform"] },
  { title: "Bot", audience: "A researcher or operator managing repetitive inputs.", problem: "Routine monitoring and routing consumes focused time.", deliverables: "Bot logic, conversational flow and integration structure.", flow: ["Trigger", "Logic", "Action", "Review"] },
  { title: "Automation", audience: "A small team with a stable, repeated process.", problem: "Manual handoffs create delay and inconsistency.", deliverables: "Workflow map, connected automation and clear controls.", flow: ["Input", "Rules", "Route", "Output"] },
  { title: "Trading Dashboard", audience: "A market participant with defined research inputs.", problem: "Signals are fragmented and difficult to compare.", deliverables: "Research architecture and a data-ready decision interface.", flow: ["Sources", "Signals", "Context", "View"] },
  { title: "Research Tool", audience: "A researcher connecting sources, notes and relationships.", problem: "Context is lost between collection and interpretation.", deliverables: "Taxonomy, research flow and functional prototype.", flow: ["Collect", "Connect", "Interpret", "Archive"] },
  { title: "Digital Prototype", audience: "A founder or team testing a focused product hypothesis.", problem: "An idea needs to become tangible before larger investment.", deliverables: "Scoped concept, interactive prototype and product blueprint.", flow: ["Hypothesis", "Scope", "Prototype", "Learn"] },
] as const;

