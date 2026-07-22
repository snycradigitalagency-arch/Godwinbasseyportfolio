import Link from "next/link";
import { FadeUp } from "@/components/motion/FadeUp";
import { Badge } from "@/components/ui/Badge";
import type { Database } from "@/types/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "Live",
  in_progress: "In Progress",
  archived: "Archived",
};

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <FadeUp delay={delay}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="hover"
        className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors duration-300 hover:border-accent"
      >
        <div className="aspect-[4/3] w-full bg-bg-secondary" />
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-2xl normal-case tracking-normal text-text-primary">
              {project.title}
            </h3>
            <Badge tone={project.status === "live" ? "success" : "neutral"}>
              {STATUS_LABEL[project.status]}
            </Badge>
          </div>
          {project.summary && (
            <p className="mt-3 text-sm text-text-muted">{project.summary}</p>
          )}
          {project.tech_tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech_tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs text-text-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </FadeUp>
  );
}
