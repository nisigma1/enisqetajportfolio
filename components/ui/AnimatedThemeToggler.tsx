"use client";

import { useCallback, useRef, useSyncExternalStore, type ButtonHTMLAttributes } from "react";

type Theme = "light" | "dark";
export type ThemeTransitionVariant = "circle" | "hexagon" | "star";

type AnimatedThemeTogglerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  duration?: number;
  variant?: ThemeTransitionVariant;
  fromCenter?: boolean;
};

type BrowserViewTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => BrowserViewTransition;
};

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeTheme(onChange: () => void) {
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== "enis-theme") return;
    document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light";
    onChange();
  };
  window.addEventListener("enis-theme-change", onChange);
  window.addEventListener("storage", syncStorage);
  return () => {
    window.removeEventListener("enis-theme-change", onChange);
    window.removeEventListener("storage", syncStorage);
  };
}

function polygonPath(
  variant: Exclude<ThemeTransitionVariant, "circle">,
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
) {
  const sides = variant === "hexagon" ? 6 : 10;
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / sides);
    const pointRadius = variant === "star" && index % 2 === 1 ? radius * 0.42 : radius;
    return `${((x + Math.cos(angle) * pointRadius) / width) * 100}% ${((y + Math.sin(angle) * pointRadius) / height) * 100}%`;
  });
  return `polygon(${points.join(", ")})`;
}

function transitionPaths(
  variant: ThemeTransitionVariant,
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
): [string, string] {
  const px = `${(x / width) * 100}%`;
  const py = `${(y / height) * 100}%`;
  if (variant === "circle") return [`circle(0% at ${px} ${py})`, `circle(${radius}px at ${px} ${py})`];
  return [polygonPath(variant, x, y, 2, width, height), polygonPath(variant, x, y, radius * 1.5, width, height)];
}

export function AnimatedThemeToggler({
  className,
  duration = 620,
  variant = "hexagon",
  fromCenter = false,
  disabled,
  ...props
}: AnimatedThemeTogglerProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const transitioningRef = useRef(false);
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => "light");
  const nextTheme = theme === "dark" ? "light" : "dark";

  const applyTheme = useCallback(() => {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("enis-theme", nextTheme);
    window.dispatchEvent(new Event("enis-theme-change"));
  }, [nextTheme]);

  const toggle = useCallback(() => {
    const button = ref.current;
    if (!button || disabled || transitioningRef.current) return;

    const root = document.documentElement;
    const viewTransitionDocument = document as ViewTransitionDocument;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!viewTransitionDocument.startViewTransition || reducedMotion) {
      applyTheme();
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const bounds = button.getBoundingClientRect();
    const x = fromCenter ? viewportWidth / 2 : bounds.left + bounds.width / 2;
    const y = fromCenter ? viewportHeight / 2 : bounds.top + bounds.height / 2;
    const radius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );
    const clipPath = transitionPaths(variant, x, y, radius, viewportWidth, viewportHeight);

    transitioningRef.current = true;
    root.dataset.magicuiThemeVt = "active";
    root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

    const cleanup = () => {
      transitioningRef.current = false;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };

    const transition = viewTransitionDocument.startViewTransition(applyTheme);
    transition.ready.then(() => {
      root.animate(
        { clipPath },
        {
          duration,
          easing: variant === "star" ? "linear" : "cubic-bezier(0.76, 0, 0.24, 1)",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        } as KeyframeAnimationOptions,
      );
    }).catch(cleanup);
    transition.finished.then(cleanup).catch(cleanup);
  }, [applyTheme, disabled, duration, fromCenter, variant]);

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className={["animated-theme-toggler", className].filter(Boolean).join(" ")}
      onClick={toggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      disabled={disabled}
    >
      <span className="animated-theme-toggler__icons" aria-hidden="true">
        <svg className="animated-theme-toggler__sun" viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
        <svg className="animated-theme-toggler__moon" viewBox="0 0 24 24" focusable="false">
          <path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" />
        </svg>
      </span>
    </button>
  );
}
