"use client";

import {
  type HTMLAttributes,
  useEffect,
  useMemo,
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
  /** Keep a slow ambient trail visible on coarse-pointer devices. */
  ambientOnTouch?: boolean;
  /** Cap canvas density for large decorative surfaces. */
  maxDpr?: number;
  /** Radius of the pointer field in CSS pixels. */
  radius?: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface ActivePixel {
  column: number;
  row: number;
  intensity: number;
  targetIntensity: number;
  colorPhase: number;
}

interface CanvasDimensions {
  width: number;
  height: number;
  columns: number;
  rows: number;
  dpr: number;
}

const DEFAULT_COLORS = ["#315df2", "#5f7cff", "#819cff", "#aab9f5"];
const INACTIVE_POINTER = -10_000;
const FRAME_DURATION = 1000 / 60;

function hexToRgb(hex: string): RgbColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1]!, 16),
        g: Number.parseInt(result[2]!, 16),
        b: Number.parseInt(result[3]!, 16),
      }
    : null;
}

function roundedPixel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  if (typeof context.roundRect === "function") {
    context.beginPath();
    context.roundRect(x, y, size, size, size * 0.3);
    context.fill();
    return;
  }

  context.fillRect(x, y, size, size);
}

function normalizedLerp(base: number, deltaTime: number) {
  const clampedBase = Math.max(0, Math.min(0.999, base));
  return 1 - Math.pow(1 - clampedBase, deltaTime / FRAME_DURATION);
}

