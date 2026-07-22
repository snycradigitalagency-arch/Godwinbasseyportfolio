import { createClient } from "@/lib/supabase/server";

export async function getUnifiedTimeline() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("unified_timeline")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) return [];
  return data;
}
