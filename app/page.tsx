import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero, About, Markets, Work, Build, Contact } from "@/components/sections/DefinitiveSections";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Enis Qetaj",
    email: "mailto:enisqeta5@gmail.com",
    telephone: "+38344857227",
    address: { "@type": "PostalAddress", addressCountry: "XK" },
    jobTitle: ["Crypto Trader", "Financial Markets Researcher", "AI Product Builder"],
    knowsAbout: ["Cryptocurrency markets", "Financial markets", "Macroeconomics", "Global liquidity", "Geopolitics", "Artificial intelligence", "Digital products"],
    worksFor: { "@type": "Organization", name: "Malera Studio", url: "https://www.malera.studio/" },
  };
  return <><a className="skip-link" href="#main">Skip to content</a><Navigation /><main id="main"><Hero /><About /><Markets /><Work /><Build /><Contact /></main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} /></>;
}

