-- The "editors write X" policies used FOR ALL, which silently added a
-- second permissive SELECT policy alongside "public read X" on every
-- content table — evaluated on every single read query. Splitting into
-- insert/update/delete-only policies removes that duplication. Where
-- editors legitimately need to see draft content (projects, insights),
-- that's folded into the single public-read policy's USING clause
-- instead of a second policy, so there's still only one SELECT policy
-- per table.

-- site_settings
drop policy "editors write site_settings" on site_settings;
create policy "editors insert site_settings" on site_settings for insert with check (has_editor_role());
create policy "editors update site_settings" on site_settings for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete site_settings" on site_settings for delete using (has_editor_role());

-- projects (fold editor draft-visibility into the read policy itself)
drop policy "editors write projects" on projects;
drop policy "public read projects" on projects;
create policy "read projects" on projects for select using (content_status = 'published' or has_editor_role());
create policy "editors insert projects" on projects for insert with check (has_editor_role());
create policy "editors update projects" on projects for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete projects" on projects for delete using (has_editor_role());

create policy "editors insert project_gallery" on project_gallery for insert with check (has_editor_role());
create policy "editors update project_gallery" on project_gallery for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete project_gallery" on project_gallery for delete using (has_editor_role());
drop policy "editors write project_gallery" on project_gallery;

create policy "editors insert project_before_after" on project_before_after for insert with check (has_editor_role());
create policy "editors update project_before_after" on project_before_after for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete project_before_after" on project_before_after for delete using (has_editor_role());
drop policy "editors write project_before_after" on project_before_after;

create policy "editors insert testimonials" on testimonials for insert with check (has_editor_role());
create policy "editors update testimonials" on testimonials for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete testimonials" on testimonials for delete using (has_editor_role());
drop policy "editors write testimonials" on testimonials;

create policy "editors insert experience" on experience for insert with check (has_editor_role());
create policy "editors update experience" on experience for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete experience" on experience for delete using (has_editor_role());
drop policy "editors write experience" on experience;

create policy "editors insert education" on education for insert with check (has_editor_role());
create policy "editors update education" on education for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete education" on education for delete using (has_editor_role());
drop policy "editors write education" on education;

create policy "editors insert achievements" on achievements for insert with check (has_editor_role());
create policy "editors update achievements" on achievements for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete achievements" on achievements for delete using (has_editor_role());
drop policy "editors write achievements" on achievements;

create policy "editors insert certifications" on certifications for insert with check (has_editor_role());
create policy "editors update certifications" on certifications for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete certifications" on certifications for delete using (has_editor_role());
drop policy "editors write certifications" on certifications;

create policy "editors insert services" on services for insert with check (has_editor_role());
create policy "editors update services" on services for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete services" on services for delete using (has_editor_role());
drop policy "editors write services" on services;

create policy "editors insert skills" on skills for insert with check (has_editor_role());
create policy "editors update skills" on skills for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete skills" on skills for delete using (has_editor_role());
drop policy "editors write skills" on skills;

create policy "editors insert insight_tags" on insight_tags for insert with check (has_editor_role());
create policy "editors update insight_tags" on insight_tags for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete insight_tags" on insight_tags for delete using (has_editor_role());
drop policy "editors write insight_tags" on insight_tags;

-- insights (same draft-visibility fold as projects)
drop policy "editors write insights" on insights;
drop policy "public read insights" on insights;
create policy "read insights" on insights for select using (content_status = 'published' or has_editor_role());
create policy "editors insert insights" on insights for insert with check (has_editor_role());
create policy "editors update insights" on insights for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete insights" on insights for delete using (has_editor_role());

create policy "editors insert seo_meta" on seo_meta for insert with check (has_editor_role());
create policy "editors update seo_meta" on seo_meta for update using (has_editor_role()) with check (has_editor_role());
create policy "editors delete seo_meta" on seo_meta for delete using (has_editor_role());
drop policy "editors write seo_meta" on seo_meta;

-- auth_rls_initplan: wrap auth.uid() so it's evaluated once per query,
-- not re-evaluated per row.
drop policy "users read own profile" on profiles;
drop policy "users update own profile" on profiles;
create policy "users read own profile" on profiles for select using ((select auth.uid()) = id);
create policy "users update own profile" on profiles for update using ((select auth.uid()) = id);

drop policy "users read own notifications" on notifications;
drop policy "users update own notifications" on notifications;
create policy "users read own notifications" on notifications for select using ((select auth.uid()) = user_id);
create policy "users update own notifications" on notifications for update using ((select auth.uid()) = user_id);
