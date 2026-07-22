import { createClient } from "@/lib/supabase/server";
import { uploadResume } from "@/app/admin/(protected)/resume/actions";

export default async function ResumePage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("resume_file_url, resume_download_count")
    .single();

  return (
    <div>
      <span className="eyebrow">Site</span>
      <h1 className="mt-2 font-display text-2xl text-text-primary">Resume</h1>

      <div className="mt-8 max-w-lg rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-text-muted">Current file</p>
        {settings?.resume_file_url ? (
          <a
            href={settings.resume_file_url}
            target="_blank"
            className="mt-2 block text-accent hover:text-accent-hover"
          >
            View current resume →
          </a>
        ) : (
          <p className="mt-2 text-text-secondary">No resume uploaded yet.</p>
        )}

        <p className="mt-6 font-display text-3xl text-text-primary">
          {settings?.resume_download_count ?? 0}
        </p>
        <p className="text-xs text-text-muted">Downloads tracked</p>
      </div>

      <form action={uploadResume} className="mt-8 flex max-w-lg flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          Replace resume (PDF)
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            required
            className="rounded-md border border-border bg-card px-4 py-3 text-text-primary file:mr-4 file:rounded file:border-0 file:bg-accent file:px-4 file:py-2 file:text-white"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-accent-hover"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
