import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { DeleteButton } from "@/components/admin/DeleteButton";

export async function EntityTable({ entitySlug }: { entitySlug: string }) {
  const config = getEntityConfig(entitySlug);
  if (!config) return <p className="text-error">Unknown content type.</p>;

  const supabase = createClient();
  const query = supabase.from(config.table as any).select("*");
  const { data: rows } = config.orderBy
    ? await query.order(config.orderBy, { ascending: true })
    : await query;

  const columns = config.fields.filter((f) => f.listColumn);

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-text-muted">No {config.pluralLabel.toLowerCase()} yet.</p>
        <Link
          href={`/admin/content/${entitySlug}/new`}
          className="mt-4 inline-block text-sm font-semibold text-accent hover:text-accent-hover"
        >
          Create the first one →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-bg-secondary text-xs uppercase tracking-eyebrow text-text-muted">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 font-medium">
                {col.label}
              </th>
            ))}
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row: Record<string, unknown>) => (
            <tr key={String(row.id)} className="bg-card transition-colors duration-150 hover:bg-[#1D2027]">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 text-text-secondary">
                  {formatCell(row[col.key])}
                </td>
              ))}
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-4">
                  <Link
                    href={`/admin/content/${entitySlug}/${row.id}`}
                    className="text-accent hover:text-accent-hover"
                  >
                    Edit
                  </Link>
                  <DeleteButton entitySlug={entitySlug} id={String(row.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
