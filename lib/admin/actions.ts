"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/lib/auth/require-role";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { logActivity } from "@/lib/admin/activity";

// NOTE: `config.table` is a runtime string, so Supabase's generated
// client types (which expect a literal keyof Database["public"]["Tables"])
// can't validate it statically — `as any` on `.from()` calls below is a
// deliberate, narrow trade-off for the generic-CRUD pattern, not a type
// safety gap in the payload itself (each field is still validated against
// the entity's own field config in buildPayload).

function parseFormValue(raw: FormDataEntryValue | null, type: string) {
  if (type === "boolean") return raw === "on";
  if (type === "number") return raw === "" || raw === null ? null : Number(raw);
  if (type === "tags") {
    return String(raw ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (raw === "") return null;
  return raw;
}

function buildPayload(entitySlug: string, formData: FormData) {
  const config = getEntityConfig(entitySlug);
  if (!config) throw new Error(`Unknown entity: ${entitySlug}`);

  const payload: Record<string, unknown> = {};
  for (const field of config.fields) {
    payload[field.key] = parseFormValue(formData.get(field.key), field.type);
  }
  return { config, payload };
}

export async function createEntity(entitySlug: string, formData: FormData) {
  const { profile } = await requireEditor();
  const { config, payload } = buildPayload(entitySlug, formData);

  const supabase = createClient();
  const { data, error } = await supabase.from(config.table as any).insert(payload).select().single();

  if (error) {
    return { error: error.message };
  }

  await logActivity({ action: "create", targetType: config.table, targetId: data.id });
  revalidatePath(`/admin/content/${entitySlug}`);
  redirect(`/admin/content/${entitySlug}`);
}

export async function updateEntity(entitySlug: string, id: string, formData: FormData) {
  await requireEditor();
  const { config, payload } = buildPayload(entitySlug, formData);

  const supabase = createClient();
  const { error } = await supabase.from(config.table as any).update(payload).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logActivity({ action: "edit", targetType: config.table, targetId: id });
  revalidatePath(`/admin/content/${entitySlug}`);
  redirect(`/admin/content/${entitySlug}`);
}

export async function deleteEntity(entitySlug: string, id: string) {
  await requireEditor();
  const config = getEntityConfig(entitySlug);
  if (!config) throw new Error(`Unknown entity: ${entitySlug}`);

  const supabase = createClient();
  const { error } = await supabase.from(config.table as any).delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }

  await logActivity({ action: "delete", targetType: config.table, targetId: id });
  revalidatePath(`/admin/content/${entitySlug}`);
}
