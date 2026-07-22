"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/lib/auth/require-role";
import { logActivity } from "@/lib/admin/activity";

export async function recordMediaUpload(input: {
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
}) {
  const { user } = await requireEditor();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("media")
    .insert({ ...input, uploaded_by: user.id })
    .select()
    .single();

  if (error) return null;

  await logActivity({ action: "media_upload", targetType: "media", targetId: data.id });
  revalidatePath("/admin/media");
  return data;
}

export async function deleteMediaAction(id: string, storagePath: string) {
  await requireEditor();
  const supabase = createClient();

  // storage_path is stored as the public URL; derive the object key for removal.
  const key = storagePath.split("/media/").pop();
  if (key) {
    await supabase.storage.from("media").remove([key]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { error: error.message };

  await logActivity({ action: "delete", targetType: "media", targetId: id });
  revalidatePath("/admin/media");
}
