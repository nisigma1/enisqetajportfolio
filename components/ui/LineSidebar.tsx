"use client";

import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition/TransitionLink";

const FALLOFF_CURVES = {
  linear: (proximity: number) => proximity,
  smooth: (proximity: number) => (
    proximity * proximity * (3 - 2 * proximity)
  ),
  sharp: (proximity: number) => proximity * proximity * proximity,
} as const;

type Falloff = keyof typeof FALLOFF_CURVES;

type LineSidebarProps = {
  items: readonly string[];
  hrefs?: readonly string[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  onItemClick?: (index: number, label: string) => void;
  className?: string;
};

type SidebarStyle = CSSProperties & {
  "--accent-color": string;
  "--text-color": string;
  "--marker-color": string;
  "--marker-length": string;
  "--marker-gap": string;
  "--tick-scale": number;
  "--max-shift": string;
  "--item-gap": string;
  "--font-size": string;
};

function routeMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LineSidebar({
  items,
  hrefs,
  accentColor = "var(--accent)",
  textColor = "var(--text-secondary)",
  markerColor = "var(--border-strong)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  onItemClick,
  className = "",
}: LineSidebarProps) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const runFrameRef = useRef<(timestamp: number) => void>(() => undefined);
  const lastFrameRef = useRef(0);
  const activeRef = useRef<number | null>(defaultActive);
  const smoothingRef = useRef(smoothing);
  const reducedMotionRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    defaultActive,
  );

  const routeIndex = hrefs?.findIndex((href) => routeMatches(pathname, href));
  const activeIndex = routeIndex !== undefined && routeIndex >= 0
    ? routeIndex
    : selectedIndex;

  const runFrame = useCallback((timestamp: number) => {
    const elapsed = Math.min((timestamp - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = timestamp;
    const timeConstant = Math.max(smoothingRef.current, 1) / 1000;
    const interpolation = reducedMotionRef.current
      ? 1
      : 1 - Math.exp(-elapsed / timeConstant);
    let moving = false;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;

      const target = Math.max(
        targetsRef.current[index] || 0,
        activeRef.current === index ? 1 : 0,
      );
      const current = currentRef.current[index] || 0;
      const next = current + (target - current) * interpolation;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;

      currentRef.current[index] = value;
      element.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    });

    animationFrameRef.current = moving
      ? window.requestAnimationFrame(runFrameRef.current)
      : null;
  }, []);

  const startLoop = useCallback(() => {
    if (animationFrameRef.current !== null) return;
    lastFrameRef.current = performance.now();
    animationFrameRef.current = window.requestAnimationFrame(
      runFrameRef.current,
    );
  }, []);

  useEffect(() => {
    runFrameRef.current = runFrame;
  }, [runFrame]);

  useEffect(() => {
    activeRef.current = activeIndex;
    smoothingRef.current = smoothing;
    startLoop();
  }, [activeIndex, smoothing, startLoop]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      startLoop();
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startLoop]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLUListElement>) => {
    if (
      reducedMotionRef.current
      || event.pointerType === "touch"
      || !listRef.current
    ) {
      return;
    }

    const listRect = listRef.current.getBoundingClientRect();
    const pointerY = event.clientY - listRect.top;
    const curve = FALLOFF_CURVES[falloff];

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      const center = element.offsetTop + element.offsetHeight / 2;
      const distance = Math.abs(pointerY - center);
      targetsRef.current[index] = curve(
        Math.max(0, 1 - distance / proximityRadius),
      );
    });
    startLoop();
  }, [falloff, proximityRadius, startLoop]);

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = items.map(() => 0);
    startLoop();
  }, [items, startLoop]);

  const handleItemClick = (index: number, label: string) => {
    setSelectedIndex(index);
    onItemClick?.(index, label);
  };

  const style: SidebarStyle = {
    "--accent-color": accentColor,
    "--text-color": textColor,
    "--marker-color": markerColor,
    "--marker-length": `${markerLength}px`,
    "--marker-gap": `${markerGap}px`,
    "--tick-scale": tickScale,
    "--max-shift": `${maxShift}px`,
    "--item-gap": `${itemGap}px`,
    "--font-size": `${fontSize}rem`,
  };

  return (
    <nav
      className={[
        "line-sidebar",
        showMarker ? "line-sidebar--markers" : "",
        scaleTick ? "line-sidebar--scale-tick" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={style}
      aria-label="Explore the portfolio"
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => {
          const content = (
            <span className="line-sidebar__label">
              {showIndex && (
                <span className="line-sidebar__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span className="line-sidebar__text">{label}</span>
            </span>
          );

          return (
            <li
              key={`${label}-${index}`}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className="line-sidebar__item"
              style={{ "--effect": activeIndex === index ? 1 : 0 } as CSSProperties}
            >
              {showMarker && (
                <span className="line-sidebar__marker" aria-hidden="true" />
              )}
              {hrefs?.[index] ? (
                <TransitionLink
                  className="line-sidebar__control"
                  href={hrefs[index]}
                  aria-current={activeIndex === index ? "page" : undefined}
                  onClick={() => handleItemClick(index, label)}
                >
                  {content}
                </TransitionLink>
              ) : (
                <button
                  className="line-sidebar__control"
                  type="button"
                  aria-pressed={activeIndex === index}
                  onClick={() => handleItemClick(index, label)}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
