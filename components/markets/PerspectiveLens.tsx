"use client";

import { KeyboardEvent, useId, useRef, useState } from "react";
import { marketLayers } from "@/data/site";

export function PerspectiveLens() {
  const [active, setActive] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId();
  const current = marketLayers[active];

  function select(index: number, focus = false) {
    const next = Math.max(0, Math.min(marketLayers.length - 1, index));
    setActive(next);
    if (focus) buttonRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keyMap: Record<string, number> = {
      ArrowRight: Math.min(index + 1, marketLayers.length - 1),
      ArrowDown: Math.min(index + 1, marketLayers.length - 1),
      ArrowLeft: Math.max(index - 1, 0),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: marketLayers.length - 1,
    };
    if (keyMap[event.key] === undefined) return;
    event.preventDefault();
    select(keyMap[event.key], true);
  }

  return (
    <div
      className={`atlas atlas-stage-${active + 1}`}
      style={{ "--atlas-stage": active + 1 } as React.CSSProperties}
    >
      <div className="atlas-visual" aria-hidden="true">
        <div className="atlas-caption">
          <span>Context expansion</span>
          <strong>{String(active + 1).padStart(2, "0")} / 07</strong>
        </div>
        <div className="atlas-field">
          <span className="atlas-observation">Price</span>
          <span className="atlas-axis atlas-axis-x" />
          <span className="atlas-axis atlas-axis-y" />
          {marketLayers.slice(1).map((layer, index) => {
            const layerIndex = index + 1;
            return (
              <span
                key={layer.id}
                className={`atlas-frame atlas-frame-${layerIndex + 1} ${
                  layerIndex <= active ? "is-visible" : ""
                } ${layer.id === "geopolitics" ? "is-external" : ""}`}
              >
                <i>{layer.number}</i>
                <b>{layer.name}</b>
              </span>
            );
          })}
          <span className="atlas-geopolitics">
            <b>External forces enter the frame</b>
            <i>Policy · conflict · trade · energy · resources · regulation</i>
          </span>
        </div>
        <p>One observation becomes a connected field of evidence.</p>
      </div>

      <section className="atlas-reading" aria-live="polite">
        <div className="atlas-reading-head">
          <span>Active layer</span>
          <strong>{current.number} / 07</strong>
        </div>
        {marketLayers.map((layer, index) => (
          <article
            key={layer.id}
            id={`${uid}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${index}`}
            hidden={index !== active}
          >
            <p>{layer.context}</p>
            <h3>{layer.name}</h3>
            <h4>{layer.question}</h4>
            <p>{layer.note}</p>
            <div>
              <span>Evidence I examine</span>
              <ul>
                {layer.indicators.map((indicator) => <li key={indicator}>{indicator}</li>)}
              </ul>
            </div>
            <blockquote>{layer.change}</blockquote>
          </article>
        ))}
        <div className="atlas-mobile-controls">
          <button type="button" onClick={() => select(active - 1)} disabled={active === 0}>
            <span aria-hidden="true">←</span> Previous
          </button>
          <button type="button" onClick={() => select(active + 1)} disabled={active === 6}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <div className="atlas-index" role="tablist" aria-label="Context layers">
        {marketLayers.map((layer, index) => (
          <button
            key={layer.id}
            ref={(node) => { buttonRefs.current[index] = node; }}
            id={`${uid}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`${uid}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{layer.number}</span>
            <strong>{layer.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
