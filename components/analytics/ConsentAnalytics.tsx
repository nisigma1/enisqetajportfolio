"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ConsentState = "accepted" | "rejected" | null;

type MetaPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  queue: unknown[][];
  push?: MetaPixel;
  version?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    fbq?: MetaPixel;
    _fbq?: MetaPixel;
  }
}

const consentKey = "enis-analytics-consent";

function loadGoogleAnalytics(measurementId: string) {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }

  if (!document.querySelector(`script[data-analytics="ga4-${measurementId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.analytics = `ga4-${measurementId}`;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  }
}

function loadMetaPixel(pixelId: string) {
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as MetaPixel;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    window.fbq = fbq;
    window._fbq = fbq;
  }

  if (!document.querySelector(`script[data-analytics="meta-${pixelId}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.analytics = `meta-${pixelId}`;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.append(script);
    window.fbq?.("init", pixelId);
  }
}

export function ConsentAnalytics({
  gaMeasurementId,
  metaPixelId,
}: {
  gaMeasurementId?: string;
  metaPixelId?: string;
}) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem(consentKey);
      setConsent(saved === "accepted" || saved === "rejected" ? saved : null);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;

    if (gaMeasurementId) {
      const analyticsWindow = window as unknown as Record<string, unknown>;
      analyticsWindow[`ga-disable-${gaMeasurementId}`] = false;
      loadGoogleAnalytics(gaMeasurementId);
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    if (metaPixelId) {
      loadMetaPixel(metaPixelId);
      window.fbq?.("consent", "grant");
      window.fbq?.("track", "PageView");
    }
  }, [consent, gaMeasurementId, metaPixelId, pathname]);

  const saveConsent = (nextConsent: Exclude<ConsentState, null>) => {
    localStorage.setItem(consentKey, nextConsent);
    setConsent(nextConsent);
    setSettingsOpen(false);

    if (nextConsent === "rejected") {
      if (gaMeasurementId) {
        const analyticsWindow = window as unknown as Record<string, unknown>;
        analyticsWindow[`ga-disable-${gaMeasurementId}`] = true;
      }
      window.fbq?.("consent", "revoke");
    }
  };

  const showDialog = consent === null || settingsOpen;

  return (
    <>
      {showDialog && (
        <section className="privacy-consent" aria-label="Analytics privacy choices" role="dialog" aria-modal="false">
          <div>
            <p>Privacy choices</p>
            <h2>Choose how this portfolio measures visits.</h2>
            <p>Essential storage keeps your theme and privacy choice. Optional analytics load only after you accept.</p>
          </div>
          <div className="privacy-consent__actions">
            <button type="button" className="button button--primary" onClick={() => saveConsent("accepted")}>Accept analytics</button>
            <button type="button" className="button button--quiet" onClick={() => saveConsent("rejected")}>Essential only</button>
          </div>
        </section>
      )}
      {!showDialog && (
        <button type="button" className="privacy-consent__manage" onClick={() => setSettingsOpen(true)}>
          Privacy settings
        </button>
      )}
    </>
  );
}
