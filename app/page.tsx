import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero, About, Markets, Work, Build, Malera, Contact } from "@/components/sections/DefinitiveSections";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "/#enis-qetaj",
        name: "Enis Qetaj",
        email: "mailto:enisqeta5@gmail.com",
        telephone: "+38344857227",
        address: { "@type": "PostalAddress", addressCountry: "XK" },
        jobTitle: ["Crypto Trader", "Financial Markets Researcher", "AI Product Builder", "Independent Freelancer"],
        knowsAbout: ["Cryptocurrency markets", "Financial markets", "Macroeconomics", "Global liquidity", "Geopolitics", "Artificial intelligence", "Digital products"],
        worksFor: { "@id": "/#malera-studio" },
      },
      {
        "@type": "CreativeWork",
        "@id": "/#barber-brothers",
        name: "Barber Brothers — Web Experience and Booking",
        url: "https://barberbrothers.style/",
        creator: { "@id": "/#enis-qetaj" },
        description: "A customer-facing web experience and direct booking journey for Barber Brothers in Fushë Kosovë.",
      },
      {
        "@type": "Organization",
        "@id": "/#malera-studio",
        name: "Malera Studio",
        url: "https://malera.studio/",
        description: "A small creative studio building websites, applications, video content and AI tools.",
      },
      {
        "@type": "ItemList",
        name: "Digital product services",
        itemListElement: ["Digital presence", "Product shaping", "Workflow automation", "Information design"].map((name, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "Service", name, provider: { "@id": "/#enis-qetaj" } },
        })),
      },
    ],
  };

  return <><a className="skip-link" href="#main">Skip to content</a><Navigation /><main id="main"><Hero /><About /><Markets /><Work /><Build /><Malera /><Contact /></main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></>;
}
