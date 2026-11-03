alter table public.members
  add column if not exists is_inside_core_member boolean not null default false;
