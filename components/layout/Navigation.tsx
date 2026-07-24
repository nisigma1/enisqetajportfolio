"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const primaryLabels = new Set(["Index", "Research", "Markets", "Work", "Build", "Contact"]);
const primaryNavigation = navigation.filter((item) => primaryLabels.has(item.label));

type InertSnapshot = {
  element: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
};

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("index");
  const routeActive = pathname.startsWith("/research")
    ? "research"
    : pathname.startsWith("/work")
      ? "work"
      : pathname.startsWith("/contact")
        ? "contact"
        : "index";
  const currentActive = pathname === "/" ? active : routeActive;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const pendingTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = primaryNavigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -62%", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

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
      ).filter((element) => !element.hasAttribute("hidden"));

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
      const targetId = pendingTargetRef.current;
      pendingTargetRef.current = null;
      if (targetId) {
        window.history.pushState(null, "", `#${targetId}`);
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ block: "start" });
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: scrollY, behavior: "instant" });
        previousFocusRef.current?.focus();
      }
    };
  }, [open]);

  function openMenu() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : triggerRef.current;
    setOpen(true);
  }

  function followMobileLink(event: MouseEvent<HTMLAnchorElement>, target: string) {
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    pendingTargetRef.current = target;
    setOpen(false);
  }

  return (
    <>
      <header className="masthead">
        <Link className="masthead-name" href="/#index" aria-label="Enis Qetaj, back to index">
          <span aria-hidden="true">EQ</span>
          Enis Qetaj
        </Link>

        <nav className="masthead-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link
              key={item.label}
              href={`/${item.href}`}
              aria-current={currentActive === item.href.slice(1) ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
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
              <button ref={closeRef} type="button" onClick={() => setOpen(false)}>
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>

          <nav aria-label="Mobile navigation">
            {primaryNavigation.map((item) => (
              <Link
                key={item.label}
                href={`/${item.href}`}
                onClick={(event) => followMobileLink(event, item.href.slice(1))}
                aria-current={currentActive === item.href.slice(1) ? "location" : undefined}
              >
                {item.label}
              </Link>
            ))}
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
