"use client";

import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { ActionMark } from "@/components/ui/ActionMark";

type PracticeTab = {
  title: string;
  value: string;
  eyebrow: string;
  heading: string;
  summary: string;
  items: readonly string[];
  href: string;
  cta: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  tone: "analysis" | "malera" | "work";
};

const practiceTabs: readonly PracticeTab[] = [
  {
    title: "Crypto Analysis",
    value: "analysis",
    eyebrow: "01 / Market research",
    heading: "Read the market through more than price.",
    summary: "Technical structure, fundamentals, on-chain signals and macro context brought together in a clear monthly research framework.",
    items: ["Technical structure", "Fundamental research", "On-chain context"],
    href: "/pricing",
    cta: "Explore analysis plans",
    image: "/images/research-notes/x-bitcoin-mvrv-dark.webp",
    alt: "NISIGMA X post discussing Bitcoin MVRV Z-score market context",
    width: 1089,
    height: 1445,
    tone: "analysis",
  },
  {
    title: "Malera Studio",
    value: "malera",
    eyebrow: "02 / Digital building",
    heading: "Build the useful form.",
    summary: "Websites, digital products and AI systems designed around the real business need, then made responsive and practical.",
    items: ["Websites & journeys", "AI product systems", "Automation"],
    href: "/companies",
    cta: "Meet Malera Studio",
    image: "/projects/hixhame-tina/hixhame-tina-case-study.webp",
    alt: "Hixhame Tina website shown across desktop and mobile",
    width: 1672,
    height: 941,
    tone: "malera",
  },
  {
    title: "Selected Work",
    value: "work",
    eyebrow: "03 / Real projects",
    heading: "Working experiences for real businesses.",
    summary: "Selected interface work across booking, women’s wellness and photography—shown through the actual systems, not abstract mock-ups.",
    items: ["Barber Brothers", "Hixhame Tina", "Besiana Photography"],
    href: "/work",
    cta: "View selected work",
    image: "/projects/barber-brothers/barber-brothers-cover.webp",
    alt: "Barber Brothers booking website interface",
    width: 1600,
    height: 900,
    tone: "work",
  },
];

function PracticePanel({ tab }: { tab: PracticeTab }) {
  return (
    <article className="home-practice-tabs__panel" data-tone={tab.tone}>
      <div className="home-practice-tabs__copy">
        <p>{tab.eyebrow}</p>
        <h3>{tab.heading}</h3>
        <p className="home-practice-tabs__summary">{tab.summary}</p>
        <ul aria-label={`${tab.title} coverage`}>
          {tab.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <Link className="button button--primary" href={tab.href}>{tab.cta} <ActionMark direction="forward" /></Link>
      </div>
      <figure className="home-practice-tabs__proof">
        {tab.tone === "analysis" ? (
          <div className="x-research-card">
            <div className="x-research-card__header">
              <span className="x-research-card__identity"><strong>NISIGMA</strong><small>@N1sigma</small></span>
              <span aria-hidden="true">𝕏</span>
            </div>
            <p className="x-research-card__label">Public research note / Bitcoin market context</p>
            <div className="x-research-card__image">
              <img src={tab.image} alt={tab.alt} width={tab.width} height={tab.height} loading="lazy" decoding="async" />
            </div>
            <div className="x-research-card__footer"><span>Market research, published on X</span><ActionMark direction="external" /></div>
          </div>
        ) : (
          <img src={tab.image} alt={tab.alt} width={tab.width} height={tab.height} loading="lazy" decoding="async" />
        )}
      </figure>
    </article>
  );
}

export function HomePracticeTabs() {
  return (
    <section className="site-section home-practice-tabs" aria-labelledby="home-practice-tabs-title">
      <header>
        <p>02 / Explore the practice</p>
        <div>
          <h2 id="home-practice-tabs-title">Choose the lens you need.</h2>
          <p>Research, digital building and selected work sit in one practice—each with a distinct way in.</p>
        </div>
      </header>
      <Tabs tabs={practiceTabs.map((tab) => ({
        title: tab.title,
        value: tab.value,
        content: <PracticePanel tab={tab} />,
      }))} />
    </section>
  );
}
