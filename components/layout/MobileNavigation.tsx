"use client";

import type { CSSProperties, RefObject } from "react";
import { identity, navigation } from "@/data/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TransitionLink } from "@/components/transition/TransitionLink";

type MobileNavigationProps = {
  activeRoute: string;
  closeRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  closing: boolean;
  onClose: () => void;
  onTransitionBypass: () => void;
  onTransitionStart: () => void;
};

type StepStyle = CSSProperties & {
  "--menu-step": number;
};

export function MobileNavigation({
  activeRoute,
  closeRef,
  menuRef,
  closing,
  onClose,
  onTransitionBypass,
  onTransitionStart,
}: MobileNavigationProps) {
  return (
    <div
      ref={menuRef}
      id="mobile-navigation"
      className="mobile-navigation"
      data-closing={closing ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-navigation-title"
    >
      <div className="mobile-navigation__scroll">
        <header className="mobile-navigation-top">
          <div className="mobile-navigation__identity">
            <strong id="mobile-navigation-title">Enis Qetaj</strong>
            <span>Kosovo</span>
          </div>

          <div className="mobile-navigation__controls">
            <ThemeToggle />
            <button
              ref={closeRef}
              className="mobile-navigation__close"
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <span className="mobile-navigation__close-mark" aria-hidden="true" />
              <small>Close</small>
            </button>
          </div>
        </header>

        <div className="mobile-navigation__body">
          <aside className="mobile-navigation__rail" aria-hidden="true">
            <div>
              <span>Navigation</span>
              <i />
              <p>Select a section to explore</p>
            </div>
            <span className="mobile-navigation__rail-note">Scroll to explore</span>
          </aside>

          <nav className="mobile-navigation__staircase" aria-label="Mobile navigation">
            {navigation.map((item, index) => {
              const key = item.label.toLowerCase();
              const isCurrent = activeRoute === key;
              const stepStyle: StepStyle = { "--menu-step": index };

              return (
                <TransitionLink
                  key={item.label}
                  className="mobile-navigation__route"
                  href={item.href}
                  style={stepStyle}
                  onTransitionStart={onTransitionStart}
                  onTransitionBypass={onTransitionBypass}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span className="mobile-navigation__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mobile-navigation__label">{item.label}</span>
                  <span className="mobile-navigation__route-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M5 12h13M13 7l5 5-5 5" />
                    </svg>
                  </span>
                  <span className="mobile-navigation__brackets" aria-hidden="true">
                    <i className="mobile-navigation__bracket mobile-navigation__bracket--tl" />
                    <i className="mobile-navigation__bracket mobile-navigation__bracket--tr" />
                    <i className="mobile-navigation__bracket mobile-navigation__bracket--br" />
                    <i className="mobile-navigation__bracket mobile-navigation__bracket--bl" />
                  </span>
                </TransitionLink>
              );
            })}
          </nav>
        </div>

        <footer className="mobile-navigation-foot">
          <a href={identity.emailHref} target="_blank" rel="noreferrer">
            <span aria-hidden="true">✦</span>
            <strong>{identity.email}</strong>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M5 12h13M13 7l5 5-5 5" />
            </svg>
          </a>
          <p>Markets <i>/</i> Research <i>/</i> Digital products</p>
        </footer>
      </div>
    </div>
  );
}
