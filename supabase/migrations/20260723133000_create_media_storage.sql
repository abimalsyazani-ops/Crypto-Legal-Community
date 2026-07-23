insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read media" on storage.objects;
create policy "public can read media" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "staff can upload media" on storage.objects;
create policy "staff can upload media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.current_user_is_staff());

drop policy if exists "staff can update media" on storage.objects;
create policy "staff can update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.current_user_is_staff())
  with check (bucket_id = 'media' and public.current_user_is_staff());

drop policy if exists "staff can delete media" on storage.objects;
create policy "staff can delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.current_user_is_staff());
