-- ai_runs INSERT for draft AI pipeline only.
-- Editorial firewall: no writes to translation_layers, tokens, commentary_notes, etc.

create policy ai_runs_insert on ai_runs
  for insert to authenticated with check (true);

grant insert on table ai_runs to authenticated;
grant insert on table ai_runs to t_744b22df8382_role;
