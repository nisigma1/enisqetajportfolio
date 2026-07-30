"use client";

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { identity } from "@/data/site";

const LazyContextCircuit = lazy(() =>
  import("@/components/markets/ContextCircuit").then((module) => ({
    default: module.ContextCircuit,
  })),
);
const LazyBuildNavigator = lazy(() =>
  import("@/components/build/BuildNavigator").then((module) => ({
    default: module.BuildNavigator,
  })),
);
const LazyContactForm = lazy(() =>
  import("@/components/forms/ContactForm").then((module) => ({
    default: module.ContactForm,
  })),
);
const LazyLetterGlitch = lazy(() =>
  import("@/components/ui/LetterGlitch").then((module) => ({
    default: module.LetterGlitch,
  })),
);
const LazyTextRoll = lazy(() =>
  import("@/components/core/text-roll").then((module) => ({
    default: module.TextRoll,
  })),
);
const LazyLineSidebar = lazy(() =>
  import("@/components/ui/LineSidebar").then((module) => ({
    default: module.LineSidebar,
  })),
);
const LazyPixelCanvas = lazy(() =>
  import("@/components/ui/PixelCanvas").then((module) => ({
    default: module.PixelCanvas,
  })),
);

function NearViewport({
  children,
  fallback,
  className,
  inline = false,
}: {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  inline?: boolean;
}) {
  const hostRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "700px 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const content = ready
    ? <Suspense fallback={fallback}>{children}</Suspense>
    : fallback;

  return inline
    ? <span ref={hostRef} className={className}>{content}</span>
    : <div ref={hostRef as RefObject<HTMLDivElement>} className={className}>{content}</div>;
}

export function DeferredTextRoll({ children }: { children: string }) {
  return (
    <NearViewport inline fallback={<span>{children}</span>}>
      <LazyTextRoll>{children}</LazyTextRoll>
    </NearViewport>
  );
}

export function AdaptivePortfolioPixelField() {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    if (!query.matches) return;

    const activate = () => {
      setInteractive(true);
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("pointerdown", activate);
    };
    window.addEventListener("pointermove", activate, { passive: true, once: true });
    window.addEventListener("pointerdown", activate, { passive: true, once: true });
    return () => {
      window.removeEventListener("pointermove", activate);
      window.removeEventListener("pointerdown", activate);
    };
  }, []);

  const fallback = (
    <div className="pixel-canvas portfolio-pixel-field" aria-hidden="true" />
  );

  if (!interactive) return fallback;

  return (
    <Suspense fallback={fallback}>
      <LazyPixelCanvas
        className="portfolio-pixel-field"
        gap={8}
        speed={0.06}
        variant="trail"
        colors={["#315df2", "#5f7cff", "#819cff", "#aab9f5"]}
        ambientOnTouch={false}
        maxDpr={1}
        radius={124}
        coarseRadius={92}
        coarseFps={20}
        aria-hidden="true"
      />
    </Suspense>
  );
}

export function DeferredContextCircuit() {
  const fallback = (
    <div className="context-circuit context-circuit--deferred" aria-label="Seven-layer market context">
      <div>
        <strong>One signal. A wider decision.</strong>
        <p>Price · Structure · Fundamentals · Liquidity · Macro · Geopolitics · On-chain</p>
      </div>
    </div>
  );
  return (
    <NearViewport fallback={fallback}>
      <LazyContextCircuit />
    </NearViewport>
  );
}

export function DeferredBuildNavigator() {
  const fallback = (
    <div className="build-navigator build-navigator--deferred" aria-label="Product-building directions">
      <p>Website · AI product · Automation · Research interface</p>
    </div>
  );
  return (
    <NearViewport fallback={fallback}>
      <LazyBuildNavigator />
    </NearViewport>
  );
}

export function DeferredLetterGlitch() {
  return (
    <NearViewport
      className="malera-practice__glitch"
      fallback={<div className="letter-glitch letter-glitch--deferred" aria-hidden="true" />}
    >
      <LazyLetterGlitch
        glitchColors={["#315df2", "#5f7cff", "#8facff", "#dce5ff"]}
        glitchSpeed={64}
        outerVignette
        smooth
        characters="MALERASTUDIO0123456789+-/[]{}<>"
      />
    </NearViewport>
  );
}

export function DeferredContactForm() {
  const fallback = (
    <div className="contact-form contact-form--deferred">
      <p>Ready to start? Open a direct email draft and include your context.</p>
      <a className="button button--primary" href={identity.emailHref}>Start an email</a>
    </div>
  );
  return (
    <NearViewport fallback={fallback}>
      <LazyContactForm />
    </NearViewport>
  );
}

export function DeferredLineSidebar({
  items,
  hrefs,
}: {
  items: readonly string[];
  hrefs: readonly string[];
}) {
  const fallback = (
    <nav className="line-sidebar line-sidebar--deferred" aria-label="Explore the portfolio">
      <ul className="line-sidebar__list">
        {items.map((label, index) => (
          <li className="line-sidebar__item" key={label}>
            <a className="line-sidebar__control" href={hrefs[index]}>
              <span className="line-sidebar__label">
                <span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="line-sidebar__text">{label}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <NearViewport className="footer-line-sidebar" fallback={fallback}>
      <LazyLineSidebar
        className="footer-line-sidebar"
        items={items}
        hrefs={hrefs}
        accentColor="var(--accent)"
        textColor="var(--text-secondary)"
        markerColor="var(--border-strong)"
        proximityRadius={110}
        maxShift={24}
        markerLength={52}
        tickScale={0.42}
        itemGap={15}
        fontSize={1.05}
        smoothing={110}
      />
    </NearViewport>
  );
}
