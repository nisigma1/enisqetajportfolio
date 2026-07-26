"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useRouteTransition } from "@/components/transition/RouteTransitionContext";
import { activeRouteForPathname } from "@/lib/route-transition.mjs";

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
  const [closing, setClosing] = useState(false);
  const currentActive = activeRouteForPathname(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const transitionFromMenuRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function closeMenuNormally() {
    transitionFromMenuRef.current = false;
    setClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 220);
  }

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
        closeMenuNormally();
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

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function openMenu() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    transitionFromMenuRef.current = false;
    setClosing(false);
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : triggerRef.current;
    setOpen(true);
  }

  function closeMenuForTransition() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    transitionFromMenuRef.current = true;
    previousFocusRef.current = null;
    setClosing(false);
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

      <noscript>
        <nav className="mobile-noscript-navigation" aria-label="Mobile navigation fallback">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </nav>
      </noscript>

      {open && (
        <MobileNavigation
          activeRoute={currentActive}
          closeRef={closeRef}
          menuRef={menuRef}
          closing={closing}
          onClose={closeMenuNormally}
          onTransitionStart={closeMenuForTransition}
          onTransitionBypass={closeMenuNormally}
        />
      )}
    </>
  );
}
