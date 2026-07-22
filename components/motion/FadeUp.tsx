"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Distance in pixels the element travels on reveal */
  distance?: number;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Reveals children with a subtle upward fade the first time they enter
 * the viewport. Respects prefers-reduced-motion via framer's automatic
 * handling of the `transition` when the OS setting is on.
 */
export function FadeUp({ children, delay = 0, className, distance = 24 }: FadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
