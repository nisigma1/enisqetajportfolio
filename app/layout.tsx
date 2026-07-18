import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL("https://enisqetaj.com"),
  title: "Enis Qetaj — Crypto Trader, Financial Markets Researcher and AI Builder",
  description: "Personal portfolio of Enis Qetaj, focused on cryptocurrency trading, financial markets research, macroeconomics, geopolitics and AI-powered digital products.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "Enis Qetaj — Markets, Research and Intelligent Systems",
    description: "Crypto trader and markets researcher connecting analysis, macroeconomics and geopolitics with AI-powered digital products.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Enis Qetaj — Analyzing signals, building systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enis Qetaj — Markets, Research and Intelligent Systems",
    description: "Analyzing signals. Building systems.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>{children}</body></html>;
}

