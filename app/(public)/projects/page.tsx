import { FadeUp } from "@/components/motion/FadeUp";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getPublishedProjects } from "@/lib/queries/projects";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    pagePath: "/projects",
    fallbackTitle: "Projects — Godwin Bassey",
    fallbackDescription: "Selected full-stack, design, and AI automation work by Godwin Bassey.",
  });
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main id="projects" className="container-page py-24 md:py-32">
      <FadeUp>
        <span className="eyebrow">Projects</span>
        <h1 className="mt-4 max-w-2xl font-display text-section text-text-primary">
          Selected work.
        </h1>
      </FadeUp>

      {projects.length === 0 ? (
        <p className="mt-16 text-text-muted">
          Projects are being published — check back shortly.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={0.05 * (i % 3)} />
          ))}
        </div>
      )}
    </main>
  );
}
