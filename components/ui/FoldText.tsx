"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

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
  color = "#f1eee6",
  className = "",
  style = {},
}: FoldTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
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
    if (!root) return undefined;
    const pieces = Array.from(root.querySelectorAll<HTMLElement>(".fold-text__piece"));
    if (!pieces.length) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = { opacity: 0, rotateX: reducedMotion ? 0 : activeHinge.rotateX, rotateY: reducedMotion ? 0 : activeHinge.rotateY, "--fold-crease": reducedMotion ? 0 : safeCrease, transformOrigin: activeHinge.origin, force3D: true };
    const to = { opacity: 1, rotateX: 0, rotateY: 0, "--fold-crease": 0, duration: reducedMotion ? Math.min(duration, 0.2) : duration, ease: reducedMotion ? "power1.out" : ease, stagger: reducedMotion ? Math.min(stagger, 0.02) : stagger, clearProps: "willChange" };
    const play = (repeat: boolean) => {
      timelineRef.current?.kill();
      gsap.killTweensOf(pieces);
      timelineRef.current = gsap.timeline({ repeat: repeat ? -1 : 0, repeatDelay: repeat ? 0.75 : 0 }).fromTo(pieces, from, to);
      return timelineRef.current;
    };
    let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | undefined;
    const hover = () => { play(false); };
    if (trigger === "hover") {
      gsap.set(pieces, { opacity: 1, rotateX: 0, rotateY: 0, "--fold-crease": 0, transformOrigin: activeHinge.origin });
      root.addEventListener("mouseenter", hover);
    } else if (trigger === "scroll") {
      gsap.set(pieces, from);
      scrollTrigger = ScrollTrigger.create({ trigger: root, start: "top 82%", once: true, onEnter: () => play(false) });
    } else play(trigger === "loop");
    return () => {
      root.removeEventListener("mouseenter", hover);
      scrollTrigger?.kill();
      timelineRef.current?.kill();
      gsap.killTweensOf(pieces);
    };
  }, [activeHinge.origin, activeHinge.rotateX, activeHinge.rotateY, duration, ease, safeCrease, stagger, trigger]);

  const rootStyle = { "--fold-text-font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize, "--fold-text-font-weight": fontWeight, "--fold-text-color": color, ...style } as CSSProperties;
  return <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}><span className="fold-text__sr-only">{text}</span><span className="fold-text__visual" aria-hidden="true">{segments}</span></span>;
}
