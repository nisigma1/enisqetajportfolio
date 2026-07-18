import { SectionHeading } from "@/components/ui/SectionHeading";
import { SignalThread } from "@/components/visuals/SignalThread";
import { SignalEngine } from "@/components/signal-engine/SignalEngine";
import { ExpertiseIndex, ResearchConstellation, BuildCanvas } from "./InteractiveSystems";
import { personal } from "@/data/personal";

export function EngineSection() {
  return (
    <section className="section engine-section" aria-labelledby="engine-title">
      <div className="section-grid">
        <header className="engine-section-copy">
          <p className="section-marker">00 / SIGNAL ENGINE</p>
          <h2 id="engine-title">One method.<br /><em>Three states.</em></h2>
          <p>Signals only become useful when they are placed in context and transformed into a clear system.</p>
        </header>
        <SignalEngine />
      </div>
      <SignalThread label="Observe / Connect / Resolve" variant="nodes" />
    </section>
  );
}

export function ProfileSection() {
  const facts = [
    ["Focus", "Crypto, financial markets and AI"],
    ["Education", "Marketing / Banking and Finance"],
    ["Approach", "Research, connect, build"],
    ["Based in", "Kosovo"],
    ["Outside work", "Football"],
  ];
  return (
    <section id="profile" className="section profile-section">
      <SectionHeading marker="01 / PROFILE" title="Between markets and technology." />
      <div className="profile-composition">
        <p className="profile-lead">I study how markets behave, how wider forces connect—and how ideas can become useful digital products.</p>
        <div className="profile-bio">
          {personal.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="profile-flow" aria-label="Approach"><span>Markets</span><i /> <span>Research</span><i /> <span>Intelligence</span><i /> <span>Products</span></div>
        <dl className="profile-facts">
          {facts.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}
        </dl>
      </div>
      <SignalThread label="Identity coordinates / Kosovo / Independent" />
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section className="section capabilities-section">
      <SectionHeading marker="02 / CAPABILITIES" title="Where I create value." intro="A working index of the disciplines I connect—across research, markets and digital products." />
      <ExpertiseIndex />
      <SignalThread label="Select a capability / Visible context" variant="steps" />
    </section>
  );
}

export function MarketsSection() {
  return (
    <section id="markets" className="section markets-section">
      <SectionHeading marker="03 / MARKETS" title="Markets through a wider lens." intro="Markets do not move in isolation. Price is the visible result of liquidity, positioning, policy, narratives, global events and human behavior." />
      <ResearchConstellation />
      <p className="disclaimer">Research content is educational and does not constitute financial advice.</p>
      <SignalThread label="Price is visible / Context is structural" variant="nodes" />
    </section>
  );
}

export function BuildSection() {
  return (
    <section id="build" className="section build-section">
      <SectionHeading marker="04 / BUILD" title="From idea to working system." intro="I use AI as a building system, not as decoration. The objective is to move from an idea to a functional, useful and visually refined digital product." />
      <BuildCanvas />
      <div className="build-strengths" aria-label="Product building strengths">
        <span>Frontend execution</span><span>Product thinking</span><span>Research</span><span>Business understanding</span><span>Financial context</span><span>AI tools</span><span>Rapid functional development</span>
      </div>
      <SignalThread label="Understand / Structure / Design / Build / Refine" variant="steps" />
    </section>
  );
}

