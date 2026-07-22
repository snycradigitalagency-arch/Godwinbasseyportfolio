import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import type { Database } from "@/types/database.types";

type Insight = Database["public"]["Tables"]["insights"]["Row"];

export function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  return (
    <FadeUp delay={delay}>
      <Link
        href={`/insights/${insight.slug}`}
        data-cursor="hover"
        className="group block border-b border-border py-8 transition-colors duration-300"
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl normal-case tracking-normal text-text-primary group-hover:text-accent">
              {insight.title}
            </h3>
            {insight.excerpt && (
              <p className="mt-2 max-w-xl text-sm text-text-muted">{insight.excerpt}</p>
            )}
          </div>
          {insight.reading_time_minutes && (
            <span className="shrink-0 text-xs text-text-muted">
              {insight.reading_time_minutes} min read
            </span>
          )}
        </div>
      </Link>
    </FadeUp>
  );
}
