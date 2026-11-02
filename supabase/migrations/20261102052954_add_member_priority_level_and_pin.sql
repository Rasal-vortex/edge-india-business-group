alter table public.members
  add column priority text not null default 'medium',
  add column level text,
  add column is_pinned boolean not null default false;

alter table public.members
  add constraint members_priority_check check (priority in ('high', 'medium', 'low'));
