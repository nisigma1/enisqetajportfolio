"use client";

import { KeyboardEvent, useId, useRef, useState } from "react";
import { marketLayers } from "@/data/site";

const layerDetails = {
  price: {
    evidence: "Price action, range, trend and momentum.",
    interpretation: "The move is visible, but its cause is still unknown.",
    limitation: "Price alone cannot explain who is acting or why.",
    change: "A break in structure or a shift in participation.",
  },
  structure: {
    evidence: "Trend quality, key levels, positioning and market participation.",
    interpretation: "The move now has behavior and an observable structure.",
    limitation: "Structure describes the market; it does not validate the underlying story.",
    change: "Loss of a key level, failed continuation or changing positioning.",
  },
  fundamentals: {
    evidence: "Protocol, sector and asset-specific conditions behind the narrative.",
    interpretation: "The behavior gains a testable underlying explanation.",
    limitation: "Fundamentals can matter on a different timetable than price.",
    change: "A material change in adoption, economics or the original thesis.",
  },
  liquidity: {
    evidence: "Financial conditions, capital availability and monetary policy.",
    interpretation: "The asset is placed inside the movement of capital.",
    limitation: "Liquidity is influential, but never the only force.",
    change: "Tighter conditions, a policy surprise or a change in risk appetite.",
  },
  macro: {
    evidence: "Rates, inflation, growth, currencies and policy expectations.",
    interpretation: "The market gains a broader economic environment.",
    limitation: "Macro relationships can weaken, reverse or be priced early.",
    change: "A regime shift in growth, inflation or central-bank policy.",
  },
  geopolitics: {
    evidence: "Trade, conflict, energy, regulation and strategic resources.",
    interpretation: "External forces enter the frame and can redraw it.",
    limitation: "Outcomes depend on actors, timing and incomplete information.",
    change: "Escalation, de-escalation, sanctions, policy or supply disruption.",
  },
  "on-chain": {
    evidence: "Network activity, flows, balances and holder behavior.",
    interpretation: "Recorded behavior adds another perspective to the wider view.",
    limitation: "On-chain activity needs entity context and does not reveal every motive.",
    change: "A material shift in flows, balances or network participation.",
  },
} as const;

export function EvidenceLadder() {
  const [active, setActive] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId();
  const current = marketLayers[active];
  const details = layerDetails[current.id];

  function select(index: number, focus = false) {
    const next = Math.max(0, Math.min(marketLayers.length - 1, index));
    setActive(next);
    if (focus) window.requestAnimationFrame(() => buttonRefs.current[next]?.focus());
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextByKey: Record<string, number> = {
      ArrowRight: Math.min(index + 1, marketLayers.length - 1),
      ArrowDown: Math.min(index + 1, marketLayers.length - 1),
      ArrowLeft: Math.max(index - 1, 0),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: marketLayers.length - 1,
    };
    if (nextByKey[event.key] === undefined) return;
    event.preventDefault();
    select(nextByKey[event.key], true);
  }

  return (
    <section className="evidence-ladder" aria-label="Evidence Ladder">
      <div className="evidence-ladder__frame">
        <header className="evidence-ladder__header">
          <p>Signal <span aria-hidden="true">→</span> Context <span aria-hidden="true">→</span> Decision</p>
          <strong>{String(active + 1).padStart(2, "0")} / 07</strong>
        </header>

        <div
          className="evidence-ladder__steps"
          role="tablist"
          aria-label="Evidence layers"
          style={{ "--active-step": active + 1 } as React.CSSProperties}
        >
          {marketLayers.map((layer, index) => (
            <button
              key={layer.id}
              ref={(node) => { buttonRefs.current[index] = node; }}
              id={`${uid}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls={`${uid}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span>{layer.number}</span>
              <strong>{layer.name}</strong>
              <i aria-hidden="true">{index <= active ? "●" : "○"}</i>
            </button>
          ))}
        </div>

        <div className="evidence-ladder__reading" aria-live="polite">
          <div className="evidence-ladder__title">
            <p>{current.context}</p>
            <h3>{current.name}</h3>
            <strong>{current.question}</strong>
          </div>

          <div
            id={`${uid}-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${active}`}
            className="evidence-ladder__detail"
          >
            <dl>
              <div>
                <dt>Evidence</dt>
                <dd>{details.evidence}</dd>
              </div>
              <div>
                <dt>Interpretation</dt>
                <dd>{details.interpretation}</dd>
              </div>
              <div>
                <dt>Limitation</dt>
                <dd>{details.limitation}</dd>
              </div>
              <div>
                <dt>What could change the view</dt>
                <dd>{details.change}</dd>
              </div>
            </dl>
          </div>
        </div>

        <footer className="evidence-ladder__controls">
          <button type="button" onClick={() => select(active - 1)} disabled={active === 0}>
            <span aria-hidden="true">←</span> Previous
          </button>
          <p><span style={{ width: `${((active + 1) / marketLayers.length) * 100}%` }} /></p>
          <button type="button" onClick={() => select(active + 1)} disabled={active === marketLayers.length - 1}>
            Next <span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>

      <p className="evidence-ladder__alternative">
        Price begins the observation. Each layer preserves what came before, tests it against wider evidence and makes the limits of the view explicit.
      </p>
    </section>
  );
}
