"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  intensity?: number;
  range?: number;
  actionArea?: "self" | "parent" | "global";
  className?: string;
};

/** Lightweight magnetic motion without an animation-library dependency. */
export function Magnetic({
  children,
  intensity = 0.28,
  range = 120,
  actionArea = "self",
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const enabledRef = useRef(false);
  const frameRef = useRef<number>(0);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateEnabled = () => {
      enabledRef.current = finePointer.matches && !reducedMotion.matches;
      if (!enabledRef.current && ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
    };

    const reset = () => {
      positionRef.current = { x: 0, y: 0 };
      window.cancelAnimationFrame(frameRef.current);
      ref.current?.style.setProperty("transform", "translate3d(0, 0, 0)");
    };

    const move = (event: PointerEvent) => {
      const element = ref.current;
      if (!element || !enabledRef.current || !activeRef.current) return;
      const bounds = element.getBoundingClientRect();
      const distanceX = event.clientX - (bounds.left + bounds.width / 2);
      const distanceY = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(distanceX, distanceY);
      const scale = Math.max(0, 1 - distance / range);
      positionRef.current = {
        x: distance <= range ? distanceX * intensity * scale : 0,
        y: distance <= range ? distanceY * intensity * scale : 0,
      };
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        const { x, y } = positionRef.current;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    const target = actionArea === "parent" ? ref.current?.parentElement : null;
    const activate = () => { activeRef.current = true; };
    const deactivate = () => { activeRef.current = false; reset(); };

    updateEnabled();
    if (actionArea === "global") activeRef.current = true;
    if (target) {
      target.addEventListener("pointerenter", activate);
      target.addEventListener("pointerleave", deactivate);
    }
    window.addEventListener("pointermove", move, { passive: true });
    finePointer.addEventListener("change", updateEnabled);
    reducedMotion.addEventListener("change", updateEnabled);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", move);
      target?.removeEventListener("pointerenter", activate);
      target?.removeEventListener("pointerleave", deactivate);
      finePointer.removeEventListener("change", updateEnabled);
      reducedMotion.removeEventListener("change", updateEnabled);
    };
  }, [actionArea, intensity, range]);

  return (
    <div
      ref={ref}
      className={["magnetic", className].filter(Boolean).join(" ")}
      onPointerEnter={actionArea === "self" ? () => { activeRef.current = true; } : undefined}
      onPointerLeave={actionArea === "self" ? () => { activeRef.current = false; positionRef.current = { x: 0, y: 0 }; ref.current?.style.setProperty("transform", "translate3d(0, 0, 0)"); } : undefined}
    >
      {children}
    </div>
  );
}
