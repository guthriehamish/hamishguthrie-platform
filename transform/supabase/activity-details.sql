-- Transform activity detail migration
alter table public.transform_activities add column if not exists distance_km numeric(8,3) check (distance_km is null or distance_km >= 0);
alter table public.transform_activities add column if not exists elevation_gain_m integer check (elevation_gain_m is null or elevation_gain_m >= 0);
alter table public.transform_activities add column if not exists laps integer check (laps is null or laps >= 0);
alter table public.transform_activities add column if not exists intensity text check (intensity is null or intensity in ('easy','moderate','hard'));
alter table public.transform_activities add column if not exists metadata jsonb not null default '{}'::jsonb;
