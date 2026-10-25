/* Each clipped layer reuses the same pre-compressed local source for the pixel reveal effect. */
import type { CSSProperties, HTMLAttributes } from "react";

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
  const grid = {
    rows: Math.max(1, Math.min(GRID_LIMIT, Math.floor(customGrid.rows))),
    cols: Math.max(1, Math.min(GRID_LIMIT, Math.floor(customGrid.cols))),
  };
  const total = grid.rows * grid.cols;
  const pieces = Array.from({ length: total }, (_, index) => {
    const row = Math.floor(index / grid.cols);
    const col = index % grid.cols;
    const delay = ((row * 13 + col * 7) % total) / Math.max(1, total - 1) * maxAnimationDelay;
    // Real tile bounds preserve the reveal but avoid 24 full-portrait layers
    // with clip paths, especially expensive on high-DPR phone screens.
    return { row, col, delay };
  });

  return (
    <div
      {...props}
      className={["pixel-image", grayscaleAnimation ? "pixel-image--reveal" : "pixel-image--color", className].filter(Boolean).join(" ")}
      style={{
        "--pixel-aspect": aspectRatio,
        "--pixel-object-position": objectPosition,
        "--pixel-source": `url("${src}")`,
        "--pixel-source-tablet": `url("${tabletSrc ?? src}")`,
        "--pixel-source-mobile": `url("${mobileSrc ?? tabletSrc ?? src}")`,
        ...props.style,
      } as CSSProperties}
    >
      <picture style={{ display: "contents" }}>
      {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
      {tabletSrc && <source media="(max-width: 1023px)" srcSet={tabletSrc} />}
      <img
        className="pixel-image__source"
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        fetchPriority="high"
      />
      </picture>
      {pieces.map((piece, index) => (
        <span
          className="pixel-image__piece"
          key={`${grid.rows}-${grid.cols}-${index}`}
          aria-hidden="true"
          style={{
            inset: "auto",
            left: `${piece.col * 100 / grid.cols}%`,
            top: `${piece.row * 100 / grid.rows}%`,
            width: `${100 / grid.cols}%`,
            height: `${100 / grid.rows}%`,
            backgroundSize: `${grid.cols * 100}% ${grid.rows * 100}%`,
            backgroundPosition: `${grid.cols > 1 ? piece.col * 100 / (grid.cols - 1) : 0}% ${grid.rows > 1 ? piece.row * 100 / (grid.rows - 1) : 0}%`,
            animationDelay: `${colorRevealDelay + piece.delay}ms`,
            animationDuration: `${pixelFadeInDuration}ms`,
          }}
        />
      ))}
    </div>
  );
}
