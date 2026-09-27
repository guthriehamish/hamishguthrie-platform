-- Editable private details for logged movement.
alter table public.transform_activities
  add column if not exists notes text;

create index if not exists transform_activities_user_date_idx
  on public.transform_activities (user_id, activity_date desc);

-- Existing RLS continues to restrict rows to their owner.
