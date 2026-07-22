"use client";

import { trackEvent } from "@/components/analytics/AnalyticsBeacon";

export function SocialLink({
  href,
  label,
  eventType,
}: {
  href: string;
  label: string;
  eventType: string;
}) {
  return (
    <a
      href={href}
      data-cursor="hover"
      onClick={() => trackEvent(eventType)}
      className="text-sm text-text-muted transition-colors duration-300 hover:text-text-primary"
    >
      {label}
    </a>
  );
}
