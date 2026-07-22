/**
 * Centralizes Supabase env var resolution. Falls back to a placeholder
 * URL/key when the real ones aren't set yet — this matters specifically
 * because generateStaticParams (projects/insights) runs Supabase queries
 * during `next build`, and createServerClient() throws synchronously on
 * an invalid URL. A syntactically valid placeholder lets the build
 * complete (queries against it simply return an error, which every
 * query function here already handles by falling back to `[]`/`null`)
 * so the very first deploy succeeds even before env vars are configured
 * in the Vercel dashboard. Once the real values are set, this resolves
 * to them exactly as before.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
