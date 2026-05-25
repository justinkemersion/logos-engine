-- Translation layers and variants
-- translation_layers: one complete rendering per passage per layer type
-- translation_variants: alternative renderings for a token/phrase with rationale

-- ---------------------------------------------------------------------------
-- translation_layers
-- ---------------------------------------------------------------------------
-- layer values: raw_greek | token_gloss | literal | readable | philosophical
-- status values: draft | accepted | rejected | revised
create table translation_layers (
  id             uuid        primary key default gen_random_uuid(),
  passage_id     uuid        not null references passages (id),
  layer          text        not null,
  content        text        not null,
  status         text        not null default 'draft',
  reviewer_note  text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index translation_layers_passage_idx on translation_layers (passage_id, layer);

alter table translation_layers enable row level security;

create policy translation_layers_select on translation_layers
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- translation_variants
-- ---------------------------------------------------------------------------
-- variant_type values: literal | readable | poetic | philosophical | rejected
-- confidence values: high | medium | contested
create table translation_variants (
  id             uuid        primary key default gen_random_uuid(),
  passage_id     uuid        not null references passages (id),
  token_id       uuid        references tokens (id),
  phrase         text        not null,
  variant        text        not null,
  variant_type   text        not null,
  rationale      text,
  confidence     text,
  tradeoff_note  text,
  created_at     timestamptz default now()
);

create index translation_variants_passage_idx on translation_variants (passage_id);
create index translation_variants_token_idx   on translation_variants (token_id);

alter table translation_variants enable row level security;

create policy translation_variants_select on translation_variants
  for select to authenticated using (true);
