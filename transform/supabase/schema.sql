-- Transform With Me — initial Supabase schema
-- Run in the Supabase SQL editor for hamishguthrie-platform.
-- RLS is enabled explicitly on every user-data table.

create extension if not exists pgcrypto;

create table if not exists public.transform_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  direction text not null default '',
  workout_index integer not null default 0 check (workout_index between 0 and 27),
  active_minutes integer not null default 0 check (active_minutes >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transform_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  activity_type text not null check (activity_type in ('workout','activity')),
  workout_number integer check (workout_number between 1 and 28),
  name text not null,
  minutes integer not null check (minutes > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.transform_daily_checkins (
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  healthy_meal boolean not null default false,
  avoided_snacks boolean not null default false,
  healthier_drinks boolean not null default false,
  fruit_veg boolean not null default false,
  hydration integer not null default 0 check (hydration >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, checkin_date)
);

create table if not exists public.transform_workout_mates (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  mate_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> mate_id),
  unique (requester_id, mate_id)
);

alter table public.transform_profiles enable row level security;
alter table public.transform_activities enable row level security;
alter table public.transform_daily_checkins enable row level security;
alter table public.transform_workout_mates enable row level security;

create policy "transform_profiles_select_own" on public.transform_profiles for select using (auth.uid() = user_id);
create policy "transform_profiles_insert_own" on public.transform_profiles for insert with check (auth.uid() = user_id);
create policy "transform_profiles_update_own" on public.transform_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transform_activities_select_own" on public.transform_activities for select using (auth.uid() = user_id);
create policy "transform_activities_insert_own" on public.transform_activities for insert with check (auth.uid() = user_id);
create policy "transform_activities_update_own" on public.transform_activities for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transform_activities_delete_own" on public.transform_activities for delete using (auth.uid() = user_id);

create policy "transform_checkins_select_own" on public.transform_daily_checkins for select using (auth.uid() = user_id);
create policy "transform_checkins_insert_own" on public.transform_daily_checkins for insert with check (auth.uid() = user_id);
create policy "transform_checkins_update_own" on public.transform_daily_checkins for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transform_mates_select_involved" on public.transform_workout_mates
  for select using (auth.uid() = requester_id or auth.uid() = mate_id);
create policy "transform_mates_request" on public.transform_workout_mates
  for insert with check (auth.uid() = requester_id);
create policy "transform_mates_update_involved" on public.transform_workout_mates
  for update using (auth.uid() = requester_id or auth.uid() = mate_id)
  with check (auth.uid() = requester_id or auth.uid() = mate_id);
create policy "transform_mates_delete_involved" on public.transform_workout_mates
  for delete using (auth.uid() = requester_id or auth.uid() = mate_id);

create index if not exists transform_activities_user_date_idx on public.transform_activities(user_id, activity_date desc);
create index if not exists transform_mates_requester_idx on public.transform_workout_mates(requester_id);
create index if not exists transform_mates_mate_idx on public.transform_workout_mates(mate_id);

create or replace function public.transform_create_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.transform_profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_transform_user_created on auth.users;
create trigger on_transform_user_created
  after insert on auth.users
  for each row execute procedure public.transform_create_profile();
