-- Phase 3 additions: audit trail + in-app notifications.
-- profiles/user_role already exist from 0001_phase2_schema.sql.

create type notification_priority as enum ('low', 'normal', 'high');

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  target_type text not null,
  target_id uuid,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);
create index idx_activity_logs_created on activity_logs(created_at desc);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text not null,
  title text not null,
  body text,
  priority notification_priority default 'normal',
  is_read boolean default false,
  created_at timestamptz default now()
);
create index idx_notifications_user on notifications(user_id, is_read);

alter table activity_logs enable row level security;
alter table notifications enable row level security;

create policy "editors read activity_logs" on activity_logs
  for select using (has_editor_role());
create policy "editors write activity_logs" on activity_logs
  for insert with check (has_editor_role());

create policy "users read own notifications" on notifications
  for select using (auth.uid() = user_id);
create policy "users update own notifications" on notifications
  for update using (auth.uid() = user_id);
create policy "system insert notifications" on notifications
  for insert with check (has_editor_role());

-- Auto-create a profiles row when someone signs up via Supabase Auth.
-- New users default to 'editor' — promote to 'admin' manually (see below).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'editor');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Convenience: promote a user to admin after they sign up via Supabase Auth.
-- Run manually once per new admin:
--   update profiles set role = 'admin' where id = '<their auth.users id>';
