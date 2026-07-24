export type TransitionPhase =
  | "idle"
  | "preparing"
  | "covering"
  | "covered"
  | "navigating"
  | "revealing"
  | "recovering";

export const transitionPhases: readonly TransitionPhase[];
export function canAdvanceTransition(
  current: TransitionPhase,
  next: TransitionPhase,
): boolean;

export function activeRouteForPathname(pathname: string):
  | "index"
  | "research"
  | "markets"
  | "work"
  | "build"
  | "contact";

export function shouldInterceptNavigation(input: {
  href: string;
  currentHref: string;
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  target?: string;
  download?: boolean;
}): boolean;

export type TransitionGrid = {
  columns: number;
  rows: number;
  count: number;
  width: number;
  height: number;
};

export function gridForViewport(width: number, height: number): TransitionGrid;

export function createTileWave(
  grid: TransitionGrid,
  origin: { x: number; y: number },
  maxDelay?: number,
): Array<{
  row: number;
  column: number;
  distance: number;
  index: number;
  coverDelay: number;
  revealDelay: number;
}>;
