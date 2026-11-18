import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
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
      <InnerPageShell
        variant="contact"
        title="Contact"
        summary="Tell me about a project or ask a question about crypto analysis."
      >
        <div className="contact-conversion">
          <section className="contact-details" aria-labelledby="direct-contact-title">
            <h2 id="direct-contact-title">Direct contact</h2>
            <div className="contact-direct">
              <a href={`mailto:${identity.email}`}><span>Email</span><strong>{identity.email}</strong></a>
              <a href={identity.phoneHref}><span>Phone</span><strong>{identity.phone}</strong></a>
              <a href={malera.url}><span>Studio</span><strong>malera.studio</strong></a>
            </div>
          </section>
          <ContactForm />
        </div>
      </InnerPageShell>
      <StructuredData data={baseStructuredData(routeSeo.contact)} />
    </>
  );
}
