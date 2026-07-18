import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { EngineSection, ProfileSection, CapabilitiesSection, MarketsSection, BuildSection } from "@/components/sections/CoreSections";
import { WorkSection, ResearchSection, ServicesSection, ProcessSection, EducationSection, BeyondSection, ContactSection } from "@/components/sections/PortfolioSections";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Enis Qetaj",
    email: "mailto:enisqeta5@gmail.com",
    address: { "@type": "PostalAddress", addressCountry: "XK" },
    jobTitle: ["Crypto Trader", "Financial Markets Researcher", "AI Product Builder"],
    knowsAbout: ["Cryptocurrency trading", "Financial markets", "Macroeconomics", "Geopolitics", "Artificial intelligence", "Digital products"],
  };
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <main id="main">
        <Hero />
        <EngineSection />
        <ProfileSection />
        <CapabilitiesSection />
        <MarketsSection />
        <BuildSection />
        <WorkSection />
        <ResearchSection />
        <ServicesSection />
        <ProcessSection />
        <EducationSection />
        <BeyondSection />
        <ContactSection />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    </>
  );
}

