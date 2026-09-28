-- Transform Community: private member feed, comments, moderation and in-app announcements.
create table if not exists public.transform_community_settings (
  id boolean primary key default true check (id),
  comments_enabled boolean not null default true,
  moderated_posts boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.transform_community_settings(id) values(true) on conflict do nothing;

create table if not exists public.transform_community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 3000),
  status text not null default 'published' check (status in ('pending','published','hidden')),
  comments_closed boolean not null default false,
  is_announcement boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.transform_community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.transform_community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.transform_moderator_notices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 1000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.transform_community_settings enable row level security;
alter table public.transform_community_posts enable row level security;
alter table public.transform_community_comments enable row level security;
alter table public.transform_moderator_notices enable row level security;

-- All community reads/writes are gated by active membership.
create or replace function public.transform_member_active()
returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.transform_profiles where user_id=auth.uid() and not coalesce(is_blocked,false));
$$;

drop policy if exists "members read community settings" on public.transform_community_settings;
create policy "members read community settings" on public.transform_community_settings for select to authenticated using (public.transform_member_active());
drop policy if exists "admins manage community settings" on public.transform_community_settings;
create policy "admins manage community settings" on public.transform_community_settings for all to authenticated using (public.is_transform_admin()) with check (public.is_transform_admin());

drop policy if exists "members read published or own posts" on public.transform_community_posts;
create policy "members read published or own posts" on public.transform_community_posts for select to authenticated
 using (public.transform_member_active() and (status='published' or user_id=auth.uid() or public.is_transform_admin()));
drop policy if exists "members create posts" on public.transform_community_posts;
create policy "members create posts" on public.transform_community_posts for insert to authenticated
 with check (public.transform_member_active() and user_id=auth.uid() and not is_announcement);
drop policy if exists "owners or admins update posts" on public.transform_community_posts;
create policy "owners or admins update posts" on public.transform_community_posts for update to authenticated
 using (public.transform_member_active() and (user_id=auth.uid() or public.is_transform_admin()))
 with check (public.transform_member_active() and (user_id=auth.uid() or public.is_transform_admin()));
drop policy if exists "owners or admins delete posts" on public.transform_community_posts;
create policy "owners or admins delete posts" on public.transform_community_posts for delete to authenticated
 using (public.transform_member_active() and (user_id=auth.uid() or public.is_transform_admin()));

drop policy if exists "members read visible comments" on public.transform_community_comments;
create policy "members read visible comments" on public.transform_community_comments for select to authenticated
 using (public.transform_member_active() and (not is_hidden or user_id=auth.uid() or public.is_transform_admin()));
drop policy if exists "members create comments" on public.transform_community_comments;
create policy "members create comments" on public.transform_community_comments for insert to authenticated
 with check (public.transform_member_active() and user_id=auth.uid() and exists(
   select 1 from public.transform_community_posts p, public.transform_community_settings s
   where p.id=post_id and p.status='published' and not p.comments_closed and s.id=true and s.comments_enabled
 ));
drop policy if exists "owners or admins delete comments" on public.transform_community_comments;
create policy "owners or admins delete comments" on public.transform_community_comments for delete to authenticated
 using (public.transform_member_active() and (user_id=auth.uid() or public.is_transform_admin()));
drop policy if exists "admins update comments" on public.transform_community_comments;
create policy "admins update comments" on public.transform_community_comments for update to authenticated
 using (public.is_transform_admin()) with check (public.is_transform_admin());

drop policy if exists "members read own notices" on public.transform_moderator_notices;
create policy "members read own notices" on public.transform_moderator_notices for select to authenticated using (user_id=auth.uid() or public.is_transform_admin());
drop policy if exists "members mark own notices read" on public.transform_moderator_notices;
create policy "members mark own notices read" on public.transform_moderator_notices for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
drop policy if exists "admins create notices" on public.transform_moderator_notices;
create policy "admins create notices" on public.transform_moderator_notices for insert to authenticated with check (public.is_transform_admin());

-- Member-facing feed includes only display names; no email/contact/private tracking data.
create or replace function public.transform_community_feed()
returns table(id uuid,user_id uuid,display_name text,body text,status text,comments_closed boolean,is_announcement boolean,created_at timestamptz)
language sql stable security definer set search_path=public as $$
 select p.id,p.user_id,coalesce(pr.display_name,'Transform member'),p.body,p.status,p.comments_closed,p.is_announcement,p.created_at
 from public.transform_community_posts p left join public.transform_profiles pr on pr.user_id=p.user_id
 where public.transform_member_active() and (p.status='published' or p.user_id=auth.uid() or public.is_transform_admin())
 order by p.is_announcement desc,p.created_at desc limit 100;
$$;

create or replace function public.transform_create_community_post(post_body text)
returns uuid language plpgsql security definer set search_path=public as $$
declare new_id uuid; moderated boolean;
begin
 if not public.transform_member_active() then raise exception 'not authorized'; end if;
 select moderated_posts into moderated from public.transform_community_settings where id=true;
 insert into public.transform_community_posts(user_id,body,status) values(auth.uid(),trim(post_body),case when moderated then 'pending' else 'published' end) returning id into new_id;
 return new_id;
end $$;

grant select,insert,update,delete on public.transform_community_posts to authenticated;
grant select,insert,update,delete on public.transform_community_comments to authenticated;
grant select,insert,update on public.transform_moderator_notices to authenticated;
grant select,update on public.transform_community_settings to authenticated;
grant execute on function public.transform_member_active() to authenticated;
grant execute on function public.transform_community_feed() to authenticated;
grant execute on function public.transform_create_community_post(text) to authenticated;
