-- Public reader lockdown: revoke bootstrap broad grants and reinforce anon RLS.
-- v2 cluster bootstrap may GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon.
-- Machinery tables must stay editorial-only; anon sees accepted/reviewed canonical rows only.

-- ---------------------------------------------------------------------------
-- ai_runs: no public access
-- ---------------------------------------------------------------------------
revoke all on table ai_runs from anon;
revoke all on table ai_runs from public;

alter table ai_runs force row level security;

-- ---------------------------------------------------------------------------
-- RESTRICTIVE anon policies (combine with permissive policies in 0013)
-- ---------------------------------------------------------------------------
create policy translation_layers_anon_restrict on translation_layers
  as restrictive for select to anon
  using (status = 'accepted');

create policy translation_variants_anon_restrict on translation_variants
  as restrictive for select to anon
  using (review_status = 'reviewed');

create policy commentary_notes_anon_restrict on commentary_notes
  as restrictive for select to anon
  using (review_status = 'reviewed');

create policy concept_mentions_anon_restrict on concept_mentions
  as restrictive for select to anon
  using (review_status = 'reviewed');

-- ---------------------------------------------------------------------------
-- Workspace tables: ensure anon cannot read (defense in depth)
-- ---------------------------------------------------------------------------
revoke all on table workspaces from anon;
revoke all on table workspace_translation_layers from anon;
revoke all on table workspace_translation_variants from anon;
revoke all on table workspace_commentary_notes from anon;

alter table workspaces force row level security;
alter table workspace_translation_layers force row level security;
alter table workspace_translation_variants force row level security;
alter table workspace_commentary_notes force row level security;
