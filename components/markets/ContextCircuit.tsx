"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type ModeId = "research" | "markets" | "build";

type CircuitNode = {
  id: string;
  label: string;
  description: string;
  icon: string;
  status: "signal" | "evidence" | "context" | "outcome";
};

type CircuitMode = {
  id: ModeId;
  label: string;
  eyebrow: string;
  summary: string;
  nodes: CircuitNode[];
};

const modes: CircuitMode[] = [
  {
    id: "research",
    label: "Research",
    eyebrow: "01 / Research practice",
    summary: "A question becomes useful only after its evidence, limits and implications remain visible.",
    nodes: [
      { id: "question", label: "Question", description: "Define the decision before gathering material.", icon: "?", status: "signal" },
      { id: "sources", label: "Sources", description: "Collect primary reporting, data and relevant context.", icon: "⌁", status: "evidence" },
      { id: "cross-check", label: "Cross-check", description: "Test claims against independent evidence and contradictions.", icon: "≋", status: "evidence" },
      { id: "interpretation", label: "Interpretation", description: "Turn the evidence into a clear, bounded reading.", icon: "◌", status: "context" },
      { id: "limitations", label: "Limitations", description: "Name what is unknown, early or unable to be concluded.", icon: "—", status: "context" },
      { id: "implications", label: "Implications", description: "State what the evidence changes for the next decision.", icon: "◆", status: "outcome" },
    ],
  },
  {
    id: "markets",
    label: "Markets",
    eyebrow: "02 / Market context",
    summary: "Price starts the observation. Context tests whether the move carries a durable meaning.",
    nodes: [
      { id: "price", label: "Price", description: "Observe the visible move, range, trend and momentum.", icon: "⌁", status: "signal" },
      { id: "structure", label: "Structure", description: "Read participation, key levels and the quality of the move.", icon: "⌗", status: "evidence" },
      { id: "fundamentals", label: "Fundamentals", description: "Test the asset or sector conditions behind the narrative.", icon: "◫", status: "evidence" },
      { id: "liquidity", label: "Liquidity", description: "Place the move inside capital conditions and risk appetite.", icon: "≈", status: "context" },
      { id: "macro", label: "Macro & geopolitics", description: "Include rates, growth, policy, trade and strategic forces.", icon: "◎", status: "context" },
      { id: "on-chain", label: "On-chain", description: "Add flows, balances and recorded network behavior where relevant.", icon: "⌘", status: "evidence" },
      { id: "thesis", label: "Thesis", description: "Form a conditional view with explicit evidence and invalidation points.", icon: "◆", status: "outcome" },
    ],
  },
  {
    id: "build",
    label: "Build",
    eyebrow: "03 / Product building",
    summary: "A working product comes from a precise need, a tested structure and an intentional refinement loop.",
    nodes: [
      { id: "need", label: "Need", description: "Start with a real problem and the person experiencing it.", icon: "+", status: "signal" },
      { id: "research", label: "Research", description: "Clarify the environment, constraints and useful opportunity.", icon: "⌁", status: "evidence" },
      { id: "structure", label: "Structure", description: "Give the experience a coherent information and decision path.", icon: "⌗", status: "evidence" },
      { id: "prototype", label: "Prototype", description: "Make the critical flow tangible early enough to test it.", icon: "◫", status: "context" },
      { id: "automation", label: "AI / automation", description: "Use automation where it genuinely improves the work.", icon: "⌘", status: "context" },
      { id: "product", label: "Working product", description: "Ship, observe real use and refine the experience.", icon: "◆", status: "outcome" },
    ],
  },
];

const positions = [
  [9, 51], [27, 25], [47, 25], [67, 25], [67, 75], [86, 51], [91, 77],
] as const;

function circuitPath([fromX, fromY]: readonly number[], [toX, toY]: readonly number[]) {
  const middle = Math.round((fromX + toX) / 2);
  return `M ${fromX} ${fromY} H ${middle} V ${toY} H ${toX}`;
}

