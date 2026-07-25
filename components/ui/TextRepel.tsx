"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
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
}

interface RepelLetterProps {
  character: string;
  className?: string;
  containerRef: RefObject<HTMLSpanElement | null>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  radius: number;
  strength: number;
  mode: TextRepelMode;
  stiffness: number;
  damping: number;
  mass: number;
  disabled: boolean;
}

const INACTIVE_POINTER = -10_000;

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function RepelLetter({
  character,
  className,
  containerRef,
  pointerX,
  pointerY,
  radius,
  strength,
  mode,
  stiffness,
  damping,
  mass,
  disabled,
}: RepelLetterProps) {
  const letterRef = useRef<HTMLSpanElement>(null);
  const originX = useMotionValue(0);
  const originY = useMotionValue(0);
  const radiusValue = useMotionValue(radius);
  const strengthValue = useMotionValue(strength);
  const directionValue = useMotionValue(mode === "repel" ? 1 : -1);
  const enabledValue = useMotionValue(disabled ? 0 : 1);

  useEffect(() => {
    radiusValue.set(radius);
    strengthValue.set(strength);
    directionValue.set(mode === "repel" ? 1 : -1);
    enabledValue.set(disabled ? 0 : 1);
  }, [
    directionValue,
    disabled,
    enabledValue,
    mode,
    radius,
    radiusValue,
    strength,
    strengthValue,
  ]);

  const measureOrigin = useCallback(() => {
    const letter = letterRef.current;
    const container = containerRef.current;

    if (!letter || !container) {
      return;
    }

    const letterRect = letter.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const nextOriginX =
      letterRect.left - containerRect.left + letterRect.width / 2;
    const nextOriginY =
      letterRect.top - containerRect.top + letterRect.height / 2;

    originX.set(nextOriginX);
    originY.set(nextOriginY);
  }, [containerRef, originX, originY]);

  useEffect(() => {
    measureOrigin();

    const container = containerRef.current;
    const letter = letterRef.current;

    if (!container || !letter) {
      return;
    }

    const observer = new ResizeObserver(measureOrigin);
    observer.observe(container);
    observer.observe(letter);

    window.addEventListener("resize", measureOrigin, { passive: true });
    document.fonts?.ready.then(measureOrigin).catch(() => undefined);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureOrigin);
    };
  }, [containerRef, measureOrigin]);

  const forceX = useTransform(
    [
      pointerX,
      pointerY,
      originX,
      originY,
      radiusValue,
      strengthValue,
      directionValue,
      enabledValue,
    ],
    ([
      x,
      y,
      letterX,
      letterY,
      currentRadius,
      currentStrength,
      currentDirection,
      isEnabled,
    ]) => {
      if (!isEnabled) {
        return 0;
      }

      const deltaX = letterX - x;
      const deltaY = letterY - y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance === 0 || distance >= currentRadius) {
        return 0;
      }

      const falloff = (1 - distance / currentRadius) ** 2;

      return (
        (deltaX / distance) *
        falloff *
        currentStrength *
        currentDirection
      );
    },
  );

  const forceY = useTransform(
    [
      pointerX,
      pointerY,
      originX,
      originY,
      radiusValue,
      strengthValue,
      directionValue,
      enabledValue,
    ],
    ([
      x,
      y,
      letterX,
      letterY,
      currentRadius,
      currentStrength,
      currentDirection,
      isEnabled,
    ]) => {
      if (!isEnabled) {
        return 0;
      }

      const deltaX = letterX - x;
      const deltaY = letterY - y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance === 0 || distance >= currentRadius) {
        return 0;
      }

      const falloff = (1 - distance / currentRadius) ** 2;

      return (
        (deltaY / distance) *
        falloff *
        currentStrength *
        currentDirection
      );
    },
  );

  const springConfig = { stiffness, damping, mass };
  const x = useSpring(forceX, springConfig);
  const y = useSpring(forceY, springConfig);
  const rotate = useTransform(x, (value) => value * 0.3);

  return (
    <span
      ref={letterRef}
      className={joinClassNames("text-repel__letter", className)}
      aria-hidden="true"
    >
      <motion.span
        className="text-repel__glyph"
        style={{ x, y, rotate }}
      >
        {character}
      </motion.span>
    </span>
  );
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
  const pointerX = useMotionValue(INACTIVE_POINTER);
  const pointerY = useMotionValue(INACTIVE_POINTER);
  const reducedMotion = useReducedMotion() ?? false;
  const instructionsId = useId();
  const keyboardPointer = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    const isAlreadyReset =
      keyboardPointer.current === null &&
      pointerX.get() === INACTIVE_POINTER &&
      pointerY.get() === INACTIVE_POINTER;

    if (isAlreadyReset) {
      return;
    }

    keyboardPointer.current = null;
    pointerX.set(INACTIVE_POINTER);
    pointerY.set(INACTIVE_POINTER);
  }, [pointerX, pointerY]);

  useEffect(() => {
    if (reducedMotion) {
      reset();
    }
  }, [reducedMotion, reset]);

  const setPointerFromClientPosition = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;

      if (!container || reducedMotion) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      pointerX.set(clientX - bounds.left);
      pointerY.set(clientY - bounds.top);
    },
    [pointerX, pointerY, reducedMotion],
  );

  useEffect(() => {
    const handleWindowPointerMove = (event: PointerEvent) => {
      const container = containerRef.current;

      if (container && !event.composedPath().includes(container)) {
        reset();
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
    };
  }, [reset]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    setPointerFromClientPosition(event.clientX, event.clientY);
    onPointerDown?.(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    setPointerFromClientPosition(event.clientX, event.clientY);
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLSpanElement>) => {
    reset();
    onPointerLeave?.(event);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLSpanElement>) => {
    reset();
    onPointerCancel?.(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") {
      reset();
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

    if (!container || reducedMotion || (!isArrowKey && !["Enter", " ", "Escape"].includes(event.key))) {
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
    pointerX.set(next.x);
    pointerY.set(next.y);
    onKeyDown?.(event);
  };

  const tokens = text.split(/(\s+)/).filter(Boolean);

  return (
    <span
      ref={containerRef}
      className={joinClassNames("text-repel", className)}
      data-text-repel=""
      data-reduced-motion={reducedMotion ? "true" : undefined}
      aria-label={text}
      aria-describedby={keyboardInteractive ? instructionsId : undefined}
      tabIndex={keyboardInteractive ? (tabIndex ?? 0) : tabIndex}
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
            {Array.from(token).map((character, characterIndex) => (
              <RepelLetter
                key={`${character}-${characterIndex}`}
                character={character}
                className={letterClassName}
                containerRef={containerRef}
                pointerX={pointerX}
                pointerY={pointerY}
                radius={radius}
                strength={strength}
                mode={mode}
                stiffness={stiffness}
                damping={damping}
                mass={mass}
                disabled={reducedMotion}
              />
            ))}
          </span>
        ),
      )}

      {keyboardInteractive ? (
        <span id={instructionsId} className="visually-hidden">
          Use the arrow keys to move the repulsion point. Press Escape to reset.
        </span>
      ) : null}
    </span>
  );
}
