alter table public.members
  add column if not exists username text,
  add column if not exists company_logo_url text,
  add column if not exists personal_instagram_url text,
  add column if not exists company_instagram_url text,
  add column if not exists office_phone text,
  add column if not exists map_url text;

do $$
declare
  member_row record;
  base_username text;
  candidate text;
  suffix integer;
begin
  for member_row in
    select id, name
    from public.members
    where username is null or btrim(username) = ''
    order by created_at nulls first, id
  loop
    base_username := trim(both '-' from regexp_replace(lower(coalesce(member_row.name, '')), '[^a-z0-9]+', '-', 'g'));
    if base_username = '' then base_username := 'member'; end if;
    candidate := base_username;
    suffix := 2;

    while exists (
      select 1 from public.members
      where lower(username) = lower(candidate) and id <> member_row.id
    ) loop
      candidate := base_username || '-' || suffix::text;
      suffix := suffix + 1;
    end loop;

    update public.members set username = candidate where id = member_row.id;
  end loop;
end $$;

alter table public.members alter column username set not null;
create unique index if not exists members_username_lower_unique on public.members (lower(username));
