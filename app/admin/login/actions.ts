"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin/dashboard");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  await logActivity({ action: "login", targetType: "session" });
  redirect(next);
}

export async function signOut() {
  const supabase = createClient();
  await logActivity({ action: "logout", targetType: "session" });
  await supabase.auth.signOut();
  redirect("/admin/login");
}