function ContextCircuitDetails({ node, mode }: { node: CircuitNode; mode: CircuitMode }) {
  return (
    <aside className="context-circuit__details" aria-live="polite">
      <p>{mode.eyebrow}</p>
      <span className={`context-circuit__status context-circuit__status--${node.status}`}>{node.status}</span>
      <h3>{node.label}</h3>
      <p className="context-circuit__description">{node.description}</p>
      <p className="context-circuit__summary">{mode.summary}</p>
    </aside>
  );
}

export function ContextCircuit() {
  const [modeId, setModeId] = useState<ModeId>("markets");
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const uid = useId();
  const mode = useMemo(() => modes.find((item) => item.id === modeId) ?? modes[1], [modeId]);
  const activeNode = mode.nodes[activeIndex] ?? mode.nodes[0];
  const shouldAnimate = inView && visible && !reducedMotion;

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.22 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  function selectMode(next: ModeId) {
    setModeId(next);
    setActiveIndex(0);
  }

  return (
    <section ref={sectionRef} className="context-circuit" aria-labelledby={`${uid}-title`}>
      <header className="context-circuit__header">
        <div>
          <p className="section-label">Context circuit</p>
          <h2 id={`${uid}-title`}>One signal. A wider decision.</h2>
        </div>
        <p>Move through the system to see how research, market context and product work connect.</p>
      </header>

      <div className="context-circuit__mode-selector" role="tablist" aria-label="Context Circuit modes">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${uid}-${item.id}`}
            aria-selected={item.id === mode.id}
            aria-controls={`${uid}-panel`}
            onClick={() => selectMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${mode.id}`} className="context-circuit__frame">
        <div className="context-circuit__diagram" aria-label={`${mode.label} circuit. Select a node for its explanation.`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <pattern id={`${uid}-dots`} width="3" height="3" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="0.22" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#${uid}-dots)`} />
            {mode.nodes.slice(0, -1).map((_, index) => {
              const active = index < activeIndex;
              const current = index === activeIndex - 1;
              const path = circuitPath(positions[index], positions[index + 1]);
              return (
                <g key={`${mode.id}-${index}`}>
                  <path className="context-circuit__trace" d={path} />
                  <motion.path
                    className="context-circuit__pulse"
                    d={path}
                    initial={false}
                    animate={shouldAnimate && (active || current) ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.55, ease: "easeOut", delay: index * 0.05 }}
                  />
                </g>
              );
            })}
          </svg>

          <div className="context-circuit__desktop-nodes">
            {mode.nodes.map((node, index) => {
              const selected = index === activeIndex;
              const diminished = index > activeIndex;
              return (
                <button
                  key={node.id}
                  type="button"
                  className="context-circuit__node"
                  aria-pressed={selected}
                  data-active={selected || undefined}
                  data-dimmed={diminished || undefined}
                  onClick={() => setActiveIndex(index)}
                  style={{ left: `${positions[index][0]}%`, top: `${positions[index][1]}%` }}
                >
                  <span aria-hidden="true" className="context-circuit__node-icon">{node.icon}</span>
                  <strong>{node.label}</strong>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </button>
              );
            })}
          </div>

          <ol className="context-circuit__mobile-path" aria-label={`${mode.label} sequence`}>
            {mode.nodes.map((node, index) => (
              <li key={node.id} data-active={index === activeIndex || undefined}>
                <button type="button" aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{node.label}</strong>
                  <i aria-hidden="true">{node.icon}</i>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <ContextCircuitDetails node={activeNode} mode={mode} />
      </div>

      <footer className="context-circuit__controls">
        <button type="button" onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} disabled={activeIndex === 0}>Previous</button>
        <p><span style={{ width: `${((activeIndex + 1) / mode.nodes.length) * 100}%` }} /></p>
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(mode.nodes.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => setActiveIndex((index) => Math.min(mode.nodes.length - 1, index + 1))} disabled={activeIndex === mode.nodes.length - 1}>Next</button>
      </footer>
    </section>
  );
}
