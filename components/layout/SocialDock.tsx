"use client";

import { useCallback, useRef, useState } from "react";
import { identity } from "@/data/site";

type SocialName = (typeof identity.social)[number]["label"];

function SocialIcon({ name }: { name: SocialName }) {
  if (name === "LinkedIn") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.3a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.5v11.2H3.4V9Zm5.7 0h3.3v1.5h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.1h-3.5v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.6H9.1V9Z" /></svg>;
  }
  if (name === "Instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="social-dock__dot" cx="17.55" cy="6.55" r="1" /></svg>;
  }
  if (name === "Facebook") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 20.5v-7.7h2.6l.4-3h-3V7.9c0-.9.2-1.5 1.5-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2H7.7v3h2.7v7.7h3.3Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.6 2.8h3.7l-8.1 9.3 9.5 9.1h-7.4l-5.8-7.6-6.7 7.6H.1l8.6-9.8-8.3-8.6H8l5.3 6.9 5.3-6.9Zm-1.3 16.5h2L6.9 4.6H4.8l12.5 14.7Z" /></svg>;
}

export function SocialDock() {
  const dockRef = useRef<HTMLDivElement>(null);
  const [pointerX, setPointerX] = useState<number | null>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = dockRef.current?.getBoundingClientRect();
    if (bounds) setPointerX(event.clientX - bounds.left);
  }, []);

  return (
    <section className="social-dock-section" aria-labelledby="social-dock-title">
      <div className="social-dock-section__intro">
        <span>Elsewhere</span>
        <h2 id="social-dock-title">Follow the work.</h2>
      </div>
      <div
        ref={dockRef}
        className="social-dock"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setPointerX(null)}
      >
        {identity.social.map((social, index) => {
          const itemCenter = 22 + index * 58;
          const distance = pointerX === null ? 999 : Math.abs(pointerX - itemCenter);
          const scale = Math.max(1, 1.52 - distance / 145);
          return (
            <a
              key={social.label}
              className="social-dock__item"
              href={social.href}
              target="_blank"
              rel="noreferrer me"
              aria-label={`Open Enis Qetaj on ${social.label}`}
              style={{ "--dock-scale": scale } as React.CSSProperties}
            >
              <span className="social-dock__icon"><SocialIcon name={social.label} /></span>
              <span className="social-dock__label">{social.label}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
