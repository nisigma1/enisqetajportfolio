"use client";

import { CSSProperties, TransitionEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  createTileWave,
  gridForViewport,
  type TransitionGrid,
  type TransitionPhase,
} from "@/lib/route-transition.mjs";

type MosaicTransitionOverlayProps = {
  phase: TransitionPhase;
  origin: { x: number; y: number } | null;
  theme: "light" | "dark";
  requestId: number;
  onCovered: (requestId: number) => void;
  onRevealComplete: (requestId: number) => void;
};

const MAX_WAVE_DELAY = 150;

function readViewport(): TransitionGrid {
  if (typeof window === "undefined") return gridForViewport(1366, 768);
  const viewport = window.visualViewport;
  return gridForViewport(
    window.innerWidth,
    viewport?.height ?? window.innerHeight,
  );
}

export function MosaicTransitionOverlay({
  phase,
  origin,
  theme,
  requestId,
  onCovered,
  onRevealComplete,
}: MosaicTransitionOverlayProps) {
  const [grid, setGrid] = useState<TransitionGrid>(() => gridForViewport(1366, 768));
  const coverSignals = useRef({ tile: false, backing: false, sent: false });
  const revealSent = useRef(false);

  useEffect(() => {
    if (phase !== "idle") return;

    const update = () => setGrid(readViewport());
    update();
    window.addEventListener("resize", update, { passive: true });
    window.visualViewport?.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "covering") {
      coverSignals.current = { tile: false, backing: false, sent: false };
    }
    if (phase === "revealing" || phase === "recovering") {
      revealSent.current = false;
    }
  }, [phase, requestId]);

  const originX = origin?.x ?? grid.width / 2;
  const originY = origin?.y ?? 0;
  const tiles = useMemo(
    () => createTileWave(grid, { x: originX, y: originY }, MAX_WAVE_DELAY),
    [grid, originX, originY],
  );
  const lastCoverIndex = useMemo(
    () => tiles.reduce(
      (last, tile) => tile.coverDelay >= tiles[last].coverDelay ? tile.index : last,
      0,
    ),
    [tiles],
  );
  const lastRevealIndex = useMemo(
    () => tiles.reduce(
      (last, tile) => tile.revealDelay >= tiles[last].revealDelay ? tile.index : last,
      0,
    ),
    [tiles],
  );

  function maybeConfirmCoverage() {
    const signals = coverSignals.current;
    if (signals.tile && signals.backing && !signals.sent) {
      signals.sent = true;
      onCovered(requestId);
    }
  }

  function onBackingTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (phase !== "covering" || event.propertyName !== "opacity") return;
    coverSignals.current.backing = true;
    maybeConfirmCoverage();
  }

  function onTileTransitionEnd(
    event: TransitionEvent<HTMLSpanElement>,
    index: number,
  ) {
    if (event.propertyName !== "transform") return;

    if (phase === "covering" && index === lastCoverIndex) {
      coverSignals.current.tile = true;
      maybeConfirmCoverage();
      return;
    }

    if (
      (phase === "revealing" || phase === "recovering")
      && index === lastRevealIndex
      && !revealSent.current
    ) {
      revealSent.current = true;
      onRevealComplete(requestId);
    }
  }

  const style = {
    "--mosaic-columns": grid.columns,
    "--mosaic-rows": grid.rows,
  } as CSSProperties;

  return (
    <div
      className="mosaic-transition"
      data-phase={phase}
      data-transition-theme={theme}
      aria-hidden="true"
      style={style}
    >
      <div
        className="mosaic-transition__backing"
        onTransitionEnd={onBackingTransitionEnd}
      />
      <div className="mosaic-transition__grid">
        {tiles.map((tile) => (
          <span
            key={`${grid.columns}-${grid.rows}-${tile.index}`}
            className="mosaic-transition__tile"
            style={{
              "--cover-delay": `${tile.coverDelay}ms`,
              "--reveal-delay": `${tile.revealDelay}ms`,
            } as CSSProperties}
            onTransitionEnd={(event) => onTileTransitionEnd(event, tile.index)}
          />
        ))}
      </div>
    </div>
  );
}
