"use client";

import { useEffect, useState } from "react";
import { useRouteTransition } from "@/components/transition/RouteTransitionContext";
import { THEME_KEY, VIBE_KEY, vibes } from "@/lib/vibes";

type Vibe = (typeof vibes)[number];

function setPalette(root: HTMLElement, vibe: Vibe) {
  root.dataset.vibe = vibe.id;
  root.dataset.theme = vibe.theme;
}

function syncStorage(event: StorageEvent) {
  if (event.key !== VIBE_KEY) return;
  const vibe = vibes.find(({ id }) => id === event.newValue);
  if (vibe) setPalette(document.documentElement, vibe);
}

export function ThemeToggle() {
  const { isTransitioning } = useRouteTransition();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const onStorage = (event: StorageEvent) => syncStorage(event);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function switchVibe() {
    const root = document.documentElement;
    if (isTransitioning || root.dataset.vibeTransition) return;

    const current = root.dataset.vibe ?? (root.dataset.theme === "dark" ? "night" : "paper");
    const next = vibes[(vibes.findIndex(({ id }) => id === current) + 1) % vibes.length];
    const apply = () => {
      setPalette(root, next);
      try {
        localStorage.setItem(THEME_KEY, next.theme);
        localStorage.setItem(VIBE_KEY, next.id);
      } catch {
        // The palette still works when storage is unavailable.
      }
      setAnnouncement(`${next.label} vibe selected.`);
    };
    const clear = () => { delete root.dataset.vibeTransition; };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    if (typeof document.startViewTransition === "function") {
      root.dataset.vibeTransition = "active";
      try {
        const transition = document.startViewTransition(apply);
        void transition.ready.catch(() => {});
        void transition.finished.then(clear, clear);
        return;
      } catch {
        clear();
      }
    }

    // Even a direct token change triggers existing button/link transitions.
    // Swap the full palette together when a snapshot reveal isn't available.
    root.dataset.vibeTransition = "instant";
    try {
      apply();
      // Resolve the new palette before restoring component hover transitions.
      void document.body.offsetHeight;
    } finally {
      clear();
    }
  }

  return (
    <>
      <button type="button" className="theme-toggle" onClick={switchVibe} disabled={isTransitioning}>
        Switch the vibe
      </button>
      <span className="visually-hidden" role="status">{announcement}</span>
    </>
  );
}
