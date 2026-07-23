import { createPublicClient } from "@/lib/supabase/public";

export async function getSiteSettings() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error) {
    return null;
  }
  return data;
}
