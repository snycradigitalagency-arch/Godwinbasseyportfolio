"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/lib/auth/require-role";
import { logActivity } from "@/lib/admin/activity";

// Return type is `void`, not an error object — Next.js requires a
// <form action={fn}> Server Action to return void | Promise<void>.
// Errors are logged server-side instead; nothing in the resume page
// currently reads a returned error, so this loses no behavior.
export async function uploadResume(formData: FormData): Promise<void> {
  await requireEditor();
  const file = formData.get("resume") as File | null;
  if (!file || file.size === 0) {
    console.error("uploadResume: no file provided");
    return;
  }

  const supabase = createClient();
  const path = `resume-${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("resume")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) {
    console.error("uploadResume: storage upload failed:", uploadError.message);
    return;
  }

  const { data: publicUrl } = supabase.storage.from("resume").getPublicUrl(path);

  const { data: existing } = await supabase.from("site_settings").select("id").single();
  const { error: updateError } = existing
    ? await supabase
        .from("site_settings")
        .update({ resume_file_url: publicUrl.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
    : await supabase.from("site_settings").insert({ resume_file_url: publicUrl.publicUrl });

  if (updateError) {
    console.error("uploadResume: site_settings update failed:", updateError.message);
    return;
  }

  await logActivity({ action: "edit", targetType: "resume" });
  revalidatePath("/admin/resume");
  revalidatePath("/");
}
