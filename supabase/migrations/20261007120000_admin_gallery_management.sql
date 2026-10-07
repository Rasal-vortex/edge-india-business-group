create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  image_path text,
  instagram_url text,
  alt_text text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint gallery_items_has_media check (
    nullif(btrim(image_url), '') is not null
    or nullif(btrim(instagram_url), '') is not null
  ),
  constraint gallery_items_instagram_url check (
    instagram_url is null
    or instagram_url ~* '^https://(www\.)?instagram\.com/(p|reel|tv)/[A-Za-z0-9_-]+/?([?#].*)?$'
  )
);

create index gallery_items_public_order_idx
  on public.gallery_items (is_published, display_order, created_at);

alter table public.gallery_items enable row level security;

grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;

create policy "Public can view published gallery items"
  on public.gallery_items for select to anon, authenticated
  using (is_published);

create policy "Admins can view all gallery items"
  on public.gallery_items for select to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy "Admins can insert gallery items"
  on public.gallery_items for insert to authenticated
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy "Admins can update gallery items"
  on public.gallery_items for update to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy "Admins can delete gallery items"
  on public.gallery_items for delete to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-photos',
  'gallery-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Admins can upload gallery photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'gallery-photos'
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

create policy "Admins can delete gallery photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'gallery-photos'
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

insert into public.gallery_items (instagram_url, display_order, is_published)
values
  ('https://www.instagram.com/p/DdjPR9kv4KS/', 0, true),
  ('https://www.instagram.com/p/DdvRlTqI84k/', 1, true),
  ('https://www.instagram.com/p/Dd1I3WfP4zZ/', 2, true),
  ('https://www.instagram.com/p/Ddq45uEhOl_/', 3, true),
  ('https://www.instagram.com/p/DeCJwBLuqDO/', 4, true),
  ('https://www.instagram.com/p/DeCdVPxP_9z/', 5, true),
  ('https://www.instagram.com/p/Dd893jyMtsZ/', 6, true),
  ('https://www.instagram.com/p/Dd-4kdWSb94/', 7, true),
  ('https://www.instagram.com/p/DdI-Ca1RFKJ/', 8, true),
  ('https://www.instagram.com/p/Dd9MUyYoFtb/', 9, true),
  ('https://www.instagram.com/reel/DdBvlZOyyjq/', 10, true);
