import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

type Insight = Database["public"]["Tables"]["insights"]["Row"];

export async function getPublishedInsights(): Promise<Insight[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("content_status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data as Insight[];
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("slug", slug)
    .eq("content_status", "published")
    .single();

  if (error || !data) return null;
  return data as Insight;
}

export async function getAllInsightSlugs(): Promise<Pick<Insight, "slug">[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("insights")
    .select("slug")
    .eq("content_status", "published");

  if (error || !data) return [];
  return data as Pick<Insight, "slug">[];
}
