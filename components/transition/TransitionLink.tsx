"use client";

import { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
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
      if (isTransitioning && shouldIntercept) event.preventDefault();
      return;
    }

    const rect = anchor.getBoundingClientRect();
    event.preventDefault();
    const started = navigateWithTransition(hrefString, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    if (!started) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      anchor.setAttribute("data-transition-pending", "true");
    }
    onTransitionStart?.();
  }

  return (
    <Link
      href={href}
      onClick={activate}
      {...props}
    />
  );
}
