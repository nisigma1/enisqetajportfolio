"use client";

import { useState } from "react";

const modes = {
  analyze: {
    title: "Analyze",
    copy: "I study individual signals across markets, data and global events.",
    kicker: "01 / Isolate the signal",
    nodes: ["Price structure", "Liquidity", "Fundamentals", "Macro", "Policy", "Geopolitics", "On-chain", "Behavior"],
  },
  interpret: {
    title: "Interpret",
    copy: "I connect separate signals to understand the wider forces shaping markets.",
    kicker: "02 / Build the context",
    nodes: ["Context", "Narratives", "Positioning", "Cause & effect", "Capital flows", "Psychology", "Cross-market"],
  },
  build: {
    title: "Build",
    copy: "I turn ideas, research and problems into functional digital systems.",
    kicker: "03 / Resolve the system",
    nodes: ["AI applications", "Web platforms", "Bots", "Automation", "Research tools", "Interfaces", "Digital systems"],
  },
} as const;

type Mode = keyof typeof modes;

export function SignalEngine({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("analyze");
  const item = modes[mode];

  return (
    <div className={`signal-engine signal-engine--${mode} ${compact ? "signal-engine--compact" : ""}`}>
      <div className="engine-controls" role="tablist" aria-label="Signal Engine mode">
        {(Object.keys(modes) as Mode[]).map((key, index) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            aria-controls={`engine-panel-${compact ? "compact" : "full"}`}
            onClick={() => setMode(key)}
          >
            <span>0{index + 1}</span>{modes[key].title}
          </button>
        ))}
      </div>
      <div className="engine-visual" aria-hidden="true">
        <div className="engine-coordinate">{item.kicker}</div>
        <svg viewBox="0 0 640 430" role="img" aria-label={`${item.title} mode structure`}>
          <g className="engine-grid">
            <path d="M0 86H640M0 172H640M0 258H640M0 344H640" />
            <path d="M128 0V430M256 0V430M384 0V430M512 0V430" />
          </g>
          <g className="engine-lines">
            {mode === "analyze" && <><path d="M34 118H188L242 86H352" /><path d="M288 326H448L506 284H606" /><path d="M88 236H236" /></>}
            {mode === "interpret" && <><path d="M44 96C160 96 146 320 282 260S430 82 604 174" /><path d="M84 344C210 278 292 112 558 112" /><path d="M148 66L476 348" /></>}
            {mode === "build" && <><path d="M72 94H250V186H390V110H566" /><path d="M72 334H238V252H402V334H566" /><path d="M320 186V252" /></>}
          </g>
          <g className="engine-nodes">
            <circle cx="72" cy="96" r="7" /><circle cx="176" cy="174" r="7" /><circle cx="278" cy="260" r="7" />
            <circle cx="386" cy="186" r="7" /><circle cx="476" cy="110" r="7" /><circle cx="566" cy="174" r="7" />
            <circle cx="238" cy="334" r="7" /><circle cx="402" cy="334" r="7" />
          </g>
          {mode === "build" && <g className="engine-modules"><rect x="48" y="64" width="108" height="64" /><rect x="266" y="152" width="108" height="68" /><rect x="458" y="74" width="130" height="72" /><rect x="348" y="300" width="108" height="66" /></g>}
        </svg>
        <div className="engine-node-labels">
          {item.nodes.slice(0, compact ? 4 : item.nodes.length).map((node, index) => <span key={node} style={{ "--index": index } as React.CSSProperties}>{node}</span>)}
        </div>
      </div>
      <div id={`engine-panel-${compact ? "compact" : "full"}`} className="engine-copy" role="tabpanel">
        <p>{item.copy}</p>
        {!compact && <span>Mode {String((Object.keys(modes) as Mode[]).indexOf(mode) + 1).padStart(2, "0")} / 03</span>}
      </div>
    </div>
  );
}

