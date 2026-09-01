import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { InnerPageShell } from "@/components/layout/InnerPageShell";
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
      <InnerPageShell
        variant="contact"
        eyebrow="Contact / Choose the right path"
        title="Why are you contacting me?"
        summary="Select the context first so the conversation can begin with the right information."
        meta={["Crypto analysis", "Digital work", "Direct contact"]}
      >
        <section className="inner-section contact-pathways" aria-labelledby="contact-pathways-title">
          <h2 id="contact-pathways-title" className="visually-hidden">Contact pathways</h2>
          <article>
            <p className="inner-section__label">01 / Crypto analysis</p>
            <h3>Request market analysis.</h3>
            <p>For technical analysis, fundamental analysis, on-chain analysis, subscription plans and crypto research.</p>
            <ul><li>Technical</li><li>Fundamental</li><li>On-chain</li><li>Subscriptions</li></ul>
            <Link className="button button--primary" href="/contact?service=crypto-analysis#contact-form">Request analysis <ActionMark direction="forward" /></Link>
          </article>
          <article>
            <p className="inner-section__label">02 / Malera · Digital work</p>
            <h3>Discuss a digital project.</h3>
            <p>For websites, applications, AI products, automation, AI agents and digital systems.</p>
            <ul><li>Websites</li><li>Applications</li><li>AI products</li><li>Automation</li></ul>
            <Link className="button button--quiet" href="/contact?service=digital-project#contact-form">Discuss a project <ActionMark direction="forward" /></Link>
          </article>
        </section>

        <section className="inner-section contact-conversion" aria-labelledby="contact-form-title">
          <aside>
            <p className="inner-section__label">03 / Direct contact</p>
            <h2 id="contact-form-title">Send the context.</h2>
            <div className="contact-direct">
              <a href={identity.emailHref} target="_blank" rel="noreferrer"><span>Email</span><strong>{identity.email}</strong></a>
              <a href={identity.phoneHref}><span>Phone</span><strong>{identity.phone}</strong></a>
              <a href={malera.url} target="_blank" rel="noreferrer"><span>Company</span><strong>Malera Studio <ActionMark direction="external" /></strong></a>
            </div>
            <small>This form prepares an email draft. It does not send or store your message.</small>
          </aside>
          <ContactForm />
        </section>
      </InnerPageShell>
      <StructuredData data={baseStructuredData(routeSeo.contact)} />
    </>
  );
}
