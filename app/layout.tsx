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
  const title = "Enis Qetaj — Markets, Research & Product Systems";
  const description = "Enis Qetaj studies financial markets and builds useful digital products, research tools and automation from Kosovo.";

  return {
    metadataBase: base,
    title,
    description,
    alternates: { canonical: new URL("/", base) },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      type: "website",
      url: base,
      title,
      description,
      images: [{ url: new URL("/og.png", base), width: 1200, height: 630, alt: "Enis Qetaj — Markets, Research & Product Systems" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", base)] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeScript = "try{var t=localStorage.getItem('enis-theme');var d=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=d}catch(e){}";
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body className={`${archivo.variable} ${newsreader.variable}`}>{children}</body></html>;
}
