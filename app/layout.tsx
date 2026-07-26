import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/data/site";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { RouteTransitionProvider } from "@/components/transition/RouteTransitionProvider";
import "@fontsource-variable/manrope";
import "@fontsource-variable/newsreader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s — Enis Qetaj",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
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
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#111410" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const themeScript =
    "try{var t=localStorage.getItem('enis-theme');var d=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=d}catch(e){}";
  const scrollScript =
    "(()=>{try{history.scrollRestoration='manual';const r=()=>{if(!location.hash)scrollTo(0,0)};r();addEventListener('pageshow',()=>{r();requestAnimationFrame(()=>{r();requestAnimationFrame(r)});setTimeout(r,120)})}catch(e){}})();";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
      </head>
      <body>
        <RouteTransitionProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <Navigation />
          {children}
          <Footer />
        </RouteTransitionProvider>
      </body>
    </html>
  );
}
