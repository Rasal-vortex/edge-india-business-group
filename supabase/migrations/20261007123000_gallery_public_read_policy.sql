drop policy "Public can view published gallery items" on public.gallery_items;
drop policy "Admins can view all gallery items" on public.gallery_items;

create policy "Public and admins can view gallery items"
  on public.gallery_items for select to anon, authenticated
  using (
    is_published
    or (
      (select auth.uid()) is not null
      and exists (
        select 1 from public.admin_users
        where admin_users.user_id = (select auth.uid())
      )
    )
  );
