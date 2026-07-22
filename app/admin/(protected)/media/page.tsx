import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function MediaPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("media")
    .select("id, storage_path, file_name, alt_text, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <span className="eyebrow">Site</span>
      <h1 className="mt-2 font-display text-2xl text-text-primary">Media Library</h1>
      <div className="mt-8">
        <MediaLibrary initialItems={items ?? []} />
      </div>
    </div>
  );
}
