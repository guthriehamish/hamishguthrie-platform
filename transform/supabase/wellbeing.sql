-- Transform With Me — private wellbeing data migration
-- Run after schema.sql in Supabase SQL Editor.

alter table public.transform_profiles add column if not exists equipment text[] not null default '{}';
alter table public.transform_profiles add column if not exists height_cm numeric check (height_cm is null or (height_cm between 100 and 250));

alter table public.transform_activities drop constraint if exists transform_activities_activity_type_check;
alter table public.transform_activities add constraint transform_activities_activity_type_check
  check (activity_type in ('workout','activity','walk','run','ride','hike','swim','gps'));

create table if not exists public.transform_food_log (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 eaten_date date not null default current_date,
 name text not null,
 food_group text not null,
 portion text not null,
 points integer not null check (points >= 0),
 created_at timestamptz not null default now()
);

create table if not exists public.transform_weigh_ins (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 weigh_date date not null default current_date,
 weight_kg numeric(5,2) not null check (weight_kg between 20 and 400),
 created_at timestamptz not null default now(),
 unique(user_id,weigh_date)
);

alter table public.transform_food_log enable row level security;
alter table public.transform_weigh_ins enable row level security;

drop policy if exists "transform_food_select_own" on public.transform_food_log;
drop policy if exists "transform_food_insert_own" on public.transform_food_log;
drop policy if exists "transform_food_update_own" on public.transform_food_log;
drop policy if exists "transform_food_delete_own" on public.transform_food_log;
create policy "transform_food_select_own" on public.transform_food_log for select using (auth.uid()=user_id);
create policy "transform_food_insert_own" on public.transform_food_log for insert with check (auth.uid()=user_id);
create policy "transform_food_update_own" on public.transform_food_log for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "transform_food_delete_own" on public.transform_food_log for delete using (auth.uid()=user_id);

drop policy if exists "transform_weight_select_own" on public.transform_weigh_ins;
drop policy if exists "transform_weight_insert_own" on public.transform_weigh_ins;
drop policy if exists "transform_weight_update_own" on public.transform_weigh_ins;
drop policy if exists "transform_weight_delete_own" on public.transform_weigh_ins;
create policy "transform_weight_select_own" on public.transform_weigh_ins for select using (auth.uid()=user_id);
create policy "transform_weight_insert_own" on public.transform_weigh_ins for insert with check (auth.uid()=user_id);
create policy "transform_weight_update_own" on public.transform_weigh_ins for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "transform_weight_delete_own" on public.transform_weigh_ins for delete using (auth.uid()=user_id);

create index if not exists transform_food_user_date_idx on public.transform_food_log(user_id,eaten_date desc);
create index if not exists transform_weight_user_date_idx on public.transform_weigh_ins(user_id,weigh_date desc);
