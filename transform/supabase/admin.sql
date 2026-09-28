-- Transform administrator controls.
-- Admin rights are server-side and cannot be self-assigned by a member.
alter table public.transform_profiles
  add column if not exists is_admin boolean not null default false,
  add column if not exists is_blocked boolean not null default false,
  add column if not exists blocked_at timestamptz,
  add column if not exists blocked_reason text,
  add column if not exists must_change_password boolean not null default false;

create or replace function public.is_transform_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce((select is_admin from public.transform_profiles where user_id=auth.uid()),false);
$$;

create or replace function public.transform_admin_participants()
returns table(user_id uuid, display_name text, created_at timestamptz, is_blocked boolean, blocked_at timestamptz)
language sql stable security definer set search_path=public as $$
  select p.user_id,p.display_name,p.created_at,p.is_blocked,p.blocked_at
  from public.transform_profiles p
  where public.is_transform_admin()
  order by p.created_at desc;
$$;

create or replace function public.transform_admin_set_blocked(target_user uuid, blocked boolean, reason text default null)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.is_transform_admin() then raise exception 'not authorized'; end if;
  if target_user=auth.uid() then raise exception 'cannot block your own administrator account'; end if;
  update public.transform_profiles set is_blocked=blocked, blocked_at=case when blocked then now() else null end,
    blocked_reason=case when blocked then nullif(trim(reason),'') else null end where user_id=target_user;
end $$;

-- Blocked accounts cannot pass the member-app gate.
create or replace function public.transform_access_status()
returns table(is_admin boolean,is_blocked boolean,must_change_password boolean)
language sql stable security definer set search_path=public as $$
 select coalesce(p.is_admin,false),coalesce(p.is_blocked,false),coalesce(p.must_change_password,false) from public.transform_profiles p where p.user_id=auth.uid();
$$;

grant execute on function public.is_transform_admin() to authenticated;
grant execute on function public.transform_admin_participants() to authenticated;
grant execute on function public.transform_admin_set_blocked(uuid,boolean,text) to authenticated;
grant execute on function public.transform_access_status() to authenticated;

-- Bootstrap the owner account only. Safe to rerun.
update public.transform_profiles p set is_admin=true
from auth.users u where p.user_id=u.id and lower(u.email)=lower('guthrieh@gmail.com');


-- Called only after the signed-in member has successfully changed their own password.
create or replace function public.transform_password_change_complete()
returns void language plpgsql security definer set search_path=public as $$
begin
 update public.transform_profiles set must_change_password=false where user_id=auth.uid();
end $$;
grant execute on function public.transform_password_change_complete() to authenticated;
