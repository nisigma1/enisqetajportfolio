"use client";

import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("index");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = navigation.map((item) => document.getElementById(item.href.slice(1))).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-20% 0px -68%" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="masthead">
        <a className="masthead-name" href="#index" aria-label="Enis Qetaj, back to index"><span>EQ</span> Enis Qetaj</a>
        <nav className="masthead-nav" aria-label="Primary navigation">
          {navigation.map((item) => <a key={item.label} href={item.href} aria-current={active === item.href.slice(1) ? "location" : undefined}>{item.label}</a>)}
        </nav>
        <div className="masthead-actions"><p className="masthead-place"><i /> Kosovo</p><ThemeToggle /><button ref={triggerRef} className="menu-button" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation">Menu <span>+</span></button></div>
      </header>
      {open && (
        <div ref={menuRef} id="mobile-navigation" className="mobile-navigation" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="mobile-navigation-top"><span>Enis Qetaj / Kosovo</span><div><ThemeToggle /><button type="button" onClick={() => setOpen(false)}>Close ×</button></div></div>
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => <a key={item.label} href={item.href} onClick={() => setOpen(false)} aria-current={active === item.href.slice(1) ? "location" : undefined}><small>0{index + 1}</small>{item.label}</a>)}
          </nav>
          <div className="mobile-navigation-foot"><a href="mailto:enisqeta5@gmail.com">enisqeta5@gmail.com</a><span>Markets / Research / Digital products</span></div>
        </div>
      )}
    </>
  );
}
