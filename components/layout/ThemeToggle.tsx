"use client";

import { useSyncExternalStore } from "react";
import { useRouteTransition } from "@/components/transition/RouteTransitionContext";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "enis-theme") return;
    const next = event.newValue === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    onChange();
  };

  window.addEventListener("enis-theme-change", onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("enis-theme-change", onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeToggle() {
  const { isTransitioning } = useRouteTransition();
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");
  const nextTheme = theme === "dark" ? "light" : "dark";

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("enis-theme", nextTheme);
    window.dispatchEvent(new Event("enis-theme-change"));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      disabled={isTransitioning}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <svg className="theme-toggle-orb theme-toggle-sun" viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
        <svg className="theme-toggle-orb theme-toggle-moon" viewBox="0 0 24 24" focusable="false">
          <path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" />
        </svg>
      </span>
    </button>
  );
}
