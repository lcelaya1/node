-- Bucket + RLS policies for profile avatars upload/update/delete.
-- Supports both object naming strategies used by the app:
--   1) <auth.uid()>/avatar.jpg
--   2) <auth.uid()>.jpg

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Authenticated users upload own avatars" on storage.objects;
create policy "Authenticated users upload own avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or name = auth.uid()::text || '.jpg'
  )
);

drop policy if exists "Authenticated users update own avatars" on storage.objects;
create policy "Authenticated users update own avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or name = auth.uid()::text || '.jpg'
  )
)
with check (
  bucket_id = 'avatars'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or name = auth.uid()::text || '.jpg'
  )
);

drop policy if exists "Authenticated users delete own avatars" on storage.objects;
create policy "Authenticated users delete own avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or name = auth.uid()::text || '.jpg'
  )
);

drop policy if exists "Public can read avatars" on storage.objects;
create policy "Public can read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');
