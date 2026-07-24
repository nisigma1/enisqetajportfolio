export const transitionPhases = Object.freeze([
  "idle",
  "preparing",
  "covering",
  "covered",
  "navigating",
  "revealing",
  "recovering",
]);

const transitionGraph = Object.freeze({
  idle: ["preparing"],
  preparing: ["covering", "recovering"],
  covering: ["covered", "recovering"],
  covered: ["navigating", "recovering"],
  navigating: ["revealing", "recovering"],
  revealing: ["idle", "recovering"],
  recovering: ["idle"],
});

export function canAdvanceTransition(current, next) {
  return transitionGraph[current]?.includes(next) ?? false;
}

/**
 * Resolve the primary navigation item for a pathname.
 * Nested research and work routes intentionally inherit their parent item.
 */
export function activeRouteForPathname(pathname) {
  if (pathname === "/") return "index";
  if (pathname === "/research" || pathname.startsWith("/research/")) return "research";
  if (pathname === "/markets" || pathname.startsWith("/markets/")) return "markets";
  if (pathname === "/work" || pathname.startsWith("/work/")) return "work";
  if (pathname === "/build" || pathname.startsWith("/build/")) return "build";
  if (pathname === "/contact" || pathname.startsWith("/contact/")) return "contact";
  return "index";
}

/**
 * Progressive-enhancement gate for the route transition.
 */
export function shouldInterceptNavigation({
  href,
  currentHref,
  button = 0,
  metaKey = false,
  ctrlKey = false,
  shiftKey = false,
  altKey = false,
  target = "",
  download = false,
}) {
  if (
    button !== 0
    || metaKey
    || ctrlKey
    || shiftKey
    || altKey
    || target === "_blank"
    || download
  ) {
    return false;
  }

  let current;
  let destination;
  try {
    current = new URL(currentHref);
    destination = new URL(href, current);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(destination.protocol)) return false;
  if (destination.origin !== current.origin) return false;

  const samePath = destination.pathname === current.pathname
    && destination.search === current.search;

  if (samePath) return false;
  return true;
}

export function gridForViewport(width, height) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const columns = safeWidth <= 430
    ? 9
    : safeWidth <= 767
      ? 10
      : safeWidth <= 1023
        ? 13
        : safeWidth <= 1599
          ? 18
          : 20;
  const rows = Math.max(1, Math.ceil((safeHeight * columns) / safeWidth));

  return {
    columns,
    rows,
    count: columns * rows,
    width: safeWidth,
    height: safeHeight,
  };
}

/**
 * A softened Manhattan metric keeps the wave architectural instead of
 * producing an obviously circular ripple.
 */
export function createTileWave(grid, origin, maxDelay = 240) {
  const tileWidth = grid.width / grid.columns;
  const tileHeight = grid.height / grid.rows;
  const points = [];
  let farthest = 0;

  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns; column += 1) {
      const x = (column + 0.5) * tileWidth;
      const y = (row + 0.5) * tileHeight;
      const dx = Math.abs(x - origin.x);
      const dy = Math.abs(y - origin.y);
      const euclidean = Math.hypot(dx, dy);
      const manhattan = dx + dy;
      const distance = euclidean * 0.7 + manhattan * 0.3;
      farthest = Math.max(farthest, distance);
      points.push({ row, column, distance });
    }
  }

  return points.map((point, index) => {
    const normalized = farthest === 0 ? 0 : point.distance / farthest;
    const coverDelay = Math.round(normalized * maxDelay);
    return {
      ...point,
      index,
      coverDelay,
      revealDelay: maxDelay - coverDelay,
    };
  });
}
