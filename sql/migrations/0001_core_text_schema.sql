-- Core text schema: works, sections, passages, tokens, source_editions
-- All tables use shared-content RLS: select for authenticated using (true)
-- No user_id columns — this is scholarly content, not per-user data

-- ---------------------------------------------------------------------------
-- source_editions
-- ---------------------------------------------------------------------------
create table source_editions (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        unique not null,
  label       text        not null,
  tradition   text,
  url         text,
  note        text,
  created_at  timestamptz default now()
);

alter table source_editions enable row level security;

create policy source_editions_select on source_editions
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- works
-- ---------------------------------------------------------------------------
create table works (
  id             uuid        primary key default gen_random_uuid(),
  slug           text        unique not null,
  title          text        not null,
  original_title text,
  author         text        not null,
  tradition      text,
  language       text        not null default 'Ancient Greek',
  description    text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index works_slug_idx on works (slug);

alter table works enable row level security;

create policy works_select on works
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- sections
-- ---------------------------------------------------------------------------
create table sections (
  id             uuid        primary key default gen_random_uuid(),
  work_id        uuid        not null references works (id),
  slug           text        not null,
  title          text        not null,
  sequence       int         not null,
  citation_label text,
  created_at     timestamptz default now()
);

create index sections_work_seq_idx on sections (work_id, sequence);

alter table sections enable row level security;

create policy sections_select on sections
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- passages
-- ---------------------------------------------------------------------------
create table passages (
  id                 uuid        primary key default gen_random_uuid(),
  work_id            uuid        not null references works (id),
  section_id         uuid        references sections (id),
  source_edition_id  uuid        references source_editions (id),
  citation_ref       text        not null,
  sequence           int         not null,
  greek_text         text        not null,
  normalized_greek   text,
  source_note        text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create index passages_work_seq_idx   on passages (work_id, sequence);
create index passages_citation_idx   on passages (citation_ref);
create index passages_section_idx    on passages (section_id);

alter table passages enable row level security;

create policy passages_select on passages
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- tokens
-- ---------------------------------------------------------------------------
create table tokens (
  id               uuid        primary key default gen_random_uuid(),
  passage_id       uuid        not null references passages (id),
  token_index      int         not null,
  surface          text        not null,
  lemma            text,
  transliteration  text,
  morphology       text,
  literal_gloss    text,
  note             text,
  created_at       timestamptz default now()
);

create index tokens_passage_idx on tokens (passage_id, token_index);

alter table tokens enable row level security;

create policy tokens_select on tokens
  for select to authenticated using (true);
