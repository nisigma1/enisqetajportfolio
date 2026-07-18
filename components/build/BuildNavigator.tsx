"use client";

import { useState } from "react";
import { problems } from "@/data/site";

export function BuildNavigator() {
  const [active, setActive] = useState(0);
  const item = problems[active];
  const phases = ["Understand", "Shape", "Design", "Build", "Refine"];

  return (
    <div className="build-navigator">
      <div className="build-choices" role="tablist" aria-label="Choose a need">
        {problems.map((problem, index) => (
          <button key={problem.group} type="button" role="tab" aria-selected={active === index} aria-controls="build-response" onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{problem.group}
          </button>
        ))}
      </div>
      <div id="build-response" className="build-response" role="tabpanel">
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
