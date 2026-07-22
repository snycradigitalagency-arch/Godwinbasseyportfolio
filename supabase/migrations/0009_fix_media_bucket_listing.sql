-- Correction to 0008: that policy was circular and changed nothing.
-- The `media` bucket is already `public: true`, so direct object URL
-- downloads work with no SELECT policy on storage.objects at all —
-- the SELECT policy only controls the `list()`/browse API, which
-- should be editor-only (public visitors never need to enumerate
-- the bucket, only fetch specific known URLs).
drop policy "public read media bucket" on storage.objects;
create policy "editors list media bucket" on storage.objects
  for select using (bucket_id = 'media' and has_editor_role());
