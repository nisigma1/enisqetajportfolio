import type { Metadata } from "next";
import { headers } from "next/headers";
import { Archivo, Newsreader } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], display: "swap", style: ["normal", "italic"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "enis-qetaj-signal.enis-qetaj.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "Enis Qetaj — Markets, Products and Independent Work";
  const description = "Enis Qetaj is a crypto trader, financial markets researcher and AI product builder from Kosovo.";
  return {
    metadataBase: base,
    title,
    description,
    alternates: { canonical: new URL("/", base) },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { type: "website", url: base, title, description, images: [{ url: new URL("/og.png", base), width: 1200, height: 630, alt: "Enis Qetaj — Reading markets, making things" }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", base)] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${archivo.variable} ${newsreader.variable}`}>{children}</body></html>;
}

