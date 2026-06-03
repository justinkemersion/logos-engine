-- Personal workspace overlay tables (private interpretive layer over shared passages).

create table workspaces (
  id          uuid        primary key default gen_random_uuid(),
  owner_sub   text        not null,
  slug        text        not null,
  name        text        not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (owner_sub, slug)
);

create index workspaces_owner_sub_idx on workspaces (owner_sub);

alter table workspaces enable row level security;

create policy workspaces_select on workspaces
  for select to authenticated
  using ((current_setting('request.jwt.claims', true)::json->>'sub') = owner_sub);

create policy workspaces_insert on workspaces
  for insert to authenticated
  with check ((current_setting('request.jwt.claims', true)::json->>'sub') = owner_sub);

create policy workspaces_update on workspaces
  for update to authenticated
  using ((current_setting('request.jwt.claims', true)::json->>'sub') = owner_sub)
  with check ((current_setting('request.jwt.claims', true)::json->>'sub') = owner_sub);

create policy workspaces_delete on workspaces
  for delete to authenticated
  using ((current_setting('request.jwt.claims', true)::json->>'sub') = owner_sub);

-- ---------------------------------------------------------------------------
-- workspace_translation_layers
-- ---------------------------------------------------------------------------
create table workspace_translation_layers (
  id             uuid        primary key default gen_random_uuid(),
  workspace_id   uuid        not null references workspaces (id) on delete cascade,
  passage_id     uuid        not null references passages (id) on delete cascade,
  layer          text        not null,
  content        text        not null,
  status         text        not null default 'draft',
  reviewer_note  text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (workspace_id, passage_id, layer)
);

create index workspace_translation_layers_workspace_passage_idx
  on workspace_translation_layers (workspace_id, passage_id);

alter table workspace_translation_layers enable row level security;

create policy workspace_translation_layers_select on workspace_translation_layers
  for select to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_layers.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_translation_layers_insert on workspace_translation_layers
  for insert to authenticated
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_layers.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_translation_layers_update on workspace_translation_layers
  for update to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_layers.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  )
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_layers.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_translation_layers_delete on workspace_translation_layers
  for delete to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_layers.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

-- ---------------------------------------------------------------------------
-- workspace_translation_variants
-- ---------------------------------------------------------------------------
create table workspace_translation_variants (
  id             uuid        primary key default gen_random_uuid(),
  workspace_id   uuid        not null references workspaces (id) on delete cascade,
  passage_id     uuid        not null references passages (id) on delete cascade,
  source_phrase  text        not null,
  variant        text        not null,
  variant_type   text        not null,
  confidence     text,
  tradeoff_note  text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (workspace_id, passage_id, source_phrase, variant)
);

create index workspace_translation_variants_workspace_passage_idx
  on workspace_translation_variants (workspace_id, passage_id);

alter table workspace_translation_variants enable row level security;

create policy workspace_translation_variants_select on workspace_translation_variants
  for select to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_variants.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_translation_variants_insert on workspace_translation_variants
  for insert to authenticated
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_variants.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_translation_variants_update on workspace_translation_variants
  for update to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_variants.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  )
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_variants.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_translation_variants_delete on workspace_translation_variants
  for delete to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_translation_variants.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

-- ---------------------------------------------------------------------------
-- workspace_commentary_notes
-- ---------------------------------------------------------------------------
create table workspace_commentary_notes (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references workspaces (id) on delete cascade,
  passage_id   uuid        not null references passages (id) on delete cascade,
  note_type    text        not null default 'personal',
  title        text,
  body         text        not null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index workspace_commentary_notes_workspace_passage_idx
  on workspace_commentary_notes (workspace_id, passage_id);

alter table workspace_commentary_notes enable row level security;

create policy workspace_commentary_notes_select on workspace_commentary_notes
  for select to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_commentary_notes.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_commentary_notes_insert on workspace_commentary_notes
  for insert to authenticated
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_commentary_notes.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_commentary_notes_update on workspace_commentary_notes
  for update to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_commentary_notes.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  )
  with check (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_commentary_notes.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy workspace_commentary_notes_delete on workspace_commentary_notes
  for delete to authenticated
  using (
    exists (
      select 1 from workspaces
      where workspaces.id = workspace_commentary_notes.workspace_id
        and workspaces.owner_sub = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );
