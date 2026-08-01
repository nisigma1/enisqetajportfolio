"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type TextRepelMode = "repel" | "attract";

interface TextRepelProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string;
  letterClassName?: string;
  radius?: number;
  strength?: number;
  mode?: TextRepelMode;
  stiffness?: number;
  damping?: number;
  mass?: number;
  keyboardInteractive?: boolean;
  disableOnCoarsePointer?: boolean;
}

type Point = {
  x: number;
  y: number;
};

type LetterPhysics = {
  originX: number;
  originY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  targetX: number;
  targetY: number;
};

const EMPTY_LETTER: LetterPhysics = {
  originX: 0,
  originY: 0,
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  targetX: 0,
  targetY: 0,
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function clampToBounds(value: number, minimum: number, maximum: number) {
  if (minimum > maximum) return 0;
  return Math.max(minimum, Math.min(maximum, value));
}

export function TextRepel({
  text,
  className,
  letterClassName,
  radius = 120,
  strength = 45,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
  keyboardInteractive = true,
  disableOnCoarsePointer = false,
  tabIndex,
  onPointerDown,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  onPointerUp,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: TextRepelProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const physicsRef = useRef<LetterPhysics[]>([]);
  const animationRef = useRef(0);
  const animationStepRef = useRef<(timestamp: number) => void>(() => undefined);
  const resizeRef = useRef(0);
  const settleTimer = useRef(0);
  const keyboardPointer = useRef<Point | null>(null);
  const reducedMotionRef = useRef(false);
  const disabledRef = useRef(false);
  const runningRef = useRef(false);
  const lastFrameRef = useRef(0);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(false);
  const instructionsId = useId();
  const disabled =
    reducedMotion || (disableOnCoarsePointer && coarsePointer);
  const keyboardEnabled = keyboardInteractive && !disabled;

  const paint = useCallback(() => {
    physicsRef.current.forEach((letter, index) => {
      const glyph = glyphRefs.current[index];
      if (!glyph) return;
      glyph.style.transform =
        `translate3d(${letter.x.toFixed(2)}px, ${letter.y.toFixed(2)}px, 0) `
        + `rotate(${(letter.x * 0.3).toFixed(2)}deg)`;
    });
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    glyphRefs.current.forEach((glyph) => {
      if (glyph) glyph.style.transform = "none";
    });

    const containerRect = container.getBoundingClientRect();
    physicsRef.current = glyphRefs.current.map((glyph) => {
      if (!glyph) return { ...EMPTY_LETTER };
      const rect = glyph.getBoundingClientRect();
      return {
        ...EMPTY_LETTER,
        originX: rect.left - containerRect.left + rect.width / 2,
        originY: rect.top - containerRect.top + rect.height / 2,
        minX: containerRect.left - rect.left,
        maxX: containerRect.right - rect.right,
        minY: containerRect.top - rect.top,
        maxY: containerRect.bottom - rect.bottom,
      };
    });
    paint();
  }, [paint]);

  const animate = useCallback((timestamp: number) => {
    if (reducedMotionRef.current) {
      runningRef.current = false;
      return;
    }

    const elapsed = lastFrameRef.current
      ? Math.min(32, timestamp - lastFrameRef.current)
      : 16.67;
    const delta = elapsed / 1000;
    lastFrameRef.current = timestamp;
    let moving = false;

    physicsRef.current.forEach((letter) => {
      const accelerationX =
        (-stiffness * (letter.x - letter.targetX)
          - damping * letter.velocityX) / Math.max(0.1, mass);
      const accelerationY =
        (-stiffness * (letter.y - letter.targetY)
          - damping * letter.velocityY) / Math.max(0.1, mass);

      letter.velocityX += accelerationX * delta;
      letter.velocityY += accelerationY * delta;
      letter.x += letter.velocityX * delta;
      letter.y += letter.velocityY * delta;

      const settled =
        Math.abs(letter.x - letter.targetX) < 0.08
        && Math.abs(letter.y - letter.targetY) < 0.08
        && Math.abs(letter.velocityX) < 0.08
        && Math.abs(letter.velocityY) < 0.08;

      if (settled) {
        letter.x = letter.targetX;
        letter.y = letter.targetY;
        letter.velocityX = 0;
        letter.velocityY = 0;
      } else {
        moving = true;
      }
    });

    paint();
    if (moving) {
      animationRef.current = window.requestAnimationFrame(
        animationStepRef.current,
      );
    } else {
      runningRef.current = false;
      lastFrameRef.current = 0;
      setActive(false);
    }
  }, [damping, mass, paint, stiffness]);

  const scheduleAnimation = useCallback(() => {
    if (runningRef.current || reducedMotionRef.current) return;
    runningRef.current = true;
    lastFrameRef.current = 0;
    animationRef.current = window.requestAnimationFrame(
      animationStepRef.current,
    );
  }, []);

  const setTargets = useCallback((point: Point | null) => {
    const direction = mode === "repel" ? 1 : -1;

    physicsRef.current.forEach((letter) => {
      if (!point || disabledRef.current) {
        letter.targetX = 0;
        letter.targetY = 0;
        return;
      }

      const deltaX = letter.originX - point.x;
      const deltaY = letter.originY - point.y;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance === 0 || distance >= radius) {
        letter.targetX = 0;
        letter.targetY = 0;
        return;
      }

      const falloff = (1 - distance / radius) ** 2;
      const force = falloff * strength * direction;
      letter.targetX = clampToBounds(
        (deltaX / distance) * force,
        letter.minX,
        letter.maxX,
      );
      letter.targetY = clampToBounds(
        (deltaY / distance) * force,
        letter.minY,
        letter.maxY,
      );
    });

    if (point) setActive(true);
    scheduleAnimation();
  }, [mode, radius, scheduleAnimation, strength]);

  const reset = useCallback(() => {
    keyboardPointer.current = null;
    window.clearTimeout(settleTimer.current);
    setTargets(null);
  }, [setTargets]);

  const setPointerFromClientPosition = useCallback((
    clientX: number,
    clientY: number,
  ) => {
    const container = containerRef.current;
    if (!container || disabledRef.current) return;
    const bounds = container.getBoundingClientRect();
    window.clearTimeout(settleTimer.current);
    setTargets({
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    });
  }, [setTargets]);

  useEffect(() => {
    animationStepRef.current = animate;
  }, [animate]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    disabledRef.current = disabled;

    if (disabled) {
      physicsRef.current.forEach((letter) => {
        letter.x = 0;
        letter.y = 0;
        letter.velocityX = 0;
        letter.velocityY = 0;
        letter.targetX = 0;
        letter.targetY = 0;
      });
      window.cancelAnimationFrame(animationRef.current);
      runningRef.current = false;
      paint();
    }
  }, [disabled, paint, reducedMotion]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const updatePreferences = () => {
      setReducedMotion(reducedMotionQuery.matches);
      setCoarsePointer(coarsePointerQuery.matches);
    };

    const initiallyDisabled =
      reducedMotionQuery.matches
      || (disableOnCoarsePointer && coarsePointerQuery.matches);

    updatePreferences();
    reducedMotionQuery.addEventListener("change", updatePreferences);
    coarsePointerQuery.addEventListener("change", updatePreferences);

    // The mobile hero keeps the same server-rendered typography, but does not
    // measure every glyph or allocate observers for a pointer interaction that
    // touch-first devices cannot use.
    if (initiallyDisabled) {
      return () => {
        reducedMotionQuery.removeEventListener("change", updatePreferences);
        coarsePointerQuery.removeEventListener("change", updatePreferences);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeRef.current);
      resizeRef.current = window.requestAnimationFrame(measure);
    });

    measure();
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", updatePreferences);
      coarsePointerQuery.removeEventListener("change", updatePreferences);
      window.cancelAnimationFrame(animationRef.current);
      window.cancelAnimationFrame(resizeRef.current);
      window.clearTimeout(settleTimer.current);
    };
  }, [disableOnCoarsePointer, measure]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    setPointerFromClientPosition(event.clientX, event.clientY);
    onPointerDown?.(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    setPointerFromClientPosition(event.clientX, event.clientY);
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "mouse") reset();
    onPointerLeave?.(event);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLSpanElement>) => {
    reset();
    onPointerCancel?.(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(reset, 520);
    }
    onPointerUp?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    keyboardPointer.current = null;
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    reset();
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const container = containerRef.current;
    const isArrowKey = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ].includes(event.key);

    if (
      !container
      || !keyboardEnabled
      || (!isArrowKey && !["Enter", " ", "Escape"].includes(event.key))
    ) {
      onKeyDown?.(event);
      return;
    }

    event.preventDefault();
    if (event.key === "Escape") {
      reset();
      onKeyDown?.(event);
      return;
    }

    const bounds = container.getBoundingClientRect();
    const current = keyboardPointer.current ?? {
      x: bounds.width / 2,
      y: bounds.height / 2,
    };
    const step = Math.max(20, Math.min(40, bounds.width * 0.035));
    const next = { ...current };

    if (event.key === "ArrowLeft") next.x -= step;
    if (event.key === "ArrowRight") next.x += step;
    if (event.key === "ArrowUp") next.y -= step;
    if (event.key === "ArrowDown") next.y += step;
    if (event.key === "Enter" || event.key === " ") {
      next.x = bounds.width / 2;
      next.y = bounds.height / 2;
    }

    next.x = Math.max(0, Math.min(bounds.width, next.x));
    next.y = Math.max(0, Math.min(bounds.height, next.y));
    keyboardPointer.current = next;
    setTargets(next);
    onKeyDown?.(event);
  };

  const tokens = text.split(/(\s+)/).filter(Boolean);
  let letterIndex = 0;

  return (
    <span
      ref={containerRef}
      className={joinClassNames("text-repel", className)}
      data-text-repel=""
      data-reduced-motion={reducedMotion ? "true" : undefined}
      data-active={active ? "true" : undefined}
      data-coarse-pointer={coarsePointer ? "true" : undefined}
      aria-label={text}
      aria-describedby={keyboardEnabled ? instructionsId : undefined}
      tabIndex={
        keyboardEnabled
          ? (tabIndex ?? 0)
          : keyboardInteractive
            ? -1
            : tabIndex
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onPointerUp={handlePointerUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {tokens.map((token, tokenIndex) =>
        /^\s+$/.test(token) ? (
          <span
            key={`space-${tokenIndex}`}
            className="text-repel__space"
            aria-hidden="true"
          >
            {" "}
          </span>
        ) : (
          <span
            key={`${token}-${tokenIndex}`}
            className="text-repel__word"
            aria-hidden="true"
          >
            {Array.from(token).map((character, characterIndex) => {
              const index = letterIndex;
              letterIndex += 1;
              return (
                <span key={`${character}-${characterIndex}`} className="text-repel__letter">
                  <span
                    ref={(element) => {
                      glyphRefs.current[index] = element;
                    }}
                    className={joinClassNames("text-repel__glyph", letterClassName)}
                  >
                    {character}
                  </span>
                </span>
              );
            })}
          </span>
        ),
      )}

      {keyboardEnabled ? (
        <span id={instructionsId} className="visually-hidden">
          Use the arrow keys to move the repulsion point. Press Escape to reset.
        </span>
      ) : null}
    </span>
  );
}
