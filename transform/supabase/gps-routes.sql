-- Transform With Me — saved GPS route traces
-- Route points are private member data protected by existing activity ownership.

alter table public.transform_activities
  add column if not exists route_points jsonb;

comment on column public.transform_activities.route_points is
  'Private GPS route trace for the activity. Array of lat/lng/time/accuracy points.';
