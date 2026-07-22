-- =========================================================
-- Godwin Bassey Portfolio — Phase 2 schema
-- Public content tables that power the live site.
-- Admin/auth/CMS-only tables (activity_logs, notifications,
-- theme_settings, content_revisions, etc.) land in Phase 3.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- enums ----------
create type project_status as enum ('live', 'in_progress', 'archived');
create type content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type skill_category as enum ('dev', 'design', 'ai_automation', 'strategy', 'tool');
create type timeline_type as enum ('experience', 'education');

-- ---------- profiles (minimal stub — full auth/invite flow is Phase 3) ----------
create type user_role as enum ('admin', 'editor');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'editor',
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

-- ---------- site_settings (singleton) ----------
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_headline text,
  hero_subheadline text,
  availability_status boolean default true,
  email text,
  phone text,
  whatsapp text,
  linkedin_url text,
  github_url text,
  location text,
  resume_file_url text,
  resume_download_count int default 0,
  updated_at timestamptz default now()
);

-- ---------- media ----------
create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  folder text,
  title text,
  alt_text text,
  caption text,
  description text,
  tags text[] default '{}',
  dominant_color text,
  blurhash text,
  width int,
  height int,
  aspect_ratio numeric,
  is_featured boolean default false,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ---------- projects ----------
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  overview text,
  challenge text,
  research text,
  process text,
  solution text,
  results text,
  tech_tags text[] default '{}',
  status project_status default 'in_progress',
  live_url text,
  github_url text,
  cover_image_id uuid references media(id),
  is_featured boolean default false,
  sort_order int default 0,
  content_status content_status default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_projects_slug on projects(slug);
create index idx_projects_status on projects(content_status);

create table project_gallery (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  media_id uuid references media(id) on delete cascade,
  caption text,
  sort_order int default 0
);
create index idx_project_gallery_project on project_gallery(project_id);

create table project_before_after (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  before_media_id uuid references media(id),
  after_media_id uuid references media(id),
  label text
);

-- ---------- testimonials ----------
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_title text,
  client_company text,
  client_avatar_id uuid references media(id),
  content text not null,
  project_id uuid references projects(id),
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- unified timeline: experience + education ----------
create table experience (
  id uuid primary key default gen_random_uuid(),
  role_title text not null,
  company_name text not null,
  company_logo_id uuid references media(id),
  start_date date not null,
  end_date date,
  description text,
  sort_order int default 0
);

create table education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text,
  field_of_study text,
  location text,
  start_date date not null,
  end_date date,
  description text,
  logo_id uuid references media(id),
  website_url text,
  sort_order int default 0
);

-- read-only convenience view merging both into one chronological feed
create view unified_timeline as
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

-- ---------- achievements & certifications ----------
create table achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  value text not null,
  suffix text,
  description text,
  icon_key text,
  is_featured boolean default true,
  sort_order int default 0
);

create table certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_url text,
  credential_id text,
  certificate_image_id uuid references media(id),
  description text,
  sort_order int default 0
);

-- ---------- services & skills ----------
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon_key text,
  price_note text,
  sort_order int default 0
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category skill_category not null,
  icon_key text,
  sort_order int default 0
);

-- ---------- insights (formerly "blog") ----------
create table insight_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table insights (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content jsonb,
  cover_image_id uuid references media(id),
  category_id uuid references insight_categories(id),
  reading_time_minutes int,
  content_status content_status default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  author_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_insights_slug on insights(slug);
create index idx_insights_status on insights(content_status);

create table insight_tags (
  insight_id uuid references insights(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (insight_id, tag_id)
);

-- ---------- contact messages ----------
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  body text not null,
  is_read boolean default false,
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- seo per-page overrides ----------
create table seo_meta (
  id uuid primary key default gen_random_uuid(),
  page_path text unique not null,
  meta_title text,
  meta_description text,
  og_image_id uuid references media(id),
  canonical_url text,
  no_index boolean default false
);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table site_settings enable row level security;
alter table media enable row level security;
alter table projects enable row level security;
alter table project_gallery enable row level security;
alter table project_before_after enable row level security;
alter table testimonials enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table achievements enable row level security;
alter table certifications enable row level security;
alter table services enable row level security;
alter table skills enable row level security;
alter table insight_categories enable row level security;
alter table tags enable row level security;
alter table insights enable row level security;
alter table insight_tags enable row level security;
alter table messages enable row level security;
alter table seo_meta enable row level security;

-- helper: is the current user admin/editor? (profiles table lands in Phase 3
-- with auth; until then this function is created but has nothing to match
-- against, so admin write policies simply won't grant access yet)
create or replace function has_editor_role()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- Public read policies — anonymous + authenticated can SELECT published content
create policy "public read site_settings" on site_settings for select using (true);
create policy "public read media" on media for select using (true);
create policy "public read projects" on projects for select using (content_status = 'published');
create policy "public read project_gallery" on project_gallery for select using (true);
create policy "public read project_before_after" on project_before_after for select using (true);
create policy "public read testimonials" on testimonials for select using (true);
create policy "public read experience" on experience for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read achievements" on achievements for select using (true);
create policy "public read certifications" on certifications for select using (true);
create policy "public read services" on services for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read insight_categories" on insight_categories for select using (true);
create policy "public read tags" on tags for select using (true);
create policy "public read insights" on insights for select using (content_status = 'published');
create policy "public read insight_tags" on insight_tags for select using (true);
create policy "public read seo_meta" on seo_meta for select using (true);

-- Contact form: anyone can insert, nobody but editors can read/update/delete
create policy "public insert messages" on messages for insert with check (true);
create policy "editors read messages" on messages for select using (has_editor_role());
create policy "editors update messages" on messages for update using (has_editor_role());
create policy "editors delete messages" on messages for delete using (has_editor_role());

-- Editor-only writes on every content table (policies added now, enforced
-- once `profiles` + auth exist in Phase 3)
create policy "editors write site_settings" on site_settings for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write media" on media for insert with check (has_editor_role());
create policy "editors delete media" on media for delete using (has_editor_role());
create policy "editors write projects" on projects for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write project_gallery" on project_gallery for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write project_before_after" on project_before_after for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write testimonials" on testimonials for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write experience" on experience for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write education" on education for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write achievements" on achievements for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write certifications" on certifications for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write services" on services for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write skills" on skills for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write insights" on insights for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write insight_tags" on insight_tags for all using (has_editor_role()) with check (has_editor_role());
create policy "editors write seo_meta" on seo_meta for all using (has_editor_role()) with check (has_editor_role());

-- =========================================================
-- Storage buckets
-- =========================================================
insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('resume', 'resume', true)
  on conflict (id) do nothing;

create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');
create policy "editors write media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and has_editor_role());
create policy "editors delete media bucket" on storage.objects
  for delete using (bucket_id = 'media' and has_editor_role());
