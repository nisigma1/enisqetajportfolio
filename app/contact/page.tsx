import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { identity, siteConfig } from "@/data/site";

const description =
  "Start a conversation with Enis Qetaj about a digital product, website, automation or research interface.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    siteName: siteConfig.name,
    title: "Contact — Enis Qetaj",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Start a conversation with Enis Qetaj",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Enis Qetaj",
    description,
    images: ["/og.png"],
  },
};

export default function ContactPage() {
  return (
    <main className="inner-page">
      <header>
        <Link href="/">EQ / Index</Link>
        <span>Contact</span>
      </header>
      <section className="contact-page-grid">
        <div>
          <p>{identity.availability}</p>
          <h1>
            Bring the context.
            <br />
            <em>We’ll find the useful form.</em>
          </h1>
          <a href={identity.emailHref}>{identity.email}</a>
          <a href={identity.phoneHref}>{identity.phone}</a>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
