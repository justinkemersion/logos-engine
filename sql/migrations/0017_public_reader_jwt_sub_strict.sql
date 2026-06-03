-- Tighten machinery SELECT: empty JWT sub must not inherit authenticated access.

drop policy if exists ai_runs_select on ai_runs;
create policy ai_runs_select on ai_runs
  for select to authenticated
  using (
    nullif(current_setting('request.jwt.claim.sub', true), '') is not null
    and current_setting('request.jwt.claim.sub', true) <> 'public-reader'
  );

drop policy if exists commentary_notes_select on commentary_notes;
create policy commentary_notes_select on commentary_notes
  for select to authenticated
  using (
    nullif(current_setting('request.jwt.claim.sub', true), '') is not null
    and current_setting('request.jwt.claim.sub', true) <> 'public-reader'
  );

drop policy if exists translation_layers_select on translation_layers;
create policy translation_layers_select on translation_layers
  for select to authenticated
  using (
    nullif(current_setting('request.jwt.claim.sub', true), '') is not null
    and current_setting('request.jwt.claim.sub', true) <> 'public-reader'
  );

drop policy if exists translation_variants_select on translation_variants;
create policy translation_variants_select on translation_variants
  for select to authenticated
  using (
    nullif(current_setting('request.jwt.claim.sub', true), '') is not null
    and current_setting('request.jwt.claim.sub', true) <> 'public-reader'
  );

drop policy if exists concept_mentions_select on concept_mentions;
create policy concept_mentions_select on concept_mentions
  for select to authenticated
  using (
    nullif(current_setting('request.jwt.claim.sub', true), '') is not null
    and current_setting('request.jwt.claim.sub', true) <> 'public-reader'
  );
