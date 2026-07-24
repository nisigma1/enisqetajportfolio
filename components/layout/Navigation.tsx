"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useRouteTransition } from "@/components/transition/RouteTransitionContext";
import { activeRouteForPathname } from "@/lib/route-transition.mjs";
import { ActionMark } from "@/components/ui/ActionMark";

type InertSnapshot = {
  element: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
};

function NavLabel({ children }: { children: string }) {
  return (
    <span className="nav-label">
      {children}
      <span className="nav-corners" aria-hidden="true">
        <i className="nav-corner nav-corner--tl" />
        <i className="nav-corner nav-corner--tr" />
        <i className="nav-corner nav-corner--br" />
        <i className="nav-corner nav-corner--bl" />
      </span>
    </span>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const { isTransitioning } = useRouteTransition();
  const [open, setOpen] = useState(false);
  const currentActive = activeRouteForPathname(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const transitionFromMenuRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const bodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const inertSnapshots: InertSnapshot[] = [];

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    closeRef.current?.focus();

    document.querySelectorAll<HTMLElement>("main, footer, .masthead").forEach((element) => {
      if (menuRef.current?.contains(element)) return;
      inertSnapshots.push({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      });
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      inertSnapshots.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      document.body.style.overflow = bodyStyle.overflow;
      document.body.style.position = bodyStyle.position;
      document.body.style.top = bodyStyle.top;
      document.body.style.width = bodyStyle.width;

      if (!transitionFromMenuRef.current) {
        window.scrollTo({ top: scrollY, behavior: "instant" });
        previousFocusRef.current?.focus();
      }
    };
  }, [open]);

  function openMenu() {
    transitionFromMenuRef.current = false;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : triggerRef.current;
    setOpen(true);
  }

  function closeMenuForTransition() {
    transitionFromMenuRef.current = true;
    previousFocusRef.current = null;
    setOpen(false);
  }

  function closeMenuNormally() {
    transitionFromMenuRef.current = false;
    setOpen(false);
  }

  return (
    <>
      <header className="masthead">
        <TransitionLink
          className="masthead-name"
          href="/"
          aria-label="Enis Qetaj, back to index"
        >
          <span className="masthead-name__wordmark">Enis Qetaj</span>
        </TransitionLink>

        <nav className="masthead-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const key = item.label.toLowerCase();
            return (
              <TransitionLink
                key={item.label}
                className="transition-nav-link"
                href={item.href}
                aria-current={currentActive === key ? "page" : undefined}
              >
                <NavLabel>{item.label}</NavLabel>
              </TransitionLink>
            );
          })}
        </nav>

        <div className="masthead-actions">
          <p className="masthead-place"><i aria-hidden="true" /> Kosovo</p>
          <ThemeToggle />
          <button
            ref={triggerRef}
            className="menu-button"
            type="button"
            onClick={openMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            disabled={isTransitioning}
          >
            Menu <span aria-hidden="true">+</span>
          </button>
        </div>
      </header>

      {open && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
        >
          <div className="mobile-navigation-top">
            <span id="mobile-navigation-title">Enis Qetaj / Kosovo</span>
            <div>
              <ThemeToggle />
              <button ref={closeRef} type="button" onClick={closeMenuNormally}>
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>

          <nav aria-label="Mobile navigation">
            {navigation.map((item) => {
              const key = item.label.toLowerCase();
              return (
                <TransitionLink
                  key={item.label}
                  className="transition-nav-link"
                  href={item.href}
                  onTransitionStart={closeMenuForTransition}
                  onTransitionBypass={closeMenuNormally}
                  aria-current={currentActive === key ? "page" : undefined}
                >
                  <NavLabel>{item.label}</NavLabel>
                  <ActionMark direction="forward" className="mobile-navigation__arrow" />
                </TransitionLink>
              );
            })}
          </nav>

          <div className="mobile-navigation-foot">
            <a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a>
            <span>Markets / Research / Digital products</span>
          </div>
        </div>
      )}
    </>
  );
}
