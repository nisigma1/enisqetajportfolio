"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener("enis-theme-change", onChange);
  return () => window.removeEventListener("enis-theme-change", onChange);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "light");

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("enis-theme", next);
    window.dispatchEvent(new Event("enis-theme-change"));
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-pressed={theme === "dark"}>
      <span className="theme-toggle-track" aria-hidden="true"><span className="theme-toggle-orb theme-toggle-sun">☼</span><span className="theme-toggle-orb theme-toggle-moon">☾</span></span>
    </button>
  );
}
