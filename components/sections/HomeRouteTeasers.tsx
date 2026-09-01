import Link from "next/link";
import { ActionMark } from "@/components/ui/ActionMark";

const teasers = [
  {
    number: "01",
    label: "Background",
    title: "Marketing / Finance / Crypto",
    copy: "A connected progression from audience understanding to financial systems and applied crypto-market research.",
    href: "/background",
    cta: "View background",
  },
  {
    number: "02",
    label: "Pricing",
    title: "Crypto market analysis from €30 / month",
    copy: "Three monthly research plans with increasing depth across technical, fundamental and on-chain analysis.",
    href: "/pricing",
    cta: "View pricing",
  },
  {
    number: "03",
    label: "Companies",
    title: "Malera Studio",
    copy: "The digital product and AI-building practice founded by Enis Qetaj.",
    href: "/companies",
    cta: "View companies",
  },
] as const;

export function HomeRouteTeasers() {
  return (
    <section className="site-section home-route-teasers" aria-labelledby="home-route-teasers-title">
      <header>
        <p>03 / Explore</p>
        <h2 id="home-route-teasers-title">Follow the part of the practice you need.</h2>
      </header>
      <ol>
        {teasers.map((teaser) => (
          <li key={teaser.href}>
            <span>{teaser.number} / {teaser.label}</span>
            <h3>{teaser.title}</h3>
            <p>{teaser.copy}</p>
            <Link className="button button--quiet" href={teaser.href}>{teaser.cta} <ActionMark direction="forward" /></Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
