"use client";

import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { ActionMark } from "@/components/ui/ActionMark";

const tabs = [
  {
    title: "Crypto Analysis",
    value: "analysis",
    content: (
      <article className="home-practice-tabs__panel" data-tone="analysis">
        <div>
          <p>01 / Market research</p>
          <h3>Read the market through more than price.</h3>
          <p>Technical structure, fundamentals, on-chain signals and macro context brought together in a clear monthly research framework.</p>
        </div>
        <ul aria-label="Crypto analysis coverage">
          <li>Technical structure</li>
          <li>Fundamental research</li>
          <li>On-chain context</li>
        </ul>
        <Link className="button button--primary" href="/pricing">Explore analysis plans <ActionMark direction="forward" /></Link>
      </article>
    ),
  },
  {
    title: "Malera Studio",
    value: "malera",
    content: (
      <article className="home-practice-tabs__panel" data-tone="malera">
        <div>
          <p>02 / Digital building</p>
          <h3>Build the useful form.</h3>
          <p>Websites, digital products and AI systems designed around the real business need, then made responsive and practical.</p>
        </div>
        <ul aria-label="Malera Studio capabilities">
          <li>Websites &amp; journeys</li>
          <li>AI product systems</li>
          <li>Automation</li>
        </ul>
        <Link className="button button--primary" href="/malera">Meet Malera Studio <ActionMark direction="forward" /></Link>
      </article>
    ),
  },
  {
    title: "Selected Work",
    value: "work",
    content: (
      <article className="home-practice-tabs__panel" data-tone="work">
        <div>
          <p>03 / Real projects</p>
          <h3>Working experiences for real businesses.</h3>
          <p>Selected interface work across booking, women’s wellness and photography—shown through the actual systems, not abstract mock-ups.</p>
        </div>
        <ul aria-label="Selected digital projects">
          <li>Barber Brothers</li>
          <li>Hixhame Tina</li>
          <li>Besiana Photography</li>
        </ul>
        <Link className="button button--primary" href="/work">View selected work <ActionMark direction="forward" /></Link>
      </article>
    ),
  },
] as const;

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
      <Tabs tabs={tabs} />
    </section>
  );
}
