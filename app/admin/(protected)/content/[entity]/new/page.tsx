import { notFound } from "next/navigation";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { EntityForm } from "@/components/admin/EntityForm";

export default function NewEntityPage({ params }: { params: { entity: string } }) {
  const config = getEntityConfig(params.entity);
  if (!config) notFound();

  return (
    <div>
      <span className="eyebrow">{config.pluralLabel}</span>
      <h1 className="mt-2 font-display text-2xl text-text-primary">New {config.label}</h1>
      <div className="mt-8">
        <EntityForm entitySlug={params.entity} />
      </div>
    </div>
  );
}
