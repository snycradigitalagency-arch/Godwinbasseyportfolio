import { notFound } from "next/navigation";
import { FadeUp } from "@/components/motion/FadeUp";
import { RichTextRenderer } from "@/components/insights/RichTextRenderer";
import { getAllInsightSlugs, getInsightBySlug } from "@/lib/queries/insights";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { ViewTracker } from "@/components/analytics/ViewTracker";

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) return {};
  return buildMetadata({
    pagePath: `/insights/${params.slug}`,
    fallbackTitle: `${insight.title} — Godwin Bassey`,
    fallbackDescription: insight.excerpt || "",
  });
}

export default async function InsightDetailPage({ params }: { params: { slug: string } }) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) notFound();

  return (
    <main className="container-page py-24 md:py-32">
      <ViewTracker eventType="insight_view" targetId={insight.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: insight.title,
              description: insight.excerpt || "",
              slug: insight.slug,
              publishedAt: insight.published_at,
            })
          ),
        }}
      />
      <article className="mx-auto max-w-3xl">
        <FadeUp>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {insight.published_at && (
              <time dateTime={insight.published_at}>
                {new Date(insight.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {insight.reading_time_minutes && <span>{insight.reading_time_minutes} min read</span>}
          </div>
          <h1 className="mt-4 font-display text-section text-text-primary">{insight.title}</h1>
          {insight.excerpt && (
            <p className="mt-6 text-lg text-text-secondary">{insight.excerpt}</p>
          )}
        </FadeUp>

        <FadeUp delay={0.1} className="mt-16">
          <RichTextRenderer content={insight.content} />
        </FadeUp>
      </article>
    </main>
  );
}
