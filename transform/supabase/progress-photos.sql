create table if not exists public.transform_progress_photos (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 photo_date date not null default current_date,
 storage_path text not null,
 kind text not null default 'progress',
 weight_kg numeric,
 note text,
 created_at timestamptz not null default now()
);
alter table public.transform_progress_photos enable row level security;
create policy "own photos select" on public.transform_progress_photos for select to authenticated using (auth.uid()=user_id);
create policy "own photos insert" on public.transform_progress_photos for insert to authenticated with check (auth.uid()=user_id);
create policy "own photos delete" on public.transform_progress_photos for delete to authenticated using (auth.uid()=user_id);
grant select,insert,delete on public.transform_progress_photos to authenticated;
create index if not exists transform_progress_photos_user_date_idx on public.transform_progress_photos(user_id,photo_date desc);
