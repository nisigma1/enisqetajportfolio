"use client";

// A route-scoped client reference lets Vinext emit this CSS separately from
// the approved homepage's shared stylesheet. It renders no extra DOM.
import "@/styles/inner-pages.css";

export function InnerPageStyles() { return null; }
