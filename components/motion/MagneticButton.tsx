"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { MouseEvent, ReactNode, useRef } from "react";
import { trackEvent } from "@/components/analytics/AnalyticsBeacon";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  /** How strongly the element follows the cursor; keep subtle (0.2–0.4) */
  strength?: number;
  /** Fires an analytics_events row on click — pass a plain string so this
   *  stays serializable when used from a Server Component like Hero. */
  trackAs?: string;
}

/**
 * Wraps a single interactive child (button/link) and nudges it toward
 * the cursor within its own bounds. Used sparingly — primary CTAs only —
 * so the effect reads as intentional rather than gimmicky.
 */
export function MagneticButton({
  children,
  className,
  onClick,
  href,
  strength = 0.3,
  trackAs,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const relX = e.clientX - bounds.left - bounds.width / 2;
    const relY = e.clientY - bounds.top - bounds.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Tag = href ? "a" : "button";

  function handleClick() {
    if (trackAs) trackEvent(trackAs);
    onClick?.();
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Tag
        href={href}
        onClick={handleClick}
        className={className}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
