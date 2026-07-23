import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";

type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }
  return data as SiteSettings;
}
