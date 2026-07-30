import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { ActionMark } from "@/components/ui/ActionMark";
import { identity, malera, siteConfig } from "@/data/site";
import { StructuredData } from "@/components/seo/StructuredData";
import { baseStructuredData, ogImage, routeSeo } from "@/lib/seo";

const description = routeSeo.contact.description;

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: routeSeo.contact.title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: "/contact", siteName: siteConfig.name, title: routeSeo.contact.title, description, images: [ogImage()] },
  twitter: { card: "summary_large_image", title: routeSeo.contact.title, description, images: ["/og.png"] },
};

export default function ContactPage() {
  return (
    <>
      <main id="main" className="route-page contact-route">
      <header className="route-hero">
        <p>Contact / Selected freelance projects</p>
        <h1>Contact Enis Qetaj</h1>
        <div>
          <p>Reach Enis Qetaj directly for selected freelance work, websites, digital products, AI applications, automation and research interfaces.</p>
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
      <StructuredData data={baseStructuredData(routeSeo.contact)} />
    </>
  );
}
