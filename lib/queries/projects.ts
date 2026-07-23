import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectGallery = Database["public"]["Tables"]["project_gallery"]["Row"];
type ProjectBeforeAfter = Database["public"]["Tables"]["project_before_after"]["Row"];

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("content_status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Project[];
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("content_status", "published")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<{
  project: Project;
  gallery: ProjectGallery[];
  beforeAfter: ProjectBeforeAfter[];
} | null> {
  const supabase = createPublicClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("content_status", "published")
    .single();

  if (error || !project) return null;

  const [{ data: gallery }, { data: beforeAfter }] = await Promise.all([
    supabase
      .from("project_gallery")
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("project_before_after")
      .select("*")
      .eq("project_id", project.id),
  ]);

  return {
    project: project as Project,
    gallery: (gallery ?? []) as ProjectGallery[],
    beforeAfter: (beforeAfter ?? []) as ProjectBeforeAfter[],
  };
}

export async function getAllProjectSlugs(): Promise<Pick<Project, "slug">[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .eq("content_status", "published");

  if (error || !data) return [];
  return data as Pick<Project, "slug">[];
}
