"use client";

import { createContext, useContext } from "react";

export type RouteTransitionContextValue = {
  isTransitioning: boolean;
  navigateWithTransition: (
    href: string,
    origin: { x: number; y: number },
  ) => boolean;
};

export const RouteTransitionContext =
  createContext<RouteTransitionContextValue | null>(null);

export function useRouteTransition() {
  const value = useContext(RouteTransitionContext);
  if (!value) {
    throw new Error("useRouteTransition must be used inside RouteTransitionProvider");
  }
  return value;
}
