import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error) {
    // Fail soft: the site should render sensible defaults rather than
    // crash if settings haven't been seeded yet.
    return null;
  }
  return data;
}
