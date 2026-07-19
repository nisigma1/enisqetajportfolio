"use client";

import { KeyboardEvent, useRef, useState } from "react";

const layers = [
  { name: "Price", question: "What is visible right now?", summary: "Price is the first observation. Useful, immediate—and never the full explanation.", indicators: ["Trend", "Momentum", "Key levels"], context: "The visible signal" },
  { name: "Structure", question: "How is the market behaving?", summary: "Range, break, momentum and positioning give the first observation a shape.", indicators: ["Range", "Breaks", "Positioning"], context: "Behavior around price" },
  { name: "Fundamentals", question: "What supports the move?", summary: "Adoption, utility and token dynamics help separate reaction from a change in the underlying story.", indicators: ["Adoption", "Utility", "Token dynamics"], context: "Underlying conditions" },
  { name: "Liquidity", question: "Where is capital moving?", summary: "Flows and financial conditions explain when risk can expand, contract or rotate.", indicators: ["Flows", "Capital", "Conditions"], context: "Capital in motion" },
  { name: "Macro", question: "What environment surrounds it?", summary: "Rates, inflation and policy widen the frame beyond any one asset or market narrative.", indicators: ["Rates", "Inflation", "Policy"], context: "The economic environment" },
  { name: "Geopolitics", question: "What can redraw the map?", summary: "Trade, energy, conflict and regulation can reframe risk even when the chart looks unchanged.", indicators: ["Energy", "Trade", "Regulation"], context: "External forces" },
  { name: "On-chain", question: "What does network activity add?", summary: "Flows, holder behavior and network use add a behavioral layer that price alone cannot reveal.", indicators: ["Flows", "Holder behavior", "Network use"], context: "A wider, connected view" },
] as const;

export function PerspectiveLens() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = layers[active];

  function select(index: number, focus = false) {
    const next = (index + layers.length) % layers.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); select(index + 1, true); }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); select(index - 1, true); }
    if (event.key === "Home") { event.preventDefault(); select(0, true); }
    if (event.key === "End") { event.preventDefault(); select(layers.length - 1, true); }
  }

  return <div className={`lens-workspace lens-step-${active}`}>
    <div className="context-visual" aria-label={`Wider lens model: ${current.name} is active`}>
      <div className="context-visual-meta"><span>Context expands</span><strong>{String(active + 1).padStart(2, "0")} / 07</strong></div>
      <div className="context-orbit" aria-hidden="true">
        <span className="orbit-axis orbit-axis-horizontal" />
        <span className="orbit-axis orbit-axis-vertical" />
        <span className="orbit-core"><small>01</small>Price</span>
        {layers.slice(1).map((layer, index) => {
          const layerIndex = index + 1;
          return <span key={layer.name} className={`orbit-layer orbit-layer-${layerIndex + 1} ${layerIndex <= active ? "is-revealed" : ""} ${layerIndex === active ? "is-current" : ""}`}><b>{String(layerIndex + 1).padStart(2, "0")}</b><i>{layer.name}</i></span>;
        })}
      </div>
      <p className="context-visual-caption"><span>{current.name}</span>{current.context}</p>
    </div>

    <div className="context-detail">
      <div className="context-detail-top"><strong>{String(active + 1).padStart(2, "0")} / 07</strong><div className="context-arrow-controls"><button type="button" onClick={() => select(active - 1)} aria-label="Previous context layer">←</button><button type="button" onClick={() => select(active + 1)} aria-label="Next context layer">→</button></div></div>
      <div id="context-layer-panel" className="context-reading" role="tabpanel" aria-live="polite" aria-labelledby={`context-layer-${active}`}><p>Active layer</p><h3>{current.name}</h3><h4>{current.question}</h4><span /><p>{current.summary}</p></div>
      <div className="context-indicators"><span>What Enis looks for</span><ul>{current.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}</ul></div>
      <button type="button" className="context-cta" onClick={() => select(active === layers.length - 1 ? 0 : active + 1)}>{active === layers.length - 1 ? "Return to price" : "Add the next layer"}<span>→</span></button>
    </div>

    <div className="context-index" role="tablist" aria-label="Market context layers">{layers.map((layer, index) => <button ref={(node) => { tabs.current[index] = node; }} id={`context-layer-${index}`} key={layer.name} type="button" role="tab" aria-selected={active === index} aria-controls="context-layer-panel" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{layer.name}</strong></button>)}</div>
  </div>;
}
