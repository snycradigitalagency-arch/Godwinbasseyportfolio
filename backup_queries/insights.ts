import { createClient } from "@/lib/supabase/server";

export async function getPublishedInsights() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("content_status", "published")
    .order("published_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getInsightBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("slug", slug)
    .eq("content_status", "published")
    .single();

  if (error) return null;
  return data;
}

export async function getAllInsightSlugs() {
  const supabase = createClient();
  const { data } = await supabase
    .from("insights")
    .select("slug")
    .eq("content_status", "published");
  return data ?? [];
}
