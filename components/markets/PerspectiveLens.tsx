"use client";

import { KeyboardEvent, useRef, useState } from "react";

const layers = [
  { name: "Price", icon: "⌁", question: "What is visible right now?", summary: "Price is the first observation. It is useful, immediate and never the full explanation.", indicators: ["Trend", "Momentum", "Key levels"], annotations: ["Trend", "Momentum", "Levels"] },
  { name: "Structure", icon: "◇", question: "How is the market behaving?", summary: "Structure gives price a shape: range, break, momentum and positioning all change how a move should be read.", indicators: ["Range", "Breaks", "Positioning"], annotations: ["Range", "Break", "Positioning"] },
  { name: "Fundamentals", icon: "▥", question: "What supports the move?", summary: "Adoption, utility and token dynamics help separate a short reaction from a change in the underlying story.", indicators: ["Adoption", "Utility", "Token dynamics"], annotations: ["Adoption", "Utility", "Token dynamics"] },
  { name: "Liquidity", icon: "◒", question: "Where is capital moving?", summary: "Flows and financial conditions explain when risk can expand, contract or rotate into a different part of the market.", indicators: ["Flows", "Capital", "Conditions"], annotations: ["Flows", "Capital", "Conditions"] },
  { name: "Macro", icon: "◎", question: "What environment surrounds it?", summary: "Rates, inflation and policy widen the frame beyond any one asset or market narrative.", indicators: ["Rates", "Inflation", "Policy"], annotations: ["Rates", "Inflation", "Policy"] },
  { name: "Geopolitics", icon: "⚑", question: "What can redraw the map?", summary: "Trade, energy, conflict and regulation can reframe risk quickly, even when a chart looks unchanged.", indicators: ["Energy", "Trade", "Regulation"], annotations: ["Energy", "Trade", "Conflict"] },
  { name: "On-chain", icon: "⌘", question: "What does network activity add?", summary: "Flows, holder behavior and network use add a behavioral layer that price alone cannot reveal.", indicators: ["Flows", "Holder behavior", "Network activity"], annotations: ["Flows", "Holders", "Network"] },
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

  return <>
    <div className="context-visual" aria-label={`Context model: ${current.name} is the active layer`}>
      <div className="context-visual-meta"><span>Context expands</span><strong>{String(active + 1).padStart(2, "0")} / 07</strong></div>
      <div className={`context-orbit context-step-${active}`} aria-hidden="true">
        <span className="orbit-ring orbit-ring-one" /><span className="orbit-ring orbit-ring-two" /><span className="orbit-ring orbit-ring-three" /><span className="orbit-ring orbit-ring-four" />
        <span className="orbit-axis orbit-axis-one" /><span className="orbit-axis orbit-axis-two" />
        <span className="orbit-core"><i>{layers[0].icon}</i>Price</span>
        {layers.slice(1).map((layer, index) => <span key={layer.name} className={`orbit-layer orbit-layer-${index + 2} ${index + 1 <= active ? "is-revealed" : ""} ${index + 1 === active ? "is-current" : ""}`}><i>{layer.icon}</i><b>0{index + 2}</b>{layer.name}</span>)}
        <span className="orbit-active-note">{active === 6 ? "One coherent view" : current.annotations.join(" · ")}</span>
      </div>
      <p className="context-visual-caption">Each layer changes what the first signal can mean.</p>
    </div>

    <div className="context-detail">
      <div className="context-detail-top"><strong>{String(active + 1).padStart(2, "0")} / 07</strong><div className="context-arrow-controls"><button type="button" onClick={() => select(active - 1)} aria-label="Previous context layer">←</button><button type="button" onClick={() => select(active + 1)} aria-label="Next context layer">→</button></div></div>
      <div id="context-layer-panel" className="context-reading" role="tabpanel" aria-live="polite" aria-labelledby={`context-layer-${active}`}><p>{String(active + 1).padStart(2, "0")} / {current.name}</p><h3>{current.name}</h3><h4>{current.question}</h4><span /><p>{current.summary}</p></div>
      <div className="context-indicators"><span>What I look for</span><ul>{current.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}</ul></div>
      <div className="context-controls"><button type="button" onClick={() => select(active - 1)} aria-label="Previous context layer">← Previous</button><button type="button" onClick={() => select(active + 1)} aria-label="Next context layer">Next →</button></div>
      <div className="context-index" role="tablist" aria-label="Market context layers">{layers.map((layer, index) => <button ref={(node) => { tabs.current[index] = node; }} id={`context-layer-${index}`} key={layer.name} type="button" role="tab" aria-selected={active === index} aria-controls="context-layer-panel" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{layer.name}</strong></button>)}</div>
    </div>
  </>;
}
