-- Editorial promotion: INSERT into canonical content tables + UPDATE ai_runs status.
-- Selective promotion from reviewed passage_draft only.

create policy translation_layers_insert on translation_layers
  for insert to authenticated with check (true);

create policy translation_variants_insert on translation_variants
  for insert to authenticated with check (true);

create policy commentary_notes_insert on commentary_notes
  for insert to authenticated with check (true);

create policy concept_mentions_insert on concept_mentions
  for insert to authenticated with check (true);

create policy ai_runs_update on ai_runs
  for update to authenticated using (true) with check (true);

grant insert on table translation_layers to authenticated;
grant insert on table translation_variants to authenticated;
grant insert on table commentary_notes to authenticated;
grant insert on table concept_mentions to authenticated;
grant update on table ai_runs to authenticated;

grant insert on table translation_layers to t_744b22df8382_role;
grant insert on table translation_variants to t_744b22df8382_role;
grant insert on table commentary_notes to t_744b22df8382_role;
grant insert on table concept_mentions to t_744b22df8382_role;
grant update on table ai_runs to t_744b22df8382_role;
