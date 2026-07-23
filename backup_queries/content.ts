import { createClient } from "@/lib/supabase/server";

export async function getServices() {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSkills() {
  const supabase = createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAchievements() {
  const supabase = createClient();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getCertifications() {
  const supabase = createClient();
  const { data } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getFeaturedTestimonials() {
  const supabase = createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}
