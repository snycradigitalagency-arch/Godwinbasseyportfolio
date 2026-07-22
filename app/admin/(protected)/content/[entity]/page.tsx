import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { EntityTable } from "@/components/admin/EntityTable";

export default function EntityListPage({ params }: { params: { entity: string } }) {
  const config = getEntityConfig(params.entity);
  if (!config) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">{config.pluralLabel}</span>
          <h1 className="mt-2 font-display text-2xl text-text-primary">{config.pluralLabel}</h1>
        </div>
        <Link
          href={`/admin/content/${params.entity}/new`}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-accent-hover"
        >
          New {config.label}
        </Link>
      </div>

      <div className="mt-8">
        <EntityTable entitySlug={params.entity} />
      </div>
    </div>
  );
}
