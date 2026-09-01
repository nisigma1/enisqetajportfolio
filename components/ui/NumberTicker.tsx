"use client";

import { useEffect, useRef, useState } from "react";

type NumberTickerProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function NumberTicker({
  value,
  suffix = "",
  duration = 850,
  className,
}: NumberTickerProps) {
  const reference = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const element = reference.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    let startedAt = 0;
    const animate = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setDisplayValue(0);
      frame = window.requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.45 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  return <span ref={reference} className={className} aria-label={`${value}${suffix}`}>{`${displayValue}${suffix}`}</span>;
}
