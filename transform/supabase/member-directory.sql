-- Transform With Me — safe member discovery
-- Exposes only member ID and display name to signed-in members.
-- Private profile fields remain protected by transform_profiles RLS.

create or replace function public.transform_member_directory()
returns table (user_id uuid, display_name text)
language sql
security definer
set search_path = public
stable
as $$
  select p.user_id, p.display_name
  from public.transform_profiles p
  where p.user_id <> auth.uid()
    and length(trim(p.display_name)) > 0
  order by lower(p.display_name);
$$;

revoke all on function public.transform_member_directory() from public;
grant execute on function public.transform_member_directory() to authenticated;
