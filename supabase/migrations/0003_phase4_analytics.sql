-- Internal analytics, separate from Google Analytics. Populated by
-- app/api/track/route.ts (page views + CTA/social/resume events) via
-- components/analytics/AnalyticsBeacon.tsx.

create table visitor_sessions (
  id uuid primary key default gen_random_uuid(),
  first_seen timestamptz default now(),
  last_seen timestamptz default now(),
  country text,
  city text,
  browser text,
  device text,
  os text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references visitor_sessions(id) on delete cascade,
  event_type text not null, -- page_view, project_view, insight_view, resume_download,
                             -- whatsapp_click, email_click, github_click, linkedin_click,
                             -- contact_submit, cta_click
  target_type text,
  target_id text,
  page_path text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
create index idx_analytics_events_type on analytics_events(event_type);
create index idx_analytics_events_created on analytics_events(created_at desc);

alter table visitor_sessions enable row level security;
alter table analytics_events enable row level security;

-- Anonymous tracking writes are allowed (no PII beyond derived
-- geo/device/browser); reads are admin-only.
-- No auth for anonymous visitors, so ownership can't be enforced at the
-- row level here; the data itself (derived geo/device/browser only, no
-- PII) is low-sensitivity, which is why this is acceptable for a personal
-- portfolio's analytics rather than a system handling user accounts.
create policy "public insert visitor_sessions" on visitor_sessions for insert with check (true);
create policy "public update own session" on visitor_sessions for update using (true);
create policy "editors read visitor_sessions" on visitor_sessions for select using (has_editor_role());

create policy "public insert analytics_events" on analytics_events for insert with check (true);
create policy "editors read analytics_events" on analytics_events for select using (has_editor_role());
