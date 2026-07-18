import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
export const metadata: Metadata = { title: "Contact — Enis Qetaj", description: "Send Enis Qetaj a short note about a project or collaboration." };
export default function ContactPage() { return <main className="inner-page"><header><Link href="/">EQ / Index</Link><span>Contact</span></header><section className="contact-page-grid"><div><p>Available for select projects</p><h1>Have something<br /><em>worth talking about?</em></h1><a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a><a href="tel:+38344857227">+383 44 857 227</a></div><ContactForm /></section></main>; }

