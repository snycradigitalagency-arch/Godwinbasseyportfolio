import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { EntityForm } from "@/components/admin/EntityForm";

export default async function EditEntityPage({
  params,
}: {
  params: { entity: string; id: string };
}) {
  const config = getEntityConfig(params.entity);
  if (!config) notFound();

  const supabase = createClient();
  const { data: row } = await supabase.from(config.table as any).select("*").eq("id", params.id).single();
  if (!row) notFound();

  return (
    <div>
      <span className="eyebrow">{config.pluralLabel}</span>
      <h1 className="mt-2 font-display text-2xl text-text-primary">
        Edit {row[config.titleField] as string}
      </h1>
      <div className="mt-8">
        <EntityForm entitySlug={params.entity} initialValues={row} />
      </div>
    </div>
  );
}
