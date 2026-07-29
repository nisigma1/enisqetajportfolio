"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

type TextRollProps = HTMLAttributes<HTMLSpanElement> & {
  children: string;
  staggerMs?: number;
};

/**
 * An accessible, dependency-free character roll. The complete phrase remains
 * available to assistive technology while individual characters are decorative.
 */
export function TextRoll({ children, className, staggerMs = 34, ...props }: TextRollProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [run, setRun] = useState(0);
  const words = children.trim().split(/\s+/).filter(Boolean);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setIsReady(true);
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [run]);

  return (
    <span
      ref={elementRef}
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
      {words.map((word, index) => {
        return (
          <span
            key={`${run}-word-${index}`}
            className="text-roll__clip"
            aria-hidden="true"
            style={{ "--roll-delay": `${index * staggerMs}ms` } as React.CSSProperties}
          >
            <span className="text-roll__character">{word}</span>
          </span>
        );
      })}
    </span>
  );
}
