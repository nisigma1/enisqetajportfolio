export type TransitionPhase =
  | "idle"
  | "preparing"
  | "covering"
  | "covered"
  | "navigating"
  | "revealing"
  | "recovering";

export type TransitionGrid = {
  columns: number;
  rows: number;
  count: number;
  width: number;
  height: number;
};

export type TransitionOrigin = {
  x: number;
  y: number;
};

export type TransitionTile = {
  row: number;
  column: number;
  distance: number;
  index: number;
  coverDelay: number;
  revealDelay: number;
};

export const transitionPhases: readonly TransitionPhase[];

export function canAdvanceTransition(
  current: TransitionPhase,
  next: TransitionPhase,
): boolean;

export function activeRouteForPathname(pathname: string): string;

export function shouldInterceptNavigation(options: {
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

export function gridForViewport(
  width: number,
  height: number,
): TransitionGrid;

export function createTileWave(
  grid: TransitionGrid,
  origin: TransitionOrigin,
  maxDelay?: number,
): TransitionTile[];
