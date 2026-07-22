-- Fixes for issues surfaced by the Supabase security advisor after
-- 0001–0003 were applied to the live project.

-- 1. unified_timeline was implicitly running with the view creator's
--    privileges rather than the querying user's. Both underlying
--    tables are public-read anyway, so this wasn't exploitable, but
--    security_invoker is the correct, explicit behavior going forward.
drop view if exists unified_timeline;
create view unified_timeline with (security_invoker = true) as
  select id, 'experience'::timeline_type as type, role_title as title,
         company_name as subtitle, description, start_date, end_date,
         company_logo_id as logo_id, sort_order
  from experience
  union all
  select id, 'education'::timeline_type as type, degree as title,
         school as subtitle, description, start_date, end_date,
         logo_id, sort_order
  from education
  order by start_date desc;

-- 2. Pin search_path on SECURITY DEFINER functions so they can't be
--    tricked by a malicious search_path into resolving objects from
--    an unexpected schema.
alter function has_editor_role() set search_path = public, pg_temp;
alter function handle_new_user() set search_path = public, pg_temp;

-- 3. handle_new_user should only ever run via the auth.users trigger,
--    never as a direct RPC call — revoke public/anon/authenticated
--    execute entirely (the trigger still fires; it doesn't need the
--    caller to hold EXECUTE).
revoke execute on function handle_new_user() from public, anon, authenticated;

-- 4. has_editor_role() is used inside RLS policies, so authenticated
--    still needs EXECUTE for editor-gated writes to evaluate — but
--    anon never needs to run it (anon writes should simply be denied),
--    so drop its exposure as a directly-callable anonymous RPC.
revoke execute on function has_editor_role() from public, anon;
grant execute on function has_editor_role() to authenticated;

-- 5. Public buckets serve files via direct URL without needing a
--    SELECT policy on storage.objects — that policy was only adding
--    the ability to *list/enumerate* every file in the bucket via the
--    API, which the app never does (Media Library lists from the
--    `media` table, not by listing storage.objects). Removing it
--    closes that off without affecting image loading.
drop policy if exists "public read media bucket" on storage.objects;
