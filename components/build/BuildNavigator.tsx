import { problems } from "@/data/site";

export function BuildNavigator() {
  return (
    <div className="build-needs">
      {problems.map((problem, index) => (
        <details key={problem.group} name="project-need" open={index === 0}>
          <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{problem.problem}</strong><i aria-hidden="true">+</i></summary>
          <div className="build-need-answer">
            <p><span>Need</span>{problem.need}</p>
            <p><span>Reframe</span>{problem.reframe}</p>
            <p><span>Possible useful form</span>{problem.forms}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
