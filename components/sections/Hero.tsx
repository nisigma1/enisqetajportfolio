import { SignalEngine } from "@/components/signal-engine/SignalEngine";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-thread" aria-hidden="true"><i /><span /><b /></div>
      <div className="hero-meta">
        <p>Enis Qetaj / Kosovo / Independent portfolio</p>
        <p>Signal → Context → Intelligence → System</p>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title">I read markets.<br /><span>I build<br />intelligent systems.</span></h1>
          <p className="hero-intro">Crypto trader and financial markets researcher connecting technical analysis, fundamentals, macroeconomics and geopolitics with AI-powered digital products.</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#work">Explore selected work <span>↘</span></a>
            <a className="button button--secondary" href="#contact">Start a project <span>↗</span></a>
          </div>
          <div className="hero-disciplines"><span>Crypto trading</span><span>Market research</span><span>AI products</span></div>
        </div>
        <div className="hero-engine">
          <div className="engine-label"><span>Live thinking model</span><i /> Signal engine / v01</div>
          <SignalEngine compact />
        </div>
      </div>
      <div className="credibility-strip" aria-label="Core disciplines">
        <span>Technical analysis</span><span>Fundamental research</span><span>Macroeconomics</span><span>Geopolitics</span><span>AI product building</span>
      </div>
      <a className="hero-email" href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com <span>↗</span></a>
    </section>
  );
}

