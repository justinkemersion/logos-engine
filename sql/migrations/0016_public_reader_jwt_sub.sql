-- v2_shared: tenant role inherits authenticated; public anon JWT uses sub public-reader.
-- Authenticated policies with using (true) must not apply to the public reader subject.

drop policy if exists ai_runs_select on ai_runs;
create policy ai_runs_select on ai_runs
  for select to authenticated
  using (coalesce(current_setting('request.jwt.claim.sub', true), '') <> 'public-reader');

drop policy if exists commentary_notes_select on commentary_notes;
create policy commentary_notes_select on commentary_notes
  for select to authenticated
  using (coalesce(current_setting('request.jwt.claim.sub', true), '') <> 'public-reader');

drop policy if exists translation_layers_select on translation_layers;
create policy translation_layers_select on translation_layers
  for select to authenticated
  using (coalesce(current_setting('request.jwt.claim.sub', true), '') <> 'public-reader');

drop policy if exists translation_variants_select on translation_variants;
create policy translation_variants_select on translation_variants
  for select to authenticated
  using (coalesce(current_setting('request.jwt.claim.sub', true), '') <> 'public-reader');

drop policy if exists concept_mentions_select on concept_mentions;
create policy concept_mentions_select on concept_mentions
  for select to authenticated
  using (coalesce(current_setting('request.jwt.claim.sub', true), '') <> 'public-reader');

-- Explicit anon deny on ai_runs (defense in depth after 0015 revokes)
create policy ai_runs_anon_deny on ai_runs
  for select to anon
  using (false);
