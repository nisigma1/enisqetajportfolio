"use client";

import { useState } from "react";
import { problems } from "@/data/site";

export function BuildNavigator() {
  const [active, setActive] = useState(0);
  const current = problems[active];

  return (
    <div className="transformation">
      <div className="transformation-choices" aria-label="Choose a project need">
        {problems.map((problem, index) => (
          <button
            key={problem.group}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{problem.group}</strong>
          </button>
        ))}
      </div>
      <section className="transformation-board" aria-live="polite">
        <div className="transformation-question">
          <span>Starting need</span>
          <h3>{current.problem}</h3>
        </div>
        <div className="transformation-path" aria-label="How the need becomes a product">
          <p><span>Understand</span><strong>{current.need}</strong></p>
          <i aria-hidden="true">→</i>
          <p><span>Shape</span><strong>{current.reframe}</strong></p>
          <i aria-hidden="true">→</i>
          <p><span>Build</span><strong>{current.forms}</strong></p>
        </div>
        <p className="transformation-result"><span>Useful form</span>{current.response}</p>
      </section>
    </div>
  );
}
