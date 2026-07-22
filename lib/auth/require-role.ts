import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireEditor() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/admin/login?error=not_authorized");
  }

  return { user, profile };
}
