"use client";

import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/navigation";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const sections = navigation.map((item) => document.getElementById(item.href.slice(1))).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-25% 0px -65%" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="Enis Qetaj, back to top">
          <span className="brand-mark">EQ</span>
          <span className="brand-name">Enis Qetaj</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} aria-current={active === item.href.slice(1) ? "location" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">Start a project <span>↗</span></a>
        <button ref={triggerRef} className="menu-trigger" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu">
          Menu <span aria-hidden="true">＋</span>
        </button>
        <div className="nav-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </header>

      {open && (
        <div ref={dialogRef} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="mobile-menu-top">
            <span className="brand-mark">EQ</span>
            <button type="button" onClick={closeMenu}>Close <span aria-hidden="true">×</span></button>
          </div>
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <a key={item.label} href={item.href} onClick={closeMenu} aria-current={active === item.href.slice(1) ? "location" : undefined}>
                <span>{String(index).padStart(2, "0")}</span>{item.label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu-foot">
            <p><i /> Available for select freelance projects</p>
            <a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a>
          </div>
        </div>
      )}
    </>
  );
}
