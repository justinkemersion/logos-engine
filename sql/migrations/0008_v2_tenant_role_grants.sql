-- v2_shared: gateway bridges app JWT (role: authenticated) to t_744b22df8382_role.
-- PostgREST session runs as t_744b22df8382_role, so grants must target that role.
-- RLS policies "to authenticated" also need the tenant role as a member of authenticated.

-- Make the tenant role a member of authenticated so RLS policies work
grant authenticated to t_744b22df8382_role;

-- Grant schema usage
grant usage on schema t_744b22df8382_api to t_744b22df8382_role;

-- Core text tables
grant select on table source_editions to t_744b22df8382_role;
grant select on table works to t_744b22df8382_role;
grant select on table sections to t_744b22df8382_role;
grant select on table passages to t_744b22df8382_role;
grant select on table tokens to t_744b22df8382_role;

-- Translation tables
grant select on table translation_layers to t_744b22df8382_role;
grant select on table translation_variants to t_744b22df8382_role;

-- Commentary, concepts, AI, cross-references
grant select on table commentary_notes to t_744b22df8382_role;
grant select on table concept_threads to t_744b22df8382_role;
grant select on table concept_mentions to t_744b22df8382_role;
grant select on table authenticity_profiles to t_744b22df8382_role;
grant select on table ai_runs to t_744b22df8382_role;
grant select on table cross_references to t_744b22df8382_role;
