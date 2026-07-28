"use client";

import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

type Spark = {
  x: number;
  y: number;
  angle: number;
  startTime: number;
};

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children: ReactNode;
};

export function ClickSpark({
  sparkColor = "#7892ff",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const drawFrameRef = useRef<(timestamp: number) => void>(() => undefined);
  const resizeCanvasRef = useRef<() => void>(() => undefined);
  const canvasReadyRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const ease = useCallback((progress: number) => {
    switch (easing) {
      case "linear":
        return progress;
      case "ease-in":
        return progress * progress;
      case "ease-in-out":
        return progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      default:
        return progress * (2 - progress);
    }
  }, [easing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || reducedMotionRef.current) {
      sparksRef.current = [];
      animationFrameRef.current = null;
      clearCanvas();
      return;
    }

    clearCanvas();
    context.strokeStyle = sparkColor;
    context.lineWidth = 1.75;
    context.lineCap = "round";

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = Math.max(0, elapsed / duration);
      const eased = ease(progress);
      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);
      const cosine = Math.cos(spark.angle);
      const sine = Math.sin(spark.angle);

      context.globalAlpha = 1 - progress;
      context.beginPath();
      context.moveTo(
        spark.x + distance * cosine,
        spark.y + distance * sine,
      );
      context.lineTo(
        spark.x + (distance + lineLength) * cosine,
        spark.y + (distance + lineLength) * sine,
      );
      context.stroke();
      return true;
    });

    context.globalAlpha = 1;
    if (sparksRef.current.length > 0) {
      animationFrameRef.current = window.requestAnimationFrame(
        drawFrameRef.current,
      );
    } else {
      animationFrameRef.current = null;
      clearCanvas();
    }
  }, [
    clearCanvas,
    duration,
    ease,
    extraScale,
    sparkColor,
    sparkRadius,
    sparkSize,
  ]);

  useEffect(() => {
    drawFrameRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      if (!canvasReadyRef.current) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resizeCanvasRef.current = resizeCanvas;
    if (canvasReadyRef.current) resizeCanvas();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      if (!mediaQuery.matches) return;

      sparksRef.current = [];
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      clearCanvas();
    };

    updateMotionPreference();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.visualViewport?.addEventListener("resize", resizeCanvas, {
      passive: true,
    });
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.visualViewport?.removeEventListener("resize", resizeCanvas);
      mediaQuery.removeEventListener("change", updateMotionPreference);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      resizeCanvasRef.current = () => undefined;
    };
  }, [clearCanvas]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return;

    if (!canvasReadyRef.current) {
      canvasReadyRef.current = true;
      resizeCanvasRef.current();
    }

    let x = event.clientX;
    let y = event.clientY;

    // Keyboard-triggered button and link clicks report no pointer position.
    // Use the control's center so the interaction remains coherent.
    if (event.detail === 0 && event.target instanceof Element) {
      const targetRect = event.target.getBoundingClientRect();
      x = targetRect.left + targetRect.width / 2;
      y = targetRect.top + targetRect.height / 2;
    }

    const count = Math.max(1, Math.floor(sparkCount));
    const startTime = performance.now();
    const newSparks = Array.from({ length: count }, (_, index) => ({
      x,
      y,
      angle: (2 * Math.PI * index) / count,
      startTime,
    }));

    sparksRef.current = [...sparksRef.current, ...newSparks].slice(-160);
    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame(
        drawFrameRef.current,
      );
    }
  };

  return (
    <div className="click-spark" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="click-spark__canvas"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
