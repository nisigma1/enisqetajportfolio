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
  const tokens = Array.from(children.matchAll(/\S+|\s+/g), (match) => match[0] ?? "");
  let characterIndex = 0;

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
      {tokens.map((token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          return <span key={`${run}-space-${tokenIndex}`} className="text-roll__space" aria-hidden="true" />;
        }

        return (
          <span key={`${run}-word-${tokenIndex}`} className="text-roll__word" aria-hidden="true">
            {Array.from(token).map((character) => {
              const index = characterIndex;
              characterIndex += 1;
              return (
                <span
                  key={`${run}-${tokenIndex}-${index}`}
                  className="text-roll__clip"
                  style={{ "--roll-delay": `${index * staggerMs}ms` } as React.CSSProperties}
                >
                  <span className="text-roll__character">{character}</span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
