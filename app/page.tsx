import type { Metadata } from "next";
import {
  About,
  Contact,
  Hero,
  PortfolioPixelField,
} from "@/components/sections/DefinitiveSections";
import { HomeRouteTeasers } from "@/components/sections/HomeRouteTeasers";
import { HomePracticeTabs } from "@/components/sections/HomePracticeTabs";
import { siteConfig } from "@/data/site";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.home.title,
  description: routeSeo.home.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: routeSeo.home.title,
    description: routeSeo.home.description,
    images: [ogImage()],
  },
  twitter: {
    card: "summary_large_image",
    title: routeSeo.home.title,
    description: routeSeo.home.description,
    images: ["/og.png"],
  },
};

export default function Home() {
  const structuredData = baseStructuredData(routeSeo.home);

  return (
    <>
      <main id="main" className="portfolio-pixel-host">
        <PortfolioPixelField />
        <Hero />
        <HomePracticeTabs />
        <About />
        <HomeRouteTeasers />
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
