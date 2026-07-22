"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A single-run loader: a name wordmark that scales in then wipes away.
 * Only fires once per session (sessionStorage flag) so repeat page
 * navigations inside the app don't replay it.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("gb-loader-seen");
    if (seen) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("gb-loader-seen", "1");
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="font-display text-4xl uppercase tracking-widest text-text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Godwin Bassey
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
