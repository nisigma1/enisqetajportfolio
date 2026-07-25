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
  useState,
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
  disableOnCoarsePointer?: boolean;
}

interface PointerPosition {
  x: number;
  y: number;
}

interface RepelLetterProps {
  character: string;
  className?: string;
  containerRef: RefObject<HTMLSpanElement | null>;
  pointer: MotionValue<PointerPosition>;
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

function clampToBounds(value: number, minimum: number, maximum: number) {
  if (minimum > maximum) return 0;
  return Math.max(minimum, Math.min(maximum, value));
}

function RepelLetter({
  character,
  className,
  containerRef,
  pointer,
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
  const minimumX = useMotionValue(0);
  const maximumX = useMotionValue(0);
  const minimumY = useMotionValue(0);
  const maximumY = useMotionValue(0);
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
    minimumX.set(containerRect.left - letterRect.left);
    maximumX.set(containerRect.right - letterRect.right);
    minimumY.set(containerRect.top - letterRect.top);
    maximumY.set(containerRect.bottom - letterRect.bottom);
  }, [
    containerRef,
    maximumX,
    maximumY,
    minimumX,
    minimumY,
    originX,
    originY,
  ]);

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

  const force = useTransform(
    [
      pointer,
      originX,
      originY,
      minimumX,
      maximumX,
      minimumY,
      maximumY,
      radiusValue,
      strengthValue,
      directionValue,
      enabledValue,
    ],
    ([
      pointerPosition,
      letterX,
      letterY,
      minX,
      maxX,
      minY,
      maxY,
      currentRadius,
      currentStrength,
      currentDirection,
      isEnabled,
    ]) => {
      if (!isEnabled) {
        return { x: 0, y: 0 };
      }

      const deltaX = letterX - pointerPosition.x;
      const deltaY = letterY - pointerPosition.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance === 0 || distance >= currentRadius) {
        return { x: 0, y: 0 };
      }

      const falloff = (1 - distance / currentRadius) ** 2;
      const nextX =
        (deltaX / distance) *
        falloff *
        currentStrength *
        currentDirection;
      const nextY =
        (deltaY / distance) *
        falloff *
        currentStrength *
        currentDirection;

      return {
        x: clampToBounds(nextX, minX, maxX),
        y: clampToBounds(nextY, minY, maxY),
      };
    },
  );

  const forceX = useTransform(force, (value) => value.x);
  const forceY = useTransform(force, (value) => value.y);

  const springConfig = { stiffness, damping, mass };
  const springX = useSpring(forceX, springConfig);
  const springY = useSpring(forceY, springConfig);
  const x = useTransform(
    [springX, minimumX, maximumX],
    ([value, min, max]) => clampToBounds(value, min, max),
  );
  const y = useTransform(
    [springY, minimumY, maximumY],
    ([value, min, max]) => clampToBounds(value, min, max),
  );
  const rotate = useTransform(x, (value) => value * 0.3);

  return (
    <span
      ref={letterRef}
      className="text-repel__letter"
      aria-hidden="true"
    >
      <motion.span
        className={joinClassNames("text-repel__glyph", className)}
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
  disableOnCoarsePointer = true,
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
  const pointer = useMotionValue<PointerPosition>({
    x: INACTIVE_POINTER,
    y: INACTIVE_POINTER,
  });
  const reducedMotion = useReducedMotion() ?? false;
  const instructionsId = useId();
  const keyboardPointer = useRef<{ x: number; y: number } | null>(null);
  const settleTimer = useRef<number>(0);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [active, setActive] = useState(false);
  const disabled =
    reducedMotion || (disableOnCoarsePointer && coarsePointer);
  const keyboardEnabled = keyboardInteractive && !disabled;

  const reset = useCallback(() => {
    const currentPointer = pointer.get();
    const isAlreadyReset =
      keyboardPointer.current === null &&
      currentPointer.x === INACTIVE_POINTER &&
      currentPointer.y === INACTIVE_POINTER;

    if (isAlreadyReset) {
      return;
    }

    keyboardPointer.current = null;
    pointer.set({ x: INACTIVE_POINTER, y: INACTIVE_POINTER });
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setActive(false), 650);
  }, [pointer]);

  useEffect(() => {
    if (disabled) {
      reset();
    }
  }, [disabled, reset]);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);

    return () => {
      window.clearTimeout(settleTimer.current);
      query.removeEventListener("change", update);
    };
  }, []);

  const setPointerFromClientPosition = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;

      if (!container || disabled) {
        return;
      }

      const bounds = container.getBoundingClientRect();
      window.clearTimeout(settleTimer.current);
      setActive(true);
      pointer.set({
        x: clientX - bounds.left,
        y: clientY - bounds.top,
      });
    },
    [disabled, pointer],
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

    if (
      !container ||
      !keyboardEnabled ||
      (!isArrowKey && !["Enter", " ", "Escape"].includes(event.key))
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
    window.clearTimeout(settleTimer.current);
    setActive(true);
    pointer.set(next);
    onKeyDown?.(event);
  };

  const tokens = text.split(/(\s+)/).filter(Boolean);

  return (
    <span
      ref={containerRef}
      className={joinClassNames("text-repel", className)}
      data-text-repel=""
      data-reduced-motion={reducedMotion ? "true" : undefined}
      data-active={active ? "true" : undefined}
      data-coarse-pointer={coarsePointer ? "true" : undefined}
      aria-label={keyboardEnabled ? text : undefined}
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
      {!keyboardEnabled ? (
        <span className="visually-hidden">{text}</span>
      ) : null}

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
                pointer={pointer}
                radius={radius}
                strength={strength}
                mode={mode}
                stiffness={stiffness}
                damping={damping}
                mass={mass}
                disabled={disabled}
              />
            ))}
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
