"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { MosaicTransitionOverlay } from "@/components/transition/MosaicTransitionOverlay";
import { RouteTransitionContext } from "@/components/transition/RouteTransitionContext";
import { ClickSpark } from "@/components/ui/ClickSpark";
import {
  canAdvanceTransition,
  type TransitionPhase,
} from "@/lib/route-transition.mjs";

type TransitionState = {
  phase: TransitionPhase;
  requestId: number;
  targetHref: string | null;
  targetPathname: string | null;
  origin: { x: number; y: number } | null;
  theme: "light" | "dark";
};

type TransitionAction =
  | {
    type: "prepare";
    requestId: number;
    targetHref: string;
    targetPathname: string;
    origin: { x: number; y: number };
    theme: "light" | "dark";
  }
  | { type: "advance"; requestId: number; phase: TransitionPhase }
  | { type: "reset"; requestId: number };

const initialState: TransitionState = {
  phase: "idle",
  requestId: 0,
  targetHref: null,
  targetPathname: null,
  origin: null,
  theme: "light",
};

function transitionReducer(
  state: TransitionState,
  action: TransitionAction,
): TransitionState {
  if (action.type === "prepare") {
    if (state.phase !== "idle") return state;
    return {
      phase: "preparing",
      requestId: action.requestId,
      targetHref: action.targetHref,
      targetPathname: action.targetPathname,
      origin: action.origin,
      theme: action.theme,
    };
  }

  if (action.requestId !== state.requestId) return state;

  if (action.type === "reset") {
    if (!canAdvanceTransition(state.phase, "idle")) return state;
    return { ...initialState, requestId: state.requestId };
  }

  if (!canAdvanceTransition(state.phase, action.phase)) return state;
  return { ...state, phase: action.phase };
}

