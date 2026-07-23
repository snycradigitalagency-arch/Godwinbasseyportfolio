import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * For anonymous, public-read data only (site content gated by each
 * table's "public read" RLS policy — projects, insights, services,
 * etc.). This client never touches next/headers' cookies(), so it's
 * safe to call from anywhere, including generateStaticParams and
 * generateMetadata, which run at build time with no request in scope.
 * Calling cookies() there throws "cookies was called outside a
 * request scope" — this client exists specifically so lib/queries/*
 * and lib/seo.ts never hit that.
 *
 * For anything that needs to know the signed-in user (admin auth,
 * mutations, requireEditor), use lib/supabase/server.ts instead — that
 * one is cookie-based and must only run inside an actual request,
 * which is exactly what every admin route already guarantees (they're
 * behind auth and never statically generated).
 */
let client: ReturnType<typeof createSupabaseClient> | null = null;

export function createPublicClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}
