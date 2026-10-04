create policy "Admins can view all members"
on public.members
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-photos',
  'member-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Public can view member photos"
on storage.objects
for select
to public
using (bucket_id = 'member-photos');

create policy "Admins can upload member photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'member-photos'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Admins can update member photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'member-photos'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'member-photos'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Admins can delete member photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'member-photos'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);
