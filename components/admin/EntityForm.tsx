import { getEntityConfig } from "@/lib/admin/entity-configs";
import { createEntity, updateEntity } from "@/lib/admin/actions";

interface EntityFormProps {
  entitySlug: string;
  /** Existing row when editing; omit for create */
  initialValues?: Record<string, unknown>;
}

export function EntityForm({ entitySlug, initialValues }: EntityFormProps) {
  const config = getEntityConfig(entitySlug);
  if (!config) return <p className="text-error">Unknown content type.</p>;

  const isEditing = Boolean(initialValues?.id);
  const action = isEditing
    ? updateEntity.bind(null, entitySlug, String(initialValues!.id))
    : createEntity.bind(null, entitySlug);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      {config.fields.map((field) => {
        const value = initialValues?.[field.key];

        if (field.type === "boolean") {
          return (
            <label key={field.key} className="flex items-center gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                name={field.key}
                defaultChecked={Boolean(value)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "textarea") {
          return (
            <label key={field.key} className="flex flex-col gap-2 text-sm text-text-secondary">
              {field.label}
              <textarea
                name={field.key}
                defaultValue={value != null ? String(value) : ""}
                required={field.required}
                rows={4}
                className="rounded-md border border-border bg-card px-4 py-3 text-text-primary focus:border-accent"
              />
            </label>
          );
        }

        return (
          <label key={field.key} className="flex flex-col gap-2 text-sm text-text-secondary">
            {field.label}
            <input
              name={field.key}
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
              defaultValue={
                field.type === "tags" && Array.isArray(value)
                  ? value.join(", ")
                  : value != null
                  ? String(value)
                  : ""
              }
              placeholder={field.type === "tags" ? "Comma-separated" : undefined}
              required={field.required}
              className="rounded-md border border-border bg-card px-4 py-3 text-text-primary focus:border-accent"
            />
          </label>
        );
      })}

      <button
        type="submit"
        className="mt-2 self-start rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-accent-hover"
      >
        {isEditing ? `Save ${config.label}` : `Create ${config.label}`}
      </button>
    </form>
  );
}
