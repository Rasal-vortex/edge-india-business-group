alter table public.members
  add column chapter_id uuid
  references public.chapters (id)
  on delete restrict;

create index members_chapter_id_idx
  on public.members (chapter_id)
  where chapter_id is not null;

comment on column public.members.chapter_id is
  'Chapter assigned to this member; null for existing profiles until an admin assigns one.';
