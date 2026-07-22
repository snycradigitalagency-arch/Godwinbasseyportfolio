"use client";

import { useTransition } from "react";
import { deleteEntity } from "@/lib/admin/actions";

export function DeleteButton({ entitySlug, id }: { entitySlug: string; id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this item? This can't be undone.")) return;
    startTransition(() => {
      deleteEntity(entitySlug, id);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-error/80 hover:text-error disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
