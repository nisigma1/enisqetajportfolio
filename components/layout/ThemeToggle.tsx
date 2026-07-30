"use client";

import { useRouteTransition } from "@/components/transition/RouteTransitionContext";
import { AnimatedThemeToggler } from "@/components/ui/AnimatedThemeToggler";

export function ThemeToggle() {
  const { isTransitioning } = useRouteTransition();
  return <AnimatedThemeToggler className="theme-toggle" variant="hexagon" duration={620} disabled={isTransitioning} />;
}
