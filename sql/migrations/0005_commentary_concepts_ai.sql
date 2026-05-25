-- Commentary, concept threads, authenticity, AI runs, cross references

-- ---------------------------------------------------------------------------
-- commentary_notes
-- ---------------------------------------------------------------------------
-- note_type values: lexical | grammatical | philosophical | historical |
--                   translator_choice | transmission | fragment
create table commentary_notes (
  id          uuid        primary key default gen_random_uuid(),
  passage_id  uuid        references passages (id),
  note_type   text        not null,
  title       text,
  body        text        not null,
  created_at  timestamptz default now()
);

create index commentary_notes_passage_idx  on commentary_notes (passage_id);
create index commentary_notes_type_idx     on commentary_notes (note_type);

alter table commentary_notes enable row level security;

create policy commentary_notes_select on commentary_notes
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- concept_threads
-- ---------------------------------------------------------------------------
create table concept_threads (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        unique not null,
  label        text        not null,
  greek_term   text,
  description  text,
  created_at   timestamptz default now()
);

create index concept_threads_slug_idx on concept_threads (slug);

alter table concept_threads enable row level security;

create policy concept_threads_select on concept_threads
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- concept_mentions
-- ---------------------------------------------------------------------------
create table concept_mentions (
  id          uuid        primary key default gen_random_uuid(),
  concept_id  uuid        not null references concept_threads (id),
  passage_id  uuid        references passages (id),
  token_id    uuid        references tokens (id),
  note        text,
  created_at  timestamptz default now()
);

create index concept_mentions_concept_idx on concept_mentions (concept_id);
create index concept_mentions_passage_idx on concept_mentions (passage_id);

alter table concept_mentions enable row level security;

create policy concept_mentions_select on concept_mentions
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- authenticity_profiles
-- ---------------------------------------------------------------------------
-- status values: secure | generally_accepted | disputed | doubtful | spurious |
--               oral_tradition | composite_tradition
create table authenticity_profiles (
  id               uuid        primary key default gen_random_uuid(),
  work_id          uuid        not null references works (id),
  status           text        not null,
  confidence_label text        not null,
  summary          text        not null,
  signals          jsonb       not null default '{}'::jsonb,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index authenticity_profiles_work_idx on authenticity_profiles (work_id);

alter table authenticity_profiles enable row level security;

create policy authenticity_profiles_select on authenticity_profiles
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- ai_runs
-- ---------------------------------------------------------------------------
-- run_type values: token_gloss | literal_translation | readable_translation |
--   philosophical_note | concept_linking | authenticity_summary | cross_reference_scan
-- status values: draft | accepted | rejected | revised
create table ai_runs (
  id          uuid        primary key default gen_random_uuid(),
  passage_id  uuid        references passages (id),
  run_type    text        not null,
  model       text,
  prompt      text,
  output      text,
  status      text        not null default 'draft',
  created_at  timestamptz default now()
);

create index ai_runs_passage_idx on ai_runs (passage_id);

alter table ai_runs enable row level security;

create policy ai_runs_select on ai_runs
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- cross_references
-- ---------------------------------------------------------------------------
-- relationship_type values: echo | contrast | shared_concept | same_term |
--   mythic_parallel | political_parallel | tone_parallel
create table cross_references (
  id                 uuid        primary key default gen_random_uuid(),
  source_passage_id  uuid        not null references passages (id),
  target_passage_id  uuid        not null references passages (id),
  relationship_type  text        not null,
  note               text,
  created_at         timestamptz default now()
);

create index cross_references_source_idx on cross_references (source_passage_id);
create index cross_references_target_idx on cross_references (target_passage_id);

alter table cross_references enable row level security;

create policy cross_references_select on cross_references
  for select to authenticated using (true);
