"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/analytics/AnalyticsBeacon";

export function ViewTracker({ eventType, targetId }: { eventType: string; targetId: string }) {
  useEffect(() => {
    trackEvent(eventType, { targetId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  return null;
}
