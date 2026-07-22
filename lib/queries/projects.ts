import { createClient } from "@/lib/supabase/server";

export async function getPublishedProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("content_status", "published")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data;
}

export async function getFeaturedProjects(limit = 3) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("content_status", "published")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return [];
  return data;
}

export async function getProjectBySlug(slug: string) {
  const supabase = createClient();
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

  return { project, gallery: gallery ?? [], beforeAfter: beforeAfter ?? [] };
}

export async function getAllProjectSlugs() {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("content_status", "published");
  return data ?? [];
}
