import type { Metadata } from "next";
import {
  About,
  Build,
  Contact,
  Hero,
  Malera,
  Markets,
  Work,
} from "@/components/sections/DefinitiveSections";
import {
  barberProject,
  buildCapabilities,
  identity,
  malera,
  marketInterests,
  siteConfig,
} from "@/data/site";

export const metadata: Metadata = {
  title: "Markets, Research, Geopolitics & Digital Products",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Enis Qetaj — markets, research, geopolitics and digital products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export default function Home() {
  const personId = `${siteConfig.url}/#enis-qetaj`;
  const studioId = `${siteConfig.url}/#malera-studio`;
  const projectId = `${siteConfig.url}/#barber-brothers`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: identity.name,
        url: siteConfig.url,
        email: identity.email,
        telephone: identity.phone,
        address: {
          "@type": "PostalAddress",
          addressCountry: "XK",
        },
        jobTitle: identity.roles,
        knowsAbout: [...marketInterests, ...buildCapabilities],
        affiliation: { "@id": studioId },
      },
      {
        "@type": "WebApplication",
        "@id": projectId,
        name: barberProject.title,
        url: barberProject.url,
        creator: { "@id": personId },
        inLanguage: ["sq", "en"],
        description: barberProject.description,
      },
      {
        "@type": "Organization",
        "@id": studioId,
        name: malera.name,
        url: malera.url,
      },
    ],
  };

  return (
    <>
      <main id="main">
        <Hero />
        <About />
        <Markets />
        <Work />
        <Build />
        <Malera />
        <Contact />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
