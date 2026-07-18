"use client";

import { useState } from "react";
import { marketLayers } from "@/data/site";

export function PerspectiveLens() {
  const [active, setActive] = useState(0);
  const current = marketLayers[active];
  return (
    <div className="lens-experience" style={{ "--lens-step": active } as React.CSSProperties}>
      <div className="lens-stage" aria-live="polite">
        <div className="lens-window" aria-hidden="true">
          {marketLayers.map((layer, index) => <span key={layer.name} className={index <= active ? "visible" : ""} style={{ "--layer": index } as React.CSSProperties}>{layer.name}</span>)}
        </div>
        <p className="lens-count">Perspective {String(active + 1).padStart(2, "0")} / {String(marketLayers.length).padStart(2, "0")}</p>
        <div className="lens-copy"><small>{current.name}</small><h3>{current.question}</h3><p>{current.note}</p></div>
      </div>
      <div className="lens-controls" role="tablist" aria-label="Widen the market perspective">
        {marketLayers.map((layer, index) => <button key={layer.name} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}><span>0{index + 1}</span>{layer.name}</button>)}
      </div>
      <noscript><ol className="lens-fallback">{marketLayers.map((layer) => <li key={layer.name}><strong>{layer.name}</strong> — {layer.note}</li>)}</ol></noscript>
    </div>
  );
}

