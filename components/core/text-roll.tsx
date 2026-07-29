"use client";

import { useEffect, useState, type HTMLAttributes } from "react";

type TextRollProps = HTMLAttributes<HTMLSpanElement> & {
  children: string;
  staggerMs?: number;
};

/**
 * An accessible, dependency-free character roll. The complete phrase remains
 * available to assistive technology while individual characters are decorative.
 */
export function TextRoll({ children, className, staggerMs = 34, ...props }: TextRollProps) {
  const [isReady, setIsReady] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [run]);

  return (
    <span
      {...props}
      className={["text-roll", isReady ? "text-roll--ready" : "", className].filter(Boolean).join(" ")}
      aria-label={children}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event);
        if (event.pointerType === "mouse") {
          setIsReady(false);
          setRun((value) => value + 1);
        }
      }}
    >
      {Array.from(children).map((character, index) => (
        <span
          key={`${run}-${index}`}
          className="text-roll__clip"
          aria-hidden="true"
          style={{ "--roll-delay": `${index * staggerMs}ms` } as React.CSSProperties}
        >
          <span className="text-roll__character">{character === " " ? "\u00a0" : character}</span>
        </span>
      ))}
    </span>
  );
}
