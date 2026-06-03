-- Public reader: restrictive anon SELECT policies + seed review_status backfill.
-- Authenticated editorial policies are unchanged.

-- ---------------------------------------------------------------------------
-- Backfill: MVP seed rows should be publicly visible
-- ---------------------------------------------------------------------------
update translation_variants
  set review_status = 'reviewed'
  where source_ai_run_id is null;

update commentary_notes
  set review_status = 'reviewed'
  where source_ai_run_id is null;

update concept_mentions
  set review_status = 'reviewed'
  where source_ai_run_id is null;

-- ---------------------------------------------------------------------------
-- Anon SELECT policies (restrictive; parallel to authenticated policies)
-- ---------------------------------------------------------------------------
create policy works_select_anon on works
  for select to anon using (true);

create policy sections_select_anon on sections
  for select to anon using (true);

create policy passages_select_anon on passages
  for select to anon using (true);

create policy tokens_select_anon on tokens
  for select to anon using (true);

create policy source_editions_select_anon on source_editions
  for select to anon using (true);

create policy translation_layers_select_anon on translation_layers
  for select to anon using (status = 'accepted');

create policy translation_variants_select_anon on translation_variants
  for select to anon using (review_status = 'reviewed');

create policy commentary_notes_select_anon on commentary_notes
  for select to anon using (review_status = 'reviewed');

create policy concept_threads_select_anon on concept_threads
  for select to anon using (true);

create policy concept_mentions_select_anon on concept_mentions
  for select to anon using (review_status = 'reviewed');

create policy authenticity_profiles_select_anon on authenticity_profiles
  for select to anon using (true);

create policy cross_references_select_anon on cross_references
  for select to anon using (true);

-- ai_runs: intentionally no anon policy or grant
