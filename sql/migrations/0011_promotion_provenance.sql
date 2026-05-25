-- Promotion provenance and review audit fields.
-- source_ai_run_id is immutable after insert (enforced in application layer).

alter table translation_layers
  add column source_ai_run_id uuid references ai_runs (id),
  add column reviewed_at       timestamptz,
  add column reviewed_by       text;

alter table translation_variants
  add column source_ai_run_id uuid references ai_runs (id),
  add column review_status    text not null default 'draft',
  add column reviewed_at      timestamptz,
  add column reviewed_by      text,
  add column reviewer_note    text;

alter table commentary_notes
  add column source_ai_run_id uuid references ai_runs (id),
  add column review_status    text not null default 'draft',
  add column reviewed_at      timestamptz,
  add column reviewed_by      text,
  add column reviewer_note    text;

alter table concept_mentions
  add column source_ai_run_id uuid references ai_runs (id),
  add column review_status    text not null default 'draft',
  add column reviewed_at      timestamptz,
  add column reviewed_by      text,
  add column reviewer_note    text;

-- Partial unique indexes: AI-promoted rows only (seed/manual rows unaffected).
create unique index translation_layers_ai_promotion_uidx
  on translation_layers (passage_id, layer, source_ai_run_id)
  where source_ai_run_id is not null;

create unique index translation_variants_ai_promotion_uidx
  on translation_variants (passage_id, source_ai_run_id, phrase, variant)
  where source_ai_run_id is not null;

create unique index commentary_notes_ai_promotion_uidx
  on commentary_notes (passage_id, source_ai_run_id, note_type, coalesce(title, ''))
  where source_ai_run_id is not null;

create unique index concept_mentions_ai_promotion_uidx
  on concept_mentions (passage_id, source_ai_run_id, concept_id)
  where source_ai_run_id is not null;

-- Review actions: UPDATE on canonical content tables.
create policy translation_layers_update on translation_layers
  for update to authenticated using (true) with check (true);

create policy translation_variants_update on translation_variants
  for update to authenticated using (true) with check (true);

create policy commentary_notes_update on commentary_notes
  for update to authenticated using (true) with check (true);

create policy concept_mentions_update on concept_mentions
  for update to authenticated using (true) with check (true);

grant update on table translation_layers to authenticated;
grant update on table translation_variants to authenticated;
grant update on table commentary_notes to authenticated;
grant update on table concept_mentions to authenticated;

grant update on table translation_layers to t_744b22df8382_role;
grant update on table translation_variants to t_744b22df8382_role;
grant update on table commentary_notes to t_744b22df8382_role;
grant update on table concept_mentions to t_744b22df8382_role;
