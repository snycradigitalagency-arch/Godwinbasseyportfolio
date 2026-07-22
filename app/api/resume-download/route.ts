import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("id, resume_file_url, resume_download_count")
    .single();

  if (!settings?.resume_file_url) {
    return NextResponse.json({ error: "No resume uploaded yet." }, { status: 404 });
  }

  await supabase
    .from("site_settings")
    .update({ resume_download_count: (settings.resume_download_count ?? 0) + 1 })
    .eq("id", settings.id);

  return NextResponse.redirect(settings.resume_file_url);
}
