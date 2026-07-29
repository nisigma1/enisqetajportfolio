/* eslint-disable @next/next/no-img-element -- Each clipped image uses the same pre-compressed local source; this is required for the pixel reveal effect. */
"use client";

import { useEffect, useMemo, useState, type HTMLAttributes } from "react";

type Grid = { rows: number; cols: number };

type PixelImageProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  src: string;
  tabletSrc?: string;
  mobileSrc?: string;
  alt: string;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number;
  maxAnimationDelay?: number;
  colorRevealDelay?: number;
  aspectRatio?: string;
  objectPosition?: string;
};

const GRID_LIMIT = 16;

export function PixelImage({
  src,
  tabletSrc,
  mobileSrc,
  alt,
  customGrid = { rows: 6, cols: 4 },
  grayscaleAnimation = true,
  pixelFadeInDuration = 720,
  maxAnimationDelay = 760,
  colorRevealDelay = 980,
  aspectRatio = "3 / 4",
  objectPosition = "50% 50%",
  className,
  ...props
}: PixelImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(!grayscaleAnimation);

  const grid = useMemo<Grid>(() => {
    const rows = Math.max(1, Math.min(GRID_LIMIT, Math.floor(customGrid.rows)));
    const cols = Math.max(1, Math.min(GRID_LIMIT, Math.floor(customGrid.cols)));
    return { rows, cols };
  }, [customGrid.cols, customGrid.rows]);

  useEffect(() => {
    const revealFrame = window.requestAnimationFrame(() => setIsVisible(true));
    const colorTimer = grayscaleAnimation
      ? window.setTimeout(() => setShowColor(true), colorRevealDelay)
      : undefined;

    return () => {
      window.cancelAnimationFrame(revealFrame);
      if (colorTimer) window.clearTimeout(colorTimer);
    };
  }, [colorRevealDelay, grayscaleAnimation]);

  const pieces = useMemo(() => {
    const total = grid.rows * grid.cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / grid.cols);
      const col = index % grid.cols;
      const clipPath = `polygon(${col * (100 / grid.cols)}% ${row * (100 / grid.rows)}%, ${(col + 1) * (100 / grid.cols)}% ${row * (100 / grid.rows)}%, ${(col + 1) * (100 / grid.cols)}% ${(row + 1) * (100 / grid.rows)}%, ${col * (100 / grid.cols)}% ${(row + 1) * (100 / grid.rows)}%)`;
      const delay = ((row * 13 + col * 7) % total) / Math.max(1, total - 1) * maxAnimationDelay;
      return { clipPath, delay };
    });
  }, [grid, maxAnimationDelay]);

  return (
    <div
      {...props}
      className={["pixel-image", isVisible ? "pixel-image--visible" : "", showColor ? "pixel-image--color" : "", className].filter(Boolean).join(" ")}
      style={{
        "--pixel-aspect": aspectRatio,
        "--pixel-object-position": objectPosition,
        "--pixel-source": `url(\"${src}\")`,
        "--pixel-source-tablet": `url(\"${tabletSrc ?? src}\")`,
        "--pixel-source-mobile": `url(\"${mobileSrc ?? tabletSrc ?? src}\")`,
        ...props.style,
      } as React.CSSProperties}
    >
      <img
        className="pixel-image__source"
        src={src}
        srcSet={mobileSrc && tabletSrc ? `${mobileSrc} 750w, ${tabletSrc} 900w, ${src} 1125w` : undefined}
        sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 48vw, 44vw"
        alt={alt}
        draggable={false}
        decoding="async"
        fetchPriority="high"
      />
      {pieces.map((piece, index) => (
        <span
          className="pixel-image__piece"
          key={`${grid.rows}-${grid.cols}-${index}`}
          aria-hidden="true"
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${piece.delay}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        />
      ))}
    </div>
  );
}
