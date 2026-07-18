"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { marketLayers } from "@/data/site";

export function PerspectiveLens() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = marketLayers[active];

  function select(index: number) {
    const next = (index + marketLayers.length) % marketLayers.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); select(index + 1); }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); select(index - 1); }
    if (event.key === "Home") { event.preventDefault(); select(0); }
    if (event.key === "End") { event.preventDefault(); select(marketLayers.length - 1); }
  }

  return (
    <div className="wider-lens" style={{ "--lens-step": active } as React.CSSProperties}>
      <div className="lens-field" data-step={active} aria-hidden="true">
        <div className="field-coordinate"><span>Isolated signal</span><i /><span>Connected context</span></div>
        <div className={`field-layer field-price ${active >= 0 ? "visible" : ""}`}><span>Price</span><i /></div>
        <div className={`field-layer field-structure ${active >= 1 ? "visible" : ""}`}><span>Trend</span><span>Levels</span><span>Momentum</span><span>Positioning</span></div>
        <div className={`field-layer field-fundamentals ${active >= 2 ? "visible" : ""}`}><span>Underlying conditions</span></div>
        <div className={`field-layer field-liquidity ${active >= 3 ? "visible" : ""}`}><span>Capital</span><i /><span>Conditions</span></div>
        <div className={`field-layer field-macro ${active >= 4 ? "visible" : ""}`}><span>Rates</span><span>Inflation</span><span>Policy</span><span>Growth</span></div>
        <div className={`field-layer field-geopolitics ${active >= 5 ? "visible" : ""}`}><span>Trade</span><span>Conflict</span><span>Energy</span><span>Regulation</span></div>
        <div className={`field-layer field-onchain ${active >= 6 ? "visible" : ""}`}><span>Flows</span><span>Activity</span><span>Behavior</span></div>
        <p className={`field-result ${active === 6 ? "visible" : ""}`}>One coherent view</p>
      </div>

      <div className="lens-panel">
        <div className="lens-progress"><span>Perspective</span><strong>{String(active + 1).padStart(2, "0")} / {String(marketLayers.length).padStart(2, "0")}</strong></div>
        <div id="lens-panel" className="lens-reading" role="tabpanel" aria-live="polite" aria-labelledby={`lens-tab-${active}`}><span>{current.context}</span><h3>{current.name}</h3><strong>{current.question}</strong><p>{current.note}</p></div>
        <div className="lens-tabs" role="tablist" aria-label="Widen the market perspective">
          {marketLayers.map((layer, index) => <button ref={(node) => { tabs.current[index] = node; }} id={`lens-tab-${index}`} key={layer.name} type="button" role="tab" aria-selected={active === index} aria-controls="lens-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>0{index + 1}</span><strong>{layer.name}</strong><i>{index <= active ? "Visible" : "Add layer"}</i></button>)}
        </div>
        <noscript><ol className="lens-fallback">{marketLayers.map((layer) => <li key={layer.name}><strong>{layer.name}</strong> — {layer.note}</li>)}</ol></noscript>
      </div>
    </div>
  );
}