export function PixelCanvas({
  className,
  gap = 6,
  speed = 0.02,
  colors = DEFAULT_COLORS,
  noFocus = false,
  variant = "default",
  ambientOnTouch = true,
  maxDpr = 2,
  radius,
  ...props
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activePixelsRef = useRef<Map<number, ActivePixel>>(new Map());
  const pointerRef = useRef({
    x: INACTIVE_POINTER,
    y: INACTIVE_POINTER,
    active: false,
  });
  const animationRef = useRef<number>(0);
  const resizeFrameRef = useRef<number>(0);
  const runningRef = useRef(false);
  const dimensionsRef = useRef<CanvasDimensions>({
    width: 1,
    height: 1,
    columns: 1,
    rows: 1,
    dpr: 1,
  });

  const palette = useMemo(() => {
    const parsed = colors.map(hexToRgb).filter((color): color is RgbColor =>
      Boolean(color),
    );
    return parsed.length > 0 ? parsed : [{ r: 255, g: 255, b: 255 }];
  }, [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!context) return;

    const pixelSize = Math.max(gap, 4);
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    let disposed = false;
    let isVisible = true;
    let reducedMotion = reducedMotionQuery.matches;
    let coarsePointer = coarsePointerQuery.matches;
    let lastTimestamp = performance.now();

    const resetPointer = () => {
      pointerRef.current = {
        x: INACTIVE_POINTER,
        y: INACTIVE_POINTER,
        active: false,
      };
    };

    const colorFor = (intensity: number, phase: number) => {
      if (palette.length === 1) {
        const color = palette[0]!;
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
      }

      const amount = (phase + intensity) % 1;
      const position = amount * (palette.length - 1);
      const index = Math.floor(position);
      const nextIndex = Math.min(index + 1, palette.length - 1);
      const localAmount = position - index;
      const start = palette[index]!;
      const end = palette[nextIndex]!;
      const r = Math.round(start.r + (end.r - start.r) * localAmount);
      const g = Math.round(start.g + (end.g - start.g) * localAmount);
      const b = Math.round(start.b + (end.b - start.b) * localAmount);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const drawStaticFrame = () => {
      const { width, height, columns, rows } = dimensionsRef.current;
      context.clearRect(0, 0, width, height);
      context.fillStyle = `rgba(${palette[0]!.r}, ${palette[0]!.g}, ${palette[0]!.b}, 0.1)`;

      const centerColumn = Math.floor(columns * 0.55);
      const centerRow = Math.floor(rows * 0.28);
      const radiusInCells = Math.max(4, Math.round(76 / pixelSize));

      for (
        let column = Math.max(0, centerColumn - radiusInCells);
        column <= Math.min(columns - 1, centerColumn + radiusInCells);
        column += 2
      ) {
        for (
          let row = Math.max(0, centerRow - radiusInCells);
          row <= Math.min(rows - 1, centerRow + radiusInCells);
          row += 2
        ) {
          const dx = column - centerColumn;
          const dy = row - centerRow;
          if (Math.hypot(dx, dy) > radiusInCells) continue;
          context.fillRect(
            column * pixelSize,
            row * pixelSize,
            Math.max(1, pixelSize - 1),
            Math.max(1, pixelSize - 1),
          );
        }
      }
    };

    const initializeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        Math.max(1, maxDpr),
      );
      const columns = Math.max(1, Math.ceil(width / pixelSize));
      const rows = Math.max(1, Math.ceil(height / pixelSize));
      const previous = dimensionsRef.current;

      if (
        previous.width === width &&
        previous.height === height &&
        previous.dpr === dpr &&
        previous.columns === columns &&
        previous.rows === rows
      ) {
        return;
      }

      dimensionsRef.current = { width, height, columns, rows, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      activePixelsRef.current.clear();

      if (reducedMotion || (coarsePointer && !ambientOnTouch)) {
        drawStaticFrame();
      }
    };

    const scheduleResize = () => {
      window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(() => {
        initializeCanvas();
        scheduleDraw();
      });
    };

    const renderPixel = (
      pixel: ActivePixel,
      intensity: number,
      color: string,
    ) => {
      const x = pixel.column * pixelSize;
      const y = pixel.row * pixelSize;
      const size = Math.max(1, pixelSize - 1);

      if (variant === "glow" && intensity > 0.2) {
        for (let pass = 2; pass > 0; pass -= 1) {
          const glowSize = size + pass * 4;
          const glowOffset = (glowSize - size) / 2;
          context.globalAlpha = (intensity * 0.12) / pass;
          context.fillStyle = color;
          context.fillRect(
            x - glowOffset,
            y - glowOffset,
            glowSize,
            glowSize,
          );
        }
      }

      context.globalAlpha = intensity * 0.78;
      context.fillStyle = color;

      if (variant === "trail") {
        roundedPixel(context, x, y, size);
      } else {
        context.fillRect(x, y, size, size);
      }
    };

    const draw = (timestamp: number) => {
      runningRef.current = false;
      if (disposed || !isVisible || document.visibilityState === "hidden") {
        return;
      }

      const deltaTime = Math.max(
        1,
        Math.min(timestamp - lastTimestamp, FRAME_DURATION * 4),
      );
      lastTimestamp = timestamp;

      const { width, height, columns, rows } = dimensionsRef.current;
      context.clearRect(0, 0, width, height);

      let pointerX = pointerRef.current.x;
      let pointerY = pointerRef.current.y;
      const ambient =
        coarsePointer &&
        ambientOnTouch &&
        !noFocus &&
        !pointerRef.current.active;

      if (ambient) {
        const visibleHeight = Math.min(
          height,
          window.visualViewport?.height ?? window.innerHeight,
        );
        pointerX = width * (0.5 + Math.sin(timestamp * 0.00042) * 0.34);
        pointerY =
          visibleHeight * (0.31 + Math.cos(timestamp * 0.00031) * 0.13);
      }

      const hasPointer = pointerRef.current.active || ambient;
      const activeRadius =
        radius ?? (variant === "glow" ? 116 : coarsePointer ? 96 : 82);
      const activePixels = activePixelsRef.current;

      for (const pixel of activePixels.values()) {
        pixel.targetIntensity = 0;
      }

      if (hasPointer) {
        const minimumColumn = Math.max(
          0,
          Math.floor((pointerX - activeRadius) / pixelSize),
        );
        const maximumColumn = Math.min(
          columns - 1,
          Math.ceil((pointerX + activeRadius) / pixelSize),
        );
        const minimumRow = Math.max(
          0,
          Math.floor((pointerY - activeRadius) / pixelSize),
        );
        const maximumRow = Math.min(
          rows - 1,
          Math.ceil((pointerY + activeRadius) / pixelSize),
        );

        for (
          let column = minimumColumn;
          column <= maximumColumn;
          column += 1
        ) {
          for (let row = minimumRow; row <= maximumRow; row += 1) {
            const centerX = column * pixelSize + pixelSize / 2;
            const centerY = row * pixelSize + pixelSize / 2;
            const distance = Math.hypot(
              pointerX - centerX,
              pointerY - centerY,
            );
            if (distance >= activeRadius) continue;

            const key = column * rows + row;
            const pixel = activePixels.get(key) ?? {
              column,
              row,
              intensity: 0,
              targetIntensity: 0,
              colorPhase:
                ((column * 37 + row * 17) % 101) / 101,
            };
            pixel.targetIntensity = Math.pow(
              1 - distance / activeRadius,
              1.35,
            );
            activePixels.set(key, pixel);
          }
        }
      }

      const attack = normalizedLerp(0.3, deltaTime);
      const decay = normalizedLerp(speed, deltaTime);

      for (const [key, pixel] of activePixels) {
        const interpolation =
          pixel.targetIntensity > pixel.intensity ? attack : decay;
        pixel.intensity +=
          (pixel.targetIntensity - pixel.intensity) * interpolation;
        pixel.colorPhase =
          (pixel.colorPhase + 0.001 * (deltaTime / FRAME_DURATION)) % 1;

        if (pixel.intensity <= 0.008 && pixel.targetIntensity === 0) {
          activePixels.delete(key);
          continue;
        }

        renderPixel(
          pixel,
          pixel.intensity,
          colorFor(pixel.intensity, pixel.colorPhase),
        );
      }

      context.globalAlpha = 1;

      if (hasPointer || activePixels.size > 0) {
        scheduleDraw();
      } else if (coarsePointer && !ambientOnTouch) {
        drawStaticFrame();
      }
    };

    function scheduleDraw() {
      if (
        disposed ||
        reducedMotion ||
        !isVisible ||
        document.visibilityState === "hidden" ||
        runningRef.current
      ) {
        return;
      }

      runningRef.current = true;
      animationRef.current = window.requestAnimationFrame(draw);
    }

    const updatePointer = (clientX: number, clientY: number) => {
      if (noFocus || reducedMotion || !isVisible) return;
      const rect = container.getBoundingClientRect();
      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      pointerRef.current = isInside
        ? {
            x: clientX - rect.left,
            y: clientY - rect.top,
            active: true,
          }
        : {
            x: INACTIVE_POINTER,
            y: INACTIVE_POINTER,
            active: false,
          };
      scheduleDraw();
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        resetPointer();
      }
      scheduleDraw();
    };

    const onWindowBlur = () => {
      resetPointer();
      scheduleDraw();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.cancelAnimationFrame(animationRef.current);
        runningRef.current = false;
      } else {
        lastTimestamp = performance.now();
        scheduleDraw();
      }
    };

    const onReducedMotionChange = (
      event: MediaQueryListEvent,
    ) => {
      reducedMotion = event.matches;
      resetPointer();
      activePixelsRef.current.clear();
      window.cancelAnimationFrame(animationRef.current);
      runningRef.current = false;

      if (reducedMotion) {
        drawStaticFrame();
      } else {
        context.clearRect(
          0,
          0,
          dimensionsRef.current.width,
          dimensionsRef.current.height,
        );
        lastTimestamp = performance.now();
        scheduleDraw();
      }
    };

    const onCoarsePointerChange = (event: MediaQueryListEvent) => {
      coarsePointer = event.matches;
      resetPointer();
      scheduleDraw();
    };

    const resizeObserver = new ResizeObserver(scheduleResize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;

      if (!isVisible) {
        window.cancelAnimationFrame(animationRef.current);
        runningRef.current = false;
      } else {
        lastTimestamp = performance.now();
        scheduleDraw();
      }
    });

    initializeCanvas();
    resizeObserver.observe(container);
    visibilityObserver.observe(container);

    if (!noFocus) {
      window.addEventListener("pointerdown", onPointerMove, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerEnd, { passive: true });
      window.addEventListener("pointercancel", onPointerEnd, {
        passive: true,
      });
      window.addEventListener("blur", onWindowBlur);
    }

    window.addEventListener("resize", scheduleResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    coarsePointerQuery.addEventListener("change", onCoarsePointerChange);

    if (reducedMotion) {
      drawStaticFrame();
    } else if (coarsePointer && ambientOnTouch && !noFocus) {
      scheduleDraw();
    } else if (coarsePointer && !ambientOnTouch) {
      drawStaticFrame();
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationRef.current);
      window.cancelAnimationFrame(resizeFrameRef.current);
      runningRef.current = false;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("resize", scheduleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener(
        "change",
        onReducedMotionChange,
      );
      coarsePointerQuery.removeEventListener(
        "change",
        onCoarsePointerChange,
      );
    };
  }, [
    ambientOnTouch,
    gap,
    noFocus,
    maxDpr,
    palette,
    radius,
    speed,
    variant,
  ]);

  const classes = ["pixel-canvas", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={classes} {...props}>
      <canvas ref={canvasRef} className="pixel-canvas__surface" />
    </div>
  );
}
