"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

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
  strokeColor = "#8aa1ff",
  fillColor = "#f1eee6",
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
  const wipeRectRef = useRef<SVGRectElement>(null);
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
    if (!root || !box) return undefined;
    const strokes = gsap.utils.toArray<SVGElement>(root.querySelectorAll("[data-stroke-char]"));
    const fills = gsap.utils.toArray<SVGElement>(root.querySelectorAll("[data-fill-char]"));
    const wipe = wipeRectRef.current;
    if (!strokes.length) return undefined;
    const fillEnabled = fillMode !== "none";
    const useWipe = fillEnabled && fillMode === "wipe";
    const targets = [...strokes, ...fills, ...(wipe ? [wipe] : [])];
    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: 0 } });
    };
    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: fillEnabled ? box.width : 0 } });
    };
    const build = () => {
      setStart();
      const timeline = gsap.timeline({ paused: true, repeat: trigger === "loop" ? -1 : 0, repeatDelay: trigger === "loop" ? 0.9 : 0 });
      const staggerConfig = reverse ? { each: stagger, from: "end" as const } : stagger;
      timeline.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);
      if (useWipe && wipe) timeline.to(wipe, { attr: { width: box.width }, duration: Math.max(0.35, drawDuration * 0.5), ease: "power2.inOut" }, drawDuration + fillDelay);
      else if (fillEnabled) timeline.to(fills, { opacity: 1, duration: Math.max(0.35, drawDuration * 0.5), ease: "power2.out", stagger: staggerConfig }, drawDuration + fillDelay);
      return timeline;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnd();
      return () => gsap.killTweensOf(targets);
    }
    let timeline = build();
    let scrollTrigger: ScrollTrigger | undefined;
    const replay = () => { timeline.kill(); timeline = build(); timeline.play(0); };
    if (trigger === "hover") {
      setEnd();
      root.addEventListener("pointerenter", replay);
    } else if (trigger === "scroll") {
      scrollTrigger = ScrollTrigger.create({ trigger: root, start: "top 82%", once: true, onEnter: () => timeline.play(0) });
    } else timeline.play(0);
    return () => {
      root.removeEventListener("pointerenter", replay);
      scrollTrigger?.kill();
      timeline.kill();
      gsap.killTweensOf(targets);
    };
  }, [box, dash, drawDuration, ease, fillDelay, fillMode, reverse, stagger, trigger]);

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;
  return (
    <span ref={rootRef} className={`stroke-text ${trigger === "hover" ? "stroke-text--hover" : ""} ${className}`.trim()} style={{ ...style, ["--stroke-text-height"]: height ?? `${Math.round(fontSize * 1.3)}px` } as CSSProperties} aria-hidden="true">
      <svg className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMinYMid meet">
        {fillMode === "wipe" && box && <defs><clipPath id={wipeId} clipPathUnits="userSpaceOnUse"><rect ref={wipeRectRef} x={box.x} y={box.y} width="0" height={box.height} /></clipPath></defs>}
        <text ref={strokeTextRef} className="stroke-text__stroke" x="0" y="0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" style={fontStyle}>{characters.map((character, index) => <tspan data-stroke-char key={`stroke-${index}`}>{character}</tspan>)}</text>
        <text className="stroke-text__fill" x="0" y="0" fill={fillColor} stroke="none" style={fontStyle} clipPath={fillMode === "wipe" && box ? `url(#${wipeId})` : undefined}>{characters.map((character, index) => <tspan data-fill-char key={`fill-${index}`}>{character}</tspan>)}</text>
      </svg>
    </span>
  );
}
