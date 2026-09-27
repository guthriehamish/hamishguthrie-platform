-- Transform With Me — persist member workout preferences
alter table public.transform_profiles
  add column if not exists auto_progress boolean not null default true;
