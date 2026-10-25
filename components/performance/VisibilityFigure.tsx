"use client";

import {useEffect, useRef, type HTMLAttributes} from "react";

/** Preserve the figure and its visual effect; stop hidden ambient repainting. */
export function VisibilityFigure({children, ...props}: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const sync = () => {
      element.dataset.animationVisible = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return <figure {...props} ref={ref} data-animation-visible="false">{children}</figure>;
}
