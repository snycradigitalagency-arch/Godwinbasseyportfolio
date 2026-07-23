import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

type TimelineItem = Database["public"]["Views"]["unified_timeline"]["Row"];

export async function getUnifiedTimeline(): Promise<TimelineItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("unified_timeline")
    .select("*")
    .order("start_date", { ascending: false });

  if (error || !data) return [];
  return data as TimelineItem[];
}
