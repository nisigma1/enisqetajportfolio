import { barberProject, besianaProject, hixhameProject, identity, malera, marketInterests, media, siteConfig } from "@/data/site";

export const canonicalOrigin = siteConfig.url;

export const routeSeo = {
  home: {
    path: "/",
    title: "Enis Qetaj | Crypto Markets Research, Geopolitics & AI Products",
    description: siteConfig.description,
  },
  about: {
    path: "/about",
    title: "About Enis Qetaj | Research, Markets & Malera Studio",
    description:
      "Learn about Enis Qetaj, a Kosovo-based financial-markets researcher, crypto trader, AI product builder who completed the Crypto School curriculum, and founder of Malera Studio.",
  },
  research: {
    path: "/research",
    title: "Research | Enis Qetaj",
    description:
      "Explore Enis Qetaj's research approach across crypto markets, macroeconomics, liquidity, geopolitics, monetary policy and on-chain activity.",
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
      "Selected digital work by Enis Qetaj, including Barber Brothers, Hixhame Tina, Besiana Photography and products built through Malera Studio.",
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
  besiana: {
    path: `/work/${besianaProject.slug}`,
    title: "Besiana Photography Website | Enis Qetaj",
    description: besianaProject.description,
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
      "Contact Enis Qetaj in Kosovo about websites, AI products, automation, research interfaces and selected freelance projects.",
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
        primaryImageOfPage: { "@id": `${canonicalOrigin}/#portrait` },
        inLanguage: "en",
      },
    ],
  };
}

export const publicRoutes = [
  routeSeo.home,
  routeSeo.about,
  routeSeo.research,
  routeSeo.markets,
  routeSeo.work,
  routeSeo.barber,
  routeSeo.hixhame,
  routeSeo.besiana,
  routeSeo.build,
  routeSeo.contact,
] as const;
