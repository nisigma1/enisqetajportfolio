"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";

type SplitBy = "char" | "word" | "line";
type Hinge = "top" | "bottom" | "left" | "right";
type Trigger = "mount" | "hover" | "scroll" | "loop";

type FoldTextProps = {
  text: string;
  splitBy?: SplitBy;
  hinge?: Hinge;
  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: Trigger;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

const hingeConfig: Record<Hinge, { origin: string; rotateX: number; rotateY: number }> = {
  top: { origin: "50% 0%", rotateX: -92, rotateY: 0 },
  bottom: { origin: "50% 100%", rotateX: 92, rotateY: 0 },
  left: { origin: "0% 50%", rotateX: 0, rotateY: 92 },
  right: { origin: "100% 50%", rotateX: 0, rotateY: -92 },
};

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

export function FoldText({
  text,
  splitBy = "char",
  hinge = "top",
  duration = 0.62,
  stagger = 0.035,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.42,
  trigger = "mount",
  fontSize = "clamp(2.6rem, 5.4vw, 5rem)",
  fontWeight = 420,
  color = "var(--text-primary)",
  className = "",
  style = {},
}: FoldTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const activeHinge = hingeConfig[hinge];
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const segments = useMemo(() => {
    let index = 0;
    const piece = (content: string, key: string, split: SplitBy = splitBy): ReactNode => {
      index += 1;
      return <span className="fold-text__segment" data-fold-split={split} key={key} style={{ "--fold-perspective": `${safePerspective}px` } as CSSProperties}><span className="fold-text__piece" data-fold-hinge={hinge} style={{ transformOrigin: activeHinge.origin, "--fold-crease": 0 } as CSSProperties}>{content || "\u00A0"}</span></span>;
    };
    if (splitBy === "line") return text.split("\n").map((line, lineIndex) => <span className="fold-text__line" key={`line-${lineIndex}`}>{piece(line || "\u00A0", `line-${lineIndex}`, "line")}</span>);
    if (splitBy === "word") return text.split(/(\s+)/).flatMap((part, partIndex) => !part ? [] : /^\s+$/.test(part) ? <span className="fold-text__whitespace" key={`space-${partIndex}`}>{part.replace(/ /g, "\u00A0")}</span> : piece(part, `word-${index}`));
    return Array.from(text).map((character, characterIndex) => character === "\n" ? <br key={`break-${characterIndex}`} /> : piece(character === " " ? "\u00A0" : character, `char-${characterIndex}`));
  }, [activeHinge.origin, safePerspective, splitBy, text, hinge]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pieces = Array.from(root.querySelectorAll<HTMLElement>(".fold-text__piece"));
    if (!pieces.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    const play = () => {
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = pieces.map((piece, index) => piece.animate([
        { opacity: 0, transform: `rotateX(${activeHinge.rotateX}deg) rotateY(${activeHinge.rotateY}deg)`, transformOrigin: activeHinge.origin, "--fold-crease": safeCrease },
        { opacity: 1, transform: "rotateX(0deg) rotateY(0deg)", transformOrigin: activeHinge.origin, "--fold-crease": 0 },
      ], { duration: duration * 1000, delay: index * stagger * 1000, easing: ease === "linear" ? "linear" : "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards", iterations: trigger === "loop" ? Infinity : 1 }));
    };
    let observer: IntersectionObserver | undefined;
    if (trigger === "hover") root.addEventListener("pointerenter", play);
    else if (trigger === "scroll" || trigger === "loop") {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && animationsRef.current.length === 0) play();
        else if (trigger === "loop") animationsRef.current.forEach((animation) => visible && !document.hidden ? animation.play() : animation.pause());
      }, { threshold: 0.1 });
      observer.observe(root);
    } else play();
    const onVisibility = () => animationsRef.current.forEach((animation) => visible && !document.hidden ? animation.play() : animation.pause());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer?.disconnect();
      root.removeEventListener("pointerenter", play);
      document.removeEventListener("visibilitychange", onVisibility);
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };
  }, [activeHinge.origin, activeHinge.rotateX, activeHinge.rotateY, duration, ease, safeCrease, stagger, trigger]);

  const rootStyle = { "--fold-text-font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize, "--fold-text-font-weight": fontWeight, "--fold-text-color": color, ...style } as CSSProperties;
  return <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}><span className="fold-text__sr-only">{text}</span><span className="fold-text__visual" aria-hidden="true">{segments}</span></span>;
}
