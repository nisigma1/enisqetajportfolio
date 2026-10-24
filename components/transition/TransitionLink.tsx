"use client";

import { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { shouldInterceptNavigation } from "@/lib/route-transition.mjs";
import { useRouteTransition } from "@/components/transition/RouteTransitionContext";

type TransitionLinkProps = ComponentProps<typeof Link> & {
  onTransitionStart?: () => void;
  onTransitionBypass?: () => void;
};

export function TransitionLink({
  href,
  onClick,
  onTransitionStart,
  onTransitionBypass,
  ...props
}: TransitionLinkProps) {
  const { isTransitioning, navigateWithTransition } = useRouteTransition();
  const router = useRouter();
  const hrefString = typeof href === "string" ? href : href.pathname ?? "/";

  function activate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const anchor = event.currentTarget;
    const shouldIntercept = shouldInterceptNavigation({
      href: hrefString,
      currentHref: window.location.href,
      button: event.button,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      target: anchor.target,
      download: anchor.hasAttribute("download"),
    });

    if (!shouldIntercept || isTransitioning) {
      onTransitionBypass?.();
      // Never swallow a click while another transition is winding down. Let
      // Next's native link handling complete the navigation instead of
      // leaving the visitor on the previous route (the old behaviour made the
      // Index logo appear to jump back to Markets or do nothing).
      return;
    }

    const rect = anchor.getBoundingClientRect();
    event.preventDefault();
    // Close/unlock a mobile dialog before the router records the departing
    // history entry. A fixed body otherwise reports scrollY=0.
    if (onTransitionStart) flushSync(onTransitionStart);
    const started = navigateWithTransition(hrefString, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    if (!started) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      anchor.setAttribute("data-transition-pending", "true");
    }
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={activate}
      {...props}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event);
        if (event.pointerType === "mouse") router.prefetch(hrefString);
      }}
      onFocus={(event) => {
        props.onFocus?.(event);
        router.prefetch(hrefString);
      }}
    />
  );
}
