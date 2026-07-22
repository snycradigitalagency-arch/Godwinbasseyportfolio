import { notFound } from "next/navigation";
import { FadeUp } from "@/components/motion/FadeUp";
import { Badge } from "@/components/ui/Badge";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/queries/projects";
import { buildMetadata, projectJsonLd } from "@/lib/seo";
import { ViewTracker } from "@/components/analytics/ViewTracker";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getProjectBySlug(params.slug);
  if (!data) return {};
  return buildMetadata({
    pagePath: `/projects/${params.slug}`,
    fallbackTitle: `${data.project.title} — Godwin Bassey`,
    fallbackDescription: data.project.summary || data.project.overview || "",
  });
}

const SECTIONS: { key: "overview" | "challenge" | "research" | "process" | "solution" | "results"; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "challenge", label: "The Challenge" },
  { key: "research", label: "Research" },
  { key: "process", label: "Process" },
  { key: "solution", label: "Solution" },
  { key: "results", label: "Results" },
];

export default async function ProjectCaseStudyPage({ params }: { params: { slug: string } }) {
  const data = await getProjectBySlug(params.slug);
  if (!data) notFound();
  const { project, gallery, beforeAfter } = data;

  return (
    <main className="py-24 md:py-32">
      <ViewTracker eventType="project_view" targetId={project.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projectJsonLd({
              title: project.title,
              description: project.summary || project.overview || "",
              slug: project.slug,
            })
          ),
        }}
      />
      <header className="container-page">
        <FadeUp>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={project.status === "live" ? "success" : "neutral"}>
              {project.status.replace("_", " ")}
            </Badge>
            {project.tech_tags?.map((tag) => (
              <span key={tag} className="text-xs text-text-muted">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-hero text-text-primary">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-6 max-w-2xl text-lg text-text-secondary">{project.summary}</p>
          )}
          <div className="mt-8 flex gap-6">
            {project.live_url && (
              <a
                href={project.live_url}
                data-cursor="hover"
                className="text-sm font-semibold text-accent hover:text-accent-hover"
              >
                View Live →
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                data-cursor="hover"
                className="text-sm font-semibold text-text-secondary hover:text-text-primary"
              >
                GitHub →
              </a>
            )}
          </div>
        </FadeUp>
      </header>

      <div className="container-page mt-20 aspect-video w-full rounded-lg border border-border bg-bg-secondary" />

      <div className="container-page mt-20 grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="flex flex-col gap-16 md:col-span-8">
          {SECTIONS.map(
            (section) =>
              project[section.key] && (
                <FadeUp key={section.key}>
                  <h2 className="font-display text-2xl normal-case tracking-normal text-text-primary">
                    {section.label}
                  </h2>
                  <p className="mt-4 leading-relaxed text-text-secondary">
                    {project[section.key]}
                  </p>
                </FadeUp>
              )
          )}

          {beforeAfter.length > 0 && (
            <FadeUp>
              <h2 className="font-display text-2xl normal-case tracking-normal text-text-primary">
                Before / After
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {beforeAfter.map((pair) => (
                  <div key={pair.id} className="flex flex-col gap-3">
                    <div className="aspect-video rounded-lg border border-border bg-bg-secondary" />
                    <p className="text-xs text-text-muted">{pair.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          )}

          {gallery.length > 0 && (
            <FadeUp>
              <h2 className="font-display text-2xl normal-case tracking-normal text-text-primary">
                Gallery
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-[4/3] rounded-lg border border-border bg-bg-secondary"
                  />
                ))}
              </div>
            </FadeUp>
          )}
        </div>

        <aside className="md:col-span-4">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <p className="eyebrow">Stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech_tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
