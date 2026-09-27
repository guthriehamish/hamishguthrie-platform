insert into storage.buckets (id,name,public,file_size_limit)
values ('transform-progress-photos','transform-progress-photos',false,10485760)
on conflict (id) do update set public=false;

create policy "progress photo file read" on storage.objects
for select to authenticated
using (bucket_id = 'transform-progress-photos' and owner_id = auth.uid()::text);

create policy "progress photo file add" on storage.objects
for insert to authenticated
with check (bucket_id = 'transform-progress-photos' and owner_id = auth.uid()::text);

create policy "progress photo file remove" on storage.objects
for delete to authenticated
using (bucket_id = 'transform-progress-photos' and owner_id = auth.uid()::text);
