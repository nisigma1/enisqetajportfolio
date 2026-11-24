import { barberProject, besianaProject, hixhameProject, identity, malera, marketInterests, media, nisigmaOnChain, siteConfig } from "@/data/site";
import { duoBarProject } from "@/data/duo-bar";

export const canonicalOrigin = siteConfig.url;

export const routeSeo = {
  home: {
    path: "/",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  about: {
    path: "/about",
    title: "About Enis Qetaj | Research, Markets & Malera Studio",
    description:
      "Learn about Enis Qetaj, a Kosovo-based financial-markets researcher, crypto trader, AI product builder who completed the Crypto School curriculum, and founder of Malera Studio.",
  },
  background: {
    path: "/background",
    title: "Background | Enis Qetaj",
    description: "Education, skills and professional foundation of Enis Qetaj across Marketing, Banking & Finance and Crypto Markets.",
  },
  research: {
    path: "/research",
    title: "Research | Enis Qetaj",
    description:
      "Explore Enis Qetaj's research approach across crypto markets, macroeconomics, liquidity, geopolitics, monetary policy and on-chain activity.",
  },
  nisigmaOnChain: {
    path: nisigmaOnChain.path,
    title: "Nisigma OnChain | CryptoQuant Dashboard by Enis Qetaj",
    description:
      "How Enis Qetaj uses the Nisigma OnChain dashboard on CryptoQuant to interpret network activity, investor behavior and capital flows.",
  },
  markets: {
    path: "/markets",
    title: "Crypto Markets, Macro & Geopolitics | Enis Qetaj",
    description:
      "A layered view of Enis Qetaj's crypto-market research across price, structure, fundamentals, liquidity, macroeconomics, geopolitics and on-chain activity.",
  },
  work: {
    path: "/work",
    title: "Selected Work | Enis Qetaj",
    description:
      "Selected digital work by Enis Qetaj, including Barber Brothers, Hixhame Tina, Besiana Photography and the Malera POS installation at DUO Bar.",
  },
  barber: {
    path: `/work/${barberProject.slug}`,
    title: "Barber Brothers Case Study | Enis Qetaj",
    description: barberProject.description,
  },
  hixhame: {
    path: `/work/${hixhameProject.slug}`,
    title: "Hixhame Tina Case Study | Enis Qetaj",
    description:
      "A responsive website and digital identity for Hixhame Tina, a women-only Hijama service in Prishtina, designed around privacy, trust and direct booking.",
  },
  companies: {
    path: "/companies",
    title: "Malera Studio | Enis Qetaj",
    description: "Malera Studio is the digital product practice founded by Enis Qetaj for websites, web applications, AI products, automation and digital systems.",
  },
  pricing: {
    path: "/pricing",
    title: "Crypto Analysis Plans | Enis Qetaj",
    description: "Monthly crypto market analysis plans covering technical, fundamental and on-chain research, research assistance and live market sessions.",
  },
  besiana: {
    path: `/work/${besianaProject.slug}`,
    title: "Besiana Photography Website | Enis Qetaj",
    description: besianaProject.description,
  },
  duoBar: {
    path: `/work/${duoBarProject.slug}`,
    title: "DUO Bar — Malera POS Case Study | Enis Qetaj",
    description: "An offline point-of-sale system built for DUO Bar, with a visual floor plan, table orders, stock management and business reports.",
  },
  build: {
    path: "/build",
    title: "AI Products, Websites & Automation | Enis Qetaj",
    description:
      "Enis Qetaj builds AI applications, websites, web applications, automation, bots, AI agents and research interfaces through Malera Studio.",
  },
  contact: {
    path: "/contact",
    title: "Contact Enis Qetaj",
    description:
      "Contact Enis Qetaj in Kosovo about crypto analysis or digital projects through Malera Studio, including websites, AI products and automation.",
  },
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${canonicalOrigin}/`).toString();
}

export function ogImage() {
  return {
    url: "/og.png",
    width: 1200,
    height: 630,
    alt: "Enis Qetaj — markets research, macroeconomics, geopolitics and AI product building",
  };
}

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": `${canonicalOrigin}/#person`,
    name: identity.name,
    alternateName: identity.alternateName,
    description: siteConfig.description,
    url: `${canonicalOrigin}/`,
    image: {
      "@type": "ImageObject",
      "@id": `${canonicalOrigin}/#portrait`,
      url: absoluteUrl(media.portrait.desktop.src),
      width: media.portrait.desktop.width,
      height: media.portrait.desktop.height,
    },
    email: `mailto:${identity.email}`,
    telephone: "+38344857227",
    homeLocation: {
      "@type": "Country",
      name: "Kosovo",
    },
    jobTitle: ["Financial Markets Researcher", "Crypto Trader", "AI Product Builder"],
    knowsAbout: [
      ...marketInterests.filter((item) => item !== "Energy" && item !== "International trade" && item !== "Regulation" && item !== "Strategic resources" && item !== "Cross-source research and synthesis"),
      "Artificial intelligence applications",
      "Web applications",
      "Automation",
    ],
    worksFor: { "@id": `${canonicalOrigin}/#organization` },
    sameAs: identity.social.map((profile) => profile.href),
  };
}

export function baseStructuredData(page?: { path: string; title: string; description: string }) {
  const selectedPage = page ?? routeSeo.home;
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "Organization",
        "@id": `${canonicalOrigin}/#organization`,
        name: malera.name,
        url: malera.url,
        founder: { "@id": `${canonicalOrigin}/#person` },
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalOrigin}/#website`,
        name: siteConfig.name,
        url: `${canonicalOrigin}/`,
        inLanguage: "en",
        publisher: { "@id": `${canonicalOrigin}/#person` },
      },
      {
        "@type": selectedPage.path === "/" ? "ProfilePage" : "WebPage",
        "@id": `${absoluteUrl(selectedPage.path)}#webpage`,
        url: absoluteUrl(selectedPage.path),
        name: selectedPage.title,
        description: selectedPage.description,
        isPartOf: { "@id": `${canonicalOrigin}/#website` },
        about: { "@id": `${canonicalOrigin}/#person` },
        ...(selectedPage.path === "/" && { mainEntity: { "@id": `${canonicalOrigin}/#person` } }),
        primaryImageOfPage: { "@id": `${canonicalOrigin}/#portrait` },
        inLanguage: "en",
      },
    ],
  };
}

export const publicRoutes = [
  routeSeo.home,
  routeSeo.about,
  routeSeo.background,
  routeSeo.companies,
  routeSeo.pricing,
  routeSeo.research,
  routeSeo.nisigmaOnChain,
  routeSeo.markets,
  routeSeo.work,
  routeSeo.barber,
  routeSeo.hixhame,
  routeSeo.besiana,
  routeSeo.duoBar,
  routeSeo.build,
  routeSeo.contact,
] as const;
