"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function trackEvent(eventType: string, extra?: { targetType?: string; targetId?: string }) {
  const params = new URLSearchParams(window.location.search);
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      pagePath: window.location.pathname,
      referrer: document.referrer || undefined,
      utm: {
        source: params.get("utm_source") || undefined,
        medium: params.get("utm_medium") || undefined,
        campaign: params.get("utm_campaign") || undefined,
      },
      ...extra,
    }),
    keepalive: true,
  }).catch(() => {
    // Analytics failures should never surface to the visitor.
  });
}

/**
 * Mounted once in the root layout. Fires a page_view on first load and
 * every client-side route change — this is what populates the Command
 * Center's Portfolio Views / Unique Visitors stats.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
