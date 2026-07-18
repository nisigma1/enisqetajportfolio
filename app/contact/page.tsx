import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
export const metadata: Metadata = { title: "Contact — Enis Qetaj", description: "Start a focused conversation with Enis Qetaj about an AI product, website, automation or research tool." };
export default function ContactPage() { return <main className="archive-page contact-route"><header><Link href="/">EQ / Back to index</Link><p>11 / CONTACT</p></header><section><div><p className="availability"><i /> Available for select freelance projects</p><h1>Have an idea<br /><em>worth building?</em></h1><p>Let’s turn it into something useful, intelligent and visually distinct.</p></div><ContactForm /></section></main>; }

