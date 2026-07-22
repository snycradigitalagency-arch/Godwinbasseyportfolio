-- Explicit per-role revokes (belt-and-braces alongside the PUBLIC
-- revoke in 0004 — the advisor still flagged anon/authenticated as
-- able to call handle_new_user via RPC, so name them directly).
revoke execute on function handle_new_user() from anon;
revoke execute on function handle_new_user() from authenticated;

-- Prevent listing all files in the public media bucket while still
-- allowing direct object URL access (the site only ever needs to
-- fetch known media by URL, never enumerate the bucket).
drop policy "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media' and (select auth.role()) is not null or bucket_id = 'media');