function focusDestination(targetHref: string | null) {
  const hash = targetHref ? new URL(targetHref, window.location.href).hash : "";
  const main = document.querySelector<HTMLElement>("main");
  if (!main) return;

  main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
  main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });

  if (hash) {
    const target = document.querySelector<HTMLElement>(hash);
    target?.scrollIntoView({ block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(transitionReducer, initialState);
  const stateRef = useRef(state);
  const requestSequence = useRef(0);
  const navigationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathname = useRef(pathname);
  const reducedTarget = useRef<string | null>(null);

  // Browsers are allowed to restore the previous scroll position when a
  // visitor reopens the portfolio. That made the Index route land halfway
  // down at Markets. Own restoration so a clean Index load always starts at
  // the masthead, while deep links with a hash still resolve normally.
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";

    const resetEntryScroll = () => {
      if (window.location.hash) return;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    resetEntryScroll();
    let frame = window.requestAnimationFrame(() => {
      resetEntryScroll();
      frame = window.requestAnimationFrame(resetEntryScroll);
    });
    const timeout = window.setTimeout(resetEntryScroll, 140);
    window.addEventListener("pageshow", resetEntryScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("pageshow", resetEntryScroll);
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const finish = useCallback((requestId: number, moveFocus: boolean) => {
    const current = stateRef.current;
    if (current.requestId !== requestId) return;
    if (moveFocus) focusDestination(current.targetHref);
    document.querySelectorAll("[data-transition-pending]").forEach((element) => {
      element.removeAttribute("data-transition-pending");
    });
    document.documentElement.removeAttribute("data-route-transition");
    dispatch({ type: "reset", requestId });
  }, []);

  const recover = useCallback((requestId: number) => {
    const current = stateRef.current;
    if (current.requestId !== requestId || current.phase === "idle") return;
    dispatch({ type: "advance", requestId, phase: "recovering" });
  }, []);

  const navigateWithTransition = useCallback(
    (href: string, origin: { x: number; y: number }) => {
      if (stateRef.current.phase !== "idle") return false;

      const destination = new URL(href, window.location.href);
      const requestId = ++requestSequence.current;
      const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const target = `${destination.pathname}${destination.search}${destination.hash}`;
        reducedTarget.current = target;
        router.push(target);
        return true;
      }

      document.documentElement.setAttribute("data-route-transition", "active");
      stateRef.current = {
        phase: "preparing",
        requestId,
        targetHref: `${destination.pathname}${destination.search}${destination.hash}`,
        targetPathname: destination.pathname,
        origin,
        theme,
      };
      dispatch({
        type: "prepare",
        requestId,
        targetHref: `${destination.pathname}${destination.search}${destination.hash}`,
        targetPathname: destination.pathname,
        origin,
        theme,
      });

      window.requestAnimationFrame(() => {
        dispatch({ type: "advance", requestId, phase: "covering" });
      });
      return true;
    },
    [router],
  );

  const onCovered = useCallback((requestId: number) => {
    const current = stateRef.current;
    if (current.requestId !== requestId || current.phase !== "covering") return;

    dispatch({ type: "advance", requestId, phase: "covered" });
    window.requestAnimationFrame(() => {
      const next = stateRef.current;
      if (next.requestId !== requestId || !next.targetHref) return;
      dispatch({ type: "advance", requestId, phase: "navigating" });
      try {
        router.push(next.targetHref);
      } catch {
        window.location.assign(next.targetHref);
      }
    });
  }, [router]);

  const onRevealComplete = useCallback((requestId: number) => {
    const current = stateRef.current;
    if (current.requestId !== requestId) return;
    finish(requestId, current.phase === "revealing");
  }, [finish]);

  useEffect(() => {
    if (
      state.phase !== "navigating"
      || !state.targetPathname
      || pathname !== state.targetPathname
    ) {
      return;
    }

    const requestId = state.requestId;
    let cancelled = false;
    let frame = 0;

    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        if (cancelled || !document.querySelector("main")) return;
        dispatch({ type: "advance", requestId, phase: "revealing" });
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, state.phase, state.requestId, state.targetPathname]);

  useEffect(() => {
    if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
    if (state.phase === "idle") return;

    const requestId = state.requestId;
    navigationTimeout.current = setTimeout(() => {
      const current = stateRef.current;
      if (current.requestId !== requestId || current.phase === "idle") return;

      if (
        (current.phase === "covered" || current.phase === "navigating")
        && current.targetHref
      ) {
        window.location.assign(current.targetHref);
        setTimeout(() => recover(requestId), 1200);
        return;
      }
      recover(requestId);
    }, 5000);

    return () => {
      if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
    };
  }, [recover, state.phase, state.requestId]);

  useEffect(() => {
    if (state.phase !== "revealing" && state.phase !== "recovering") return;
    const requestId = state.requestId;
    const timeout = window.setTimeout(
      () => finish(requestId, state.phase === "revealing"),
      850,
    );
    return () => window.clearTimeout(timeout);
  }, [finish, state.phase, state.requestId]);

  useEffect(() => {
    const onPopState = () => {
      const current = stateRef.current;
      if (current.phase !== "idle") recover(current.requestId);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [recover]);

  useEffect(() => {
    const reduced = reducedTarget.current;
    if (!reduced || new URL(reduced, window.location.href).pathname !== pathname) return;

    reducedTarget.current = null;
    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => focusDestination(reduced));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    const previous = previousPathname.current;
    previousPathname.current = pathname;

    if (stateRef.current.phase === "idle" && previous !== pathname) {
      window.requestAnimationFrame(() => focusDestination(null));
    }
  }, [pathname]);

  useEffect(() => () => {
    document.documentElement.removeAttribute("data-route-transition");
  }, []);

  const isTransitioning = state.phase !== "idle";

  return (
    <RouteTransitionContext.Provider value={{ isTransitioning, navigateWithTransition }}>
      <ClickSpark
        sparkColor="#7892ff"
        sparkSize={11}
        sparkRadius={19}
        sparkCount={8}
        duration={420}
      >
        <div id="app-shell" aria-busy={isTransitioning ? "true" : "false"}>
          {children}
        </div>
      </ClickSpark>
      <MosaicTransitionOverlay
        phase={state.phase}
        origin={state.origin}
        theme={state.theme}
        requestId={state.requestId}
        onCovered={onCovered}
        onRevealComplete={onRevealComplete}
      />
    </RouteTransitionContext.Provider>
  );
}
