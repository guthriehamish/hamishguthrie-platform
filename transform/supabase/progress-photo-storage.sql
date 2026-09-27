insert into storage.buckets (id,name,public,file_size_limit)
values ('transform-progress-photos','transform-progress-photos',false,10485760)
on conflict (id) do update set public=false;
