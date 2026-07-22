"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Database } from "@/types/database.types";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (testimonials.length === 0) return null;
  const current = testimonials[index];

  function next() {
    setIndex((i) => (i + 1) % testimonials.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-2xl normal-case leading-snug tracking-normal text-text-primary md:text-3xl">
            "{current.content}"
          </p>
          <div className="mt-8">
            <p className="text-sm font-semibold text-text-primary">{current.client_name}</p>
            <p className="text-sm text-text-muted">
              {[current.client_title, current.client_company].filter(Boolean).join(" · ")}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {testimonials.length > 1 && (
        <div className="mt-10 flex gap-4">
          <button
            onClick={prev}
            data-cursor="hover"
            aria-label="Previous testimonial"
            className="rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-300 hover:border-accent hover:text-text-primary"
          >
            ←
          </button>
          <button
            onClick={next}
            data-cursor="hover"
            aria-label="Next testimonial"
            className="rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-300 hover:border-accent hover:text-text-primary"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
