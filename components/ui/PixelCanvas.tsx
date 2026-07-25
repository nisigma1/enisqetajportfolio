"use client";

import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface PixelCanvasProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of each pixel cell in pixels. */
  gap?: number;
  /** Speed of the trailing decay. Higher values fade faster. */
  speed?: number;
  /** Colors interpolated through as the trail fades. */
  colors?: string[];
  /** Disable pointer and touch tracking. */
  noFocus?: boolean;
  /** Pixel rendering style. */
  variant?: "default" | "trail" | "glow";
}

interface Pixel {
  x: number;
  y: number;
  size: number;
  intensity: number;
  targetIntensity: number;
  colorPhase: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1]!, 16),
        g: Number.parseInt(result[2]!, 16),
        b: Number.parseInt(result[3]!, 16),
      }
    : null;
}

function lerpColor(color1: string, color2: string, amount: number): string {
  const start = hexToRgb(color1);
  const end = hexToRgb(color2);
  if (!start || !end) return color1;

  const r = Math.round(start.r + (end.r - start.r) * amount);
  const g = Math.round(start.g + (end.g - start.g) * amount);
  const b = Math.round(start.b + (end.b - start.b) * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

export function PixelCanvas({
  className,
  gap = 6,
  speed = 0.02,
  colors = ["#e879f9", "#a78bfa", "#38bdf8", "#22d3ee"],
  noFocus = false,
  variant = "default",
  ...props
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<Pixel[][]>([]);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const getColorFromIntensity = useCallback(
    (intensity: number, phase: number) => {
      if (colors.length === 0) return "#ffffff";
      if (colors.length === 1) return colors[0]!;

      const amount = (phase + intensity) % 1;
      const index = Math.floor(amount * (colors.length - 1));
      const nextIndex = Math.min(index + 1, colors.length - 1);
      const localAmount = (amount * (colors.length - 1)) % 1;
      const color1 = colors[index];
      const color2 = colors[nextIndex];

      if (!color1) return "#ffffff";
      if (!color2) return color1;
      return lerpColor(color1, color2, localAmount);
    },
    [colors],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let columns = 0;
    let rows = 0;
    let visible = true;
    const pixelSize = Math.max(gap, 4);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const initializePixels = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.ceil(width / pixelSize);
      rows = Math.ceil(height / pixelSize);

      const nextPixels: Pixel[][] = [];
      for (let column = 0; column < columns; column += 1) {
        const pixelColumn: Pixel[] = [];
        for (let row = 0; row < rows; row += 1) {
          const existing = pixelsRef.current[column]?.[row];
          pixelColumn.push({
            x: column * pixelSize,
            y: row * pixelSize,
            size: pixelSize - 1,
            intensity: existing?.intensity ?? 0,
            targetIntensity: 0,
            colorPhase: existing?.colorPhase ?? Math.random(),
          });
        }
        nextPixels.push(pixelColumn);
      }
      pixelsRef.current = nextPixels;
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      pointerRef.current = isInside
        ? { x: clientX - rect.left, y: clientY - rect.top }
        : { x: -1000, y: -1000 };
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      pointerRef.current = { x: -1000, y: -1000 };
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };

    const draw = (timestamp: number) => {
      const deltaTime = Math.min(timestamp - lastTimeRef.current, 64);
      lastTimeRef.current = timestamp;

      if (visible) {
        const rect = container.getBoundingClientRect();
        context.clearRect(0, 0, rect.width, rect.height);

        const radius = variant === "glow" ? 120 : 80;
        const glowPasses = variant === "glow" ? 2 : 1;

        for (let column = 0; column < columns; column += 1) {
          const pixelColumn = pixelsRef.current[column];
          if (!pixelColumn) continue;

          for (let row = 0; row < rows; row += 1) {
            const pixel = pixelColumn[row];
            if (!pixel) continue;

            const centerX = pixel.x + pixel.size / 2;
            const centerY = pixel.y + pixel.size / 2;
            const dx = pointerRef.current.x - centerX;
            const dy = pointerRef.current.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            pixel.targetIntensity =
              distance < radius ? Math.pow(1 - distance / radius, 1.5) : 0;

            const interpolation =
              pixel.targetIntensity > pixel.intensity ? 0.3 : speed;
            pixel.intensity +=
              (pixel.targetIntensity - pixel.intensity) * interpolation;
            pixel.colorPhase =
              (pixel.colorPhase + 0.001 * (deltaTime / 16)) % 1;

            if (pixel.intensity <= 0.01) continue;
            const color = getColorFromIntensity(
              pixel.intensity,
              pixel.colorPhase,
            );

            if (variant === "glow" && pixel.intensity > 0.2) {
              for (let pass = glowPasses; pass > 0; pass -= 1) {
                const glowSize = pixel.size + pass * 4;
                const glowOffset = (glowSize - pixel.size) / 2;
                context.globalAlpha = (pixel.intensity * 0.15) / pass;
                context.fillStyle = color;
                context.fillRect(
                  pixel.x - glowOffset,
                  pixel.y - glowOffset,
                  glowSize,
                  glowSize,
                );
              }
            }

            context.globalAlpha = pixel.intensity * 0.9;
            context.fillStyle = color;

            if (variant === "trail") {
              context.beginPath();
              context.roundRect(
                pixel.x,
                pixel.y,
                pixel.size,
                pixel.size,
                pixel.size * 0.3,
              );
              context.fill();
            } else {
              context.fillRect(
                pixel.x,
                pixel.y,
                pixel.size,
                pixel.size,
              );
            }
          }
        }

        context.globalAlpha = 1;
      }

      animationRef.current = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(initializePixels);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });

    initializePixels();
    resizeObserver.observe(container);
    visibilityObserver.observe(container);

    if (!reduceMotion) {
      lastTimeRef.current = performance.now();
      animationRef.current = window.requestAnimationFrame(draw);
    }

    if (!noFocus && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onPointerLeave);
    }

    return () => {
      window.cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onPointerLeave);
    };
  }, [
    gap,
    speed,
    noFocus,
    variant,
    getColorFromIntensity,
  ]);

  const classes = ["pixel-canvas", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={classes} {...props}>
      <canvas ref={canvasRef} className="pixel-canvas__surface" />
    </div>
  );
}
