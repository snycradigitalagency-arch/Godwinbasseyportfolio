"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A minimal ring cursor: hidden on touch devices (see globals.css media
 * query), grows subtly over interactive elements via [data-cursor="hover"].
 * Mount once in the root layout.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 10);
      y.set(e.clientY - 10);
      if (!isVisible) setIsVisible(true);
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("[data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isVisible, x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] hidden rounded-full border border-accent mix-blend-difference md:block"
      style={{
        x: springX,
        y: springY,
        width: 20,
        height: 20,
        opacity: isVisible ? 1 : 0,
      }}
      animate={{ scale: isHovering ? 2 : 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
