"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BlurInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * A heavier reveal than FadeUp — blur-to-sharp plus a soft scale.
 * Reserved for singular, high-impact moments (hero headline, portrait)
 * rather than reused across every section.
 */
export function BlurIn({ children, delay = 0, className }: BlurInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)", scale: 1.03 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
