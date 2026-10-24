"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

type StrokeTextTrigger = "mount" | "hover" | "scroll" | "loop";
type StrokeTextFillMode = "wipe" | "fade" | "none";

type StrokeTextProps = {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: StrokeTextTrigger;
  fillMode?: StrokeTextFillMode;
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  reverse?: boolean;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
};

type StrokeTextBox = { x: number; y: number; width: number; height: number };

export function StrokeText({
  text,
  strokeColor = "var(--accent)",
  fillColor = "var(--text-primary)",
  strokeWidth = 1.1,
  drawDuration = 0.9,
  fillDelay = 0.08,
  stagger = 0.025,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  fontSize = 80,
  fontWeight = 420,
  letterSpacing = -4,
  reverse = false,
  height,
  className = "",
  style = {},
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<StrokeTextBox | null>(null);
  const rawId = useId();
  const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const characters = useMemo(() => Array.from(text), [text]);
  const dash = Math.max(fontSize * 7, 200);
  const fontStyle = useMemo<CSSProperties>(() => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }), [fontSize, fontWeight, letterSpacing]);

  useLayoutEffect(() => {
    const node = strokeTextRef.current;
    if (!node) return undefined;
    let cancelled = false;
    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;
      try {
        const bounds = strokeTextRef.current.getBBox();
        if (!bounds.width) return;
        const padding = Math.max(strokeWidth, fontSize * 0.08);
        const next = { x: bounds.x - padding, y: bounds.y - padding, width: bounds.width + padding * 2, height: bounds.height + padding * 2 };
        setBox((previous) => previous && Math.abs(previous.width - next.width) < 0.5 && Math.abs(previous.height - next.height) < 0.5 ? previous : next);
      } catch {
        // The next browser layout pass will retry this measurement.
      }
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    return () => { cancelled = true; };
  }, [characters, fontSize, fontWeight, letterSpacing, strokeWidth]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const strokes = Array.from(root.querySelectorAll<SVGElement>("[data-stroke-char]"));
    const fills = Array.from(root.querySelectorAll<SVGElement>("[data-fill-char]"));
    const animations: Animation[] = [];
    const play = () => {
      animations.forEach((animation) => animation.cancel());
      animations.length = 0;
      strokes.forEach((stroke, index) => {
        stroke.style.strokeDasharray = String(dash);
        animations.push(stroke.animate([{strokeDashoffset: String(dash)}, {strokeDashoffset: "0"}], {duration: drawDuration * 1000, delay: (reverse ? strokes.length - index - 1 : index) * stagger * 1000, easing: ease === "linear" ? "linear" : "ease-out", fill: "backwards", iterations: trigger === "loop" ? Infinity : 1}));
      });
      if (fillMode !== "none") fills.forEach((fill, index) => animations.push(fill.animate([{opacity:0}, {opacity:1}], {duration: Math.max(350, drawDuration * 500), delay:(drawDuration + fillDelay + index * stagger) * 1000, fill:"backwards"})));
    };
    let observer: IntersectionObserver | undefined;
    if (trigger === "hover") root.addEventListener("pointerenter", play);
    else if (trigger === "scroll" || trigger === "loop") {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && animations.length === 0) play();
        else if (trigger === "loop") animations.forEach(a=>entry.isIntersecting ? a.play() : a.pause());
      }, {threshold:0.1});
      observer.observe(root);
    } else play();
    return () => {
      observer?.disconnect();
      root.removeEventListener("pointerenter", play);
      animations.forEach((animation) => animation.cancel());
    };
  }, [box, dash, drawDuration, ease, fillDelay, fillMode, reverse, stagger, trigger]);

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;
  return (
    <span ref={rootRef} className={`stroke-text ${trigger === "hover" ? "stroke-text--hover" : ""} ${className}`.trim()} style={{ ...style, ["--stroke-text-height"]: height ?? `${Math.round(fontSize * 1.3)}px` } as CSSProperties} aria-hidden="true">
      <svg className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMinYMid meet">
        {fillMode === "wipe" && box && <defs><clipPath id={wipeId} clipPathUnits="userSpaceOnUse"><rect x={box.x} y={box.y} width={box.width} height={box.height} /></clipPath></defs>}
        <text ref={strokeTextRef} className="stroke-text__stroke" x="0" y="0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" style={fontStyle}>{characters.map((character, index) => <tspan data-stroke-char key={`stroke-${index}`}>{character}</tspan>)}</text>
        <text className="stroke-text__fill" x="0" y="0" fill={fillColor} stroke="none" style={fontStyle} clipPath={fillMode === "wipe" && box ? `url(#${wipeId})` : undefined}>{characters.map((character, index) => <tspan data-fill-char key={`fill-${index}`}>{character}</tspan>)}</text>
      </svg>
    </span>
  );
}
