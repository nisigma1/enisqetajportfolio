import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { ActionMark } from "@/components/ui/ActionMark";
import { identity, malera, siteConfig } from "@/data/site";

const description = "Start a conversation with Enis Qetaj about a digital product, website, automation or research interface.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: "/contact", siteName: siteConfig.name, title: "Contact — Enis Qetaj", description, images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Contact — Enis Qetaj", description, images: ["/og.png"] },
};

export default function ContactPage() {
  return (
    <main id="main" className="route-page contact-route">
      <header className="route-hero">
        <p>Contact / Selected freelance projects</p>
        <h1>Bring the context.<br />We’ll find the useful form.</h1>
        <div>
          <p>Websites, digital products, AI applications, automation and research interfaces.</p>
          <span>Kosovo / Independent practice</span>
        </div>
      </header>

      <section className="route-contact">
        <aside>
          <p>Direct contact</p>
          <strong>{identity.name}</strong>
          <a href={identity.emailHref} target="_blank" rel="noreferrer">{identity.email}</a>
          <a href={identity.phoneHref}>{identity.phone}</a>
          <a href={malera.url} target="_blank" rel="noreferrer">Malera Studio <ActionMark direction="external" /></a>
          <small>This form prepares an email draft. It does not send or store your message.</small>
        </aside>
        <ContactForm />
      </section>
    </main>
  );
}
