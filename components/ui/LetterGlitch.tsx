"use client";

import { useEffect, useRef } from "react";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type GlitchLetter = {
  char: string;
  color: Rgb;
  startColor: Rgb;
  targetColor: Rgb;
  colorProgress: number;
};

type LetterGlitchProps = {
  glitchColors?: readonly string[];
  className?: string;
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
};

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789";

function hexToRgb(hex: string): Rgb {
  const normalized = hex.trim().replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((character) => character + character).join("")
    : normalized;
  const value = Number.parseInt(expanded, 16);

  if (expanded.length !== 6 || Number.isNaN(value)) {
    return { r: 120, g: 146, b: 255 };
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function interpolateColor(start: Rgb, end: Rgb, progress: number) {
  return {
    r: Math.round(start.r + (end.r - start.r) * progress),
    g: Math.round(start.g + (end.g - start.g) * progress),
    b: Math.round(start.b + (end.b - start.b) * progress),
  };
}

export function LetterGlitch({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  className = "",
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = DEFAULT_CHARACTERS,
}: LetterGlitchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const symbols = Array.from(characters);
    const colors = glitchColors.length > 0
      ? glitchColors.map(hexToRgb)
      : [hexToRgb("#7892ff")];
    const fontSize = 16;
    const characterWidth = 10;
    const characterHeight = 20;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let letters: GlitchLetter[] = [];
    let columns = 0;
    let animationFrame: number | null = null;
    let lastFrame = performance.now();
    let lastGlitch = lastFrame;
    let isVisible = false;

    const randomCharacter = () => (
      symbols[Math.floor(Math.random() * symbols.length)] || "M"
    );
    const randomColor = () => (
      colors[Math.floor(Math.random() * colors.length)] || colors[0]
    );

    const drawLetters = () => {
      const bounds = canvas.getBoundingClientRect();
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.font = `${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      context.textBaseline = "top";

      letters.forEach((letter, index) => {
        const x = (index % columns) * characterWidth;
        const y = Math.floor(index / columns) * characterHeight;
        context.fillStyle =
          `rgb(${letter.color.r} ${letter.color.g} ${letter.color.b})`;
        context.fillText(letter.char, x, y);
      });
    };

    const initializeLetters = (width: number, height: number) => {
      columns = Math.max(1, Math.ceil(width / characterWidth));
      const rows = Math.max(1, Math.ceil(height / characterHeight));
      letters = Array.from({ length: columns * rows }, () => {
        const color = randomColor();
        return {
          char: randomCharacter(),
          color,
          startColor: color,
          targetColor: color,
          colorProgress: 1,
        };
      });
    };

    const resizeCanvas = () => {
      const bounds = container.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      canvas.style.width = `${bounds.width}px`;
      canvas.style.height = `${bounds.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      initializeLetters(bounds.width, bounds.height);
      drawLetters();
    };

    const updateLetters = () => {
      const updateCount = Math.max(1, Math.floor(letters.length * 0.05));
      for (let index = 0; index < updateCount; index += 1) {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        if (!letter) continue;

        letter.char = randomCharacter();
        letter.startColor = letter.color;
        letter.targetColor = randomColor();
        letter.colorProgress = smooth ? 0 : 1;
        if (!smooth) letter.color = letter.targetColor;
      }
    };

    const updateTransitions = (delta: number) => {
      let changed = false;
      letters.forEach((letter) => {
        if (letter.colorProgress >= 1) return;
        letter.colorProgress = Math.min(1, letter.colorProgress + delta / 260);
        letter.color = interpolateColor(
          letter.startColor,
          letter.targetColor,
          letter.colorProgress,
        );
        changed = true;
      });
      return changed;
    };

    const stopAnimation = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const animate = (timestamp: number) => {
      const delta = Math.min(timestamp - lastFrame, 50);
      lastFrame = timestamp;
      let shouldDraw = false;

      if (timestamp - lastGlitch >= Math.max(16, glitchSpeed)) {
        updateLetters();
        lastGlitch = timestamp;
        shouldDraw = true;
      }

      if (smooth && updateTransitions(delta)) shouldDraw = true;
      if (shouldDraw) drawLetters();

      animationFrame = isVisible && !reducedMotion.matches
        ? window.requestAnimationFrame(animate)
        : null;
    };

    const startAnimation = () => {
      if (
        animationFrame !== null
        || !isVisible
        || reducedMotion.matches
      ) {
        return;
      }
      lastFrame = performance.now();
      lastGlitch = lastFrame;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        if (isVisible) startAnimation();
        else stopAnimation();
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        stopAnimation();
        drawLetters();
      } else {
        startAnimation();
      }
    };

    resizeCanvas();
    resizeObserver.observe(container);
    visibilityObserver.observe(container);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, [characters, glitchColors, glitchSpeed, smooth]);

  return (
    <div
      ref={containerRef}
      className={`letter-glitch${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="letter-glitch__canvas" />
      {outerVignette && <div className="letter-glitch__outer-vignette" />}
      {centerVignette && <div className="letter-glitch__center-vignette" />}
    </div>
  );
}
