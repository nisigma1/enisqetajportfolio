"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { problems } from "@/data/site";

export function BuildNavigator() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const item = problems[active];
  const phases = ["Understand", "Shape", "Design", "Build", "Refine"];

  function select(index: number, focus = false) {
    const next = (index + problems.length) % problems.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) { event.preventDefault(); select(index + 1, true); }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); select(index - 1, true); }
    if (event.key === "Home") { event.preventDefault(); select(0, true); }
    if (event.key === "End") { event.preventDefault(); select(problems.length - 1, true); }
  }

  return (
    <div className="build-navigator">
      <div className="build-choices" role="tablist" aria-label="Choose a need">
        {problems.map((problem, index) => (
          <button ref={(node) => { tabs.current[index] = node; }} id={`build-choice-${index}`} key={problem.group} type="button" role="tab" aria-selected={active === index} aria-controls="build-response" tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{problem.group}
          </button>
        ))}
      </div>
      <div id="build-response" className="build-response" role="tabpanel" aria-labelledby={`build-choice-${active}`} aria-live="polite">
        <div><span className="build-kicker">The situation</span><h3>{item.problem}</h3></div>
        <div><span className="build-kicker">Possible form</span><p>{item.forms}</p></div>
        <div><span className="build-kicker">How I approach it</span><p>{item.response}</p></div>
      </div>
      <ol className="build-path" aria-label="Working process">
        {phases.map((phase, index) => <li key={phase}><span>{String(index + 1).padStart(2, "0")}</span>{phase}</li>)}
      </ol>
    </div>
  );
}
