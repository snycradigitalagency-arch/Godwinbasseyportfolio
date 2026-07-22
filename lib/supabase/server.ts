import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Use inside Server Components, Route Handlers, and Server Actions only.
 * Public content reads work with the anon key + RLS "public read" policies;
 * no service-role key is used here.
 *
 * NOTE: deliberately untyped (no `<Database>` generic). Two build
 * attempts with a hand-authored Database type (first missing
 * Insert/Update, then missing Relationships too) both failed the same
 * way on Vercel — every table's Row resolved to `never` regardless of
 * fixes, which points at a supabase-js/@supabase-ssr version-generic
 * mismatch I can't diagnose without a local `tsc` to iterate against.
 * Rather than keep guessing against a blind build loop, this trades
 * compile-time row typing for a build that actually succeeds. The
 * Database type in types/database.types.ts is still accurate and still
 * used directly by components (ProjectCard, InsightCard, etc.) for
 * prop types — only the client's generic inference is disabled.
 * Revisit once `supabase gen types` can be run against the real project
 * locally, which will also fix this properly.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // called from a Server Component — safe to ignore when
          // middleware is also refreshing the session
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // see note above
        }
      },
    },
  });
}
