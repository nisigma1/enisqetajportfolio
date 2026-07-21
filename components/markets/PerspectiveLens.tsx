"use client";

import { KeyboardEvent, useId, useRef, useState } from "react";
import { marketLayers } from "@/data/site";

export function PerspectiveLens() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();
  const current = marketLayers[active];

  function select(index: number, focus = false) {
    const next = Math.max(0, Math.min(marketLayers.length - 1, index));
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(index + 1, marketLayers.length - 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(index - 1, 0);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = marketLayers.length - 1;
    if (next !== null) { event.preventDefault(); select(next, true); }
  }

  return (
    <div className={`lens lens-stage-${active + 1}`} style={{ "--lens-progress": active } as React.CSSProperties}>
      <div className="lens-aperture" role="img" aria-label={`Context frame with ${current.name} active`}>
        <div className="lens-aperture-meta"><span>Context expansion</span><strong>{String(active + 1).padStart(2, "0")} / 07</strong></div>
        <div className="lens-field" aria-hidden="true">
          <span className="lens-signal">Price</span>
          {marketLayers.slice(1).map((layer, index) => {
            const layerIndex = index + 1;
            return <span key={layer.name} className={`lens-context lens-context-${layerIndex + 1} ${layerIndex <= active ? "is-visible" : ""}`}>{layer.name}</span>;
          })}
          <span className="lens-window" />
        </div>
        <p className="lens-aperture-caption">Seven layers. One more coherent view.</p>
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        Active market context layer: {current.name}, {active + 1} of {marketLayers.length}.
      </p>
      <section className="lens-reading">
        <div className="lens-reading-meta"><span>Active layer</span><strong>{String(active + 1).padStart(2, "0")} of 07</strong></div>
        {marketLayers.map((layer, index) => (
          <article key={layer.name} id={`${panelId}-${index}`} role="tabpanel" aria-labelledby={`${panelId}-tab-${index}`} hidden={index !== active}>
            <h3>{layer.name}</h3>
            <h4>{layer.question}</h4>
            <p>{layer.note}</p>
            <div><span>What I examine</span><ul>{layer.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}</ul></div>
            <blockquote>{layer.change}</blockquote>
          </article>
        ))}
        <div className="lens-controls">
          <button type="button" onClick={() => select(active - 1)} disabled={active === 0}><span aria-hidden="true">←</span> Previous</button>
          <button type="button" onClick={() => select(active + 1)} disabled={active === marketLayers.length - 1}>{active === marketLayers.length - 1 ? "Full context" : "Add context"} <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <div className="lens-index" role="tablist" aria-label="Market context layers">
        {marketLayers.map((layer, index) => (
          <button
            ref={(node) => { tabRefs.current[index] = node; }}
            id={`${panelId}-tab-${index}`}
            key={layer.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`${panelId}-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span><strong>{layer.name}</strong>
          </button>
        ))}
      </div>

      <label className="lens-select">Jump to layer
        <select value={active} onChange={(event) => select(Number(event.target.value))}>
          {marketLayers.map((layer, index) => <option key={layer.name} value={index}>{String(index + 1).padStart(2, "0")} — {layer.name}</option>)}
        </select>
      </label>
    </div>
  );
}
