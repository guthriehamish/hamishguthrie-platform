-- Additive migration: allow a verified Transform administrator to mark a member
-- as requiring a password change. The caller identity is derived from auth.uid().
-- This avoids granting broad table UPDATE privileges to the Worker.
create or replace function public.transform_admin_require_password_change(target_user uuid)
returns void
language plpgsql
security definer
set search_path=public
as $$
begin
  if not public.is_transform_admin() then
    raise exception 'not authorized';
  end if;
  if target_user = auth.uid() then
    raise exception 'cannot reset your own administrator password here';
  end if;
  if not exists (select 1 from public.transform_profiles where user_id=target_user) then
    raise exception 'participant not found';
  end if;
  update public.transform_profiles
     set must_change_password=true
   where user_id=target_user;
end
$$;

revoke all on function public.transform_admin_require_password_change(uuid) from public;
grant execute on function public.transform_admin_require_password_change(uuid) to authenticated;
