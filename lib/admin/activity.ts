import { createClient } from "@/lib/supabase/server";

interface LogActivityInput {
  action: "login" | "logout" | "create" | "edit" | "delete" | "publish" | "archive" | "media_upload";
  targetType: string;
  targetId?: string;
}

/**
 * Writes to activity_logs (see supabase/migrations/0002_phase3_auth.sql).
 * Fails silently — an audit log write should never block the actual
 * action the admin is trying to take.
 */
export async function logActivity({ action, targetType, targetId }: LogActivityInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("activity_logs").insert({
    user_id: user.id,
    action,
    target_type: targetType,
    target_id: targetId ?? null,
  });
}
