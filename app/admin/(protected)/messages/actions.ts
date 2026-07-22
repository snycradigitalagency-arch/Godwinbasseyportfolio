"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/lib/auth/require-role";
import { logActivity } from "@/lib/admin/activity";

export async function markMessageRead(id: string, isRead: boolean) {
  await requireEditor();
  const supabase = createClient();
  await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireEditor();
  const supabase = createClient();
  await supabase.from("messages").delete().eq("id", id);
  await logActivity({ action: "delete", targetType: "messages", targetId: id });
  revalidatePath("/admin/messages");
}
