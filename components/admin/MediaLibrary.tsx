"use client";

import { ChangeEvent, useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { deleteMediaAction, recordMediaUpload } from "@/app/admin/(protected)/media/actions";

interface MediaItem {
  id: string;
  storage_path: string;
  file_name: string;
  alt_text: string | null;
  created_at: string;
}

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) continue;

      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);
      const record = await recordMediaUpload({
        storage_path: publicUrl.publicUrl,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });
      if (record) setItems((prev) => [record, ...prev]);
    }

    setUploading(false);
    e.target.value = "";
  }

  function handleDelete(id: string, storagePath: string) {
    if (!confirm("Delete this file?")) return;
    startTransition(async () => {
      await deleteMediaAction(id, storagePath);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  const filtered = items.filter((item) =>
    item.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search media…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-text-primary focus:border-accent"
        />
        <label className="cursor-pointer rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-accent-hover">
          {uploading ? "Uploading…" : "Upload Files"}
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-text-muted">No media yet — drag files in or use Upload Files.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="relative aspect-square w-full">
                <Image
                  src={item.storage_path}
                  alt={item.alt_text ?? item.file_name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between p-3">
                <p className="truncate text-xs text-text-secondary">{item.file_name}</p>
                <button
                  onClick={() => handleDelete(item.id, item.storage_path)}
                  disabled={isPending}
                  className="shrink-0 text-xs text-error/80 hover:text-error"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
