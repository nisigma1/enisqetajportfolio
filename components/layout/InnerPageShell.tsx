import type { ReactNode } from "react";

type InnerPageShellProps = {
  variant: "background" | "work" | "malera" | "analysis" | "contact";
  eyebrow: string;
  title: ReactNode;
  summary: string;
  meta?: readonly string[];
  children: ReactNode;
};

export function InnerPageShell({
  variant,
  eyebrow,
  title,
  summary,
  meta = [],
  children,
}: InnerPageShellProps) {
  return (
    <main id="main" className={`inner-page inner-page--${variant}`}>
      <header className="inner-masthead">
        <p className="inner-masthead__eyebrow">{eyebrow}</p>
        <div className="inner-masthead__lead">
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
        {meta.length > 0 && (
          <ul className="inner-masthead__meta" aria-label={`${eyebrow} overview`}>
            {meta.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
      </header>
      {children}
    </main>
  );
}
