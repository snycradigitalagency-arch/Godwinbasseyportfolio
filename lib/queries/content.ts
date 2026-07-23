import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Skill = Database["public"]["Tables"]["skills"]["Row"];
type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
type Certification = Database["public"]["Tables"]["certifications"]["Row"];
type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Service[];
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Skill[];
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Achievement[];
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Certification[];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as Testimonial[];
}
