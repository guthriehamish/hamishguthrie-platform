-- Transform With Me authenticated member table permissions
-- Row Level Security policies remain responsible for restricting rows by member.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.transform_profiles to authenticated;
grant select, insert, update, delete on table public.transform_activities to authenticated;
grant select, insert, update, delete on table public.transform_daily_checkins to authenticated;
grant select, insert, update, delete on table public.transform_workout_mates to authenticated;
grant select, insert, update, delete on table public.transform_food_log to authenticated;
grant select, insert, update, delete on table public.transform_weigh_ins to authenticated;
