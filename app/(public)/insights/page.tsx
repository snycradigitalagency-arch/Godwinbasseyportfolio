import { FadeUp } from "@/components/motion/FadeUp";
import { InsightCard } from "@/components/insights/InsightCard";
import { getPublishedInsights } from "@/lib/queries/insights";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    pagePath: "/insights",
    fallbackTitle: "Insights — Godwin Bassey",
    fallbackDescription:
      "Development notes, AI experiments, branding insights, and case studies from Godwin Bassey.",
  });
}

export default async function InsightsPage() {
  const insights = await getPublishedInsights();

  return (
    <main className="container-page py-24 md:py-32">
      <FadeUp>
        <span className="eyebrow">Insights</span>
        <h1 className="mt-4 max-w-2xl font-display text-section text-text-primary">
          Notes on building
          <br />
          well.
        </h1>
        <p className="mt-6 max-w-xl text-text-secondary">
          Development notes, AI experiments, branding insights, and case
          studies from real work — not filler content.
        </p>
      </FadeUp>

      {insights.length === 0 ? (
        <p className="mt-16 text-text-muted">First insight is coming soon.</p>
      ) : (
        <div className="mt-16">
          {insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} delay={0.03 * (i % 5)} />
          ))}
        </div>
      )}
    </main>
  );
}
