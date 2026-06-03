-- Public reader: grant SELECT to anon (and tenant role for v2_shared gateway).

grant select on table source_editions to anon;
grant select on table works to anon;
grant select on table sections to anon;
grant select on table passages to anon;
grant select on table tokens to anon;
grant select on table translation_layers to anon;
grant select on table translation_variants to anon;
grant select on table commentary_notes to anon;
grant select on table concept_threads to anon;
grant select on table concept_mentions to anon;
grant select on table authenticity_profiles to anon;
grant select on table cross_references to anon;

grant anon to t_744b22df8382_role;

grant select on table source_editions to t_744b22df8382_role;
grant select on table works to t_744b22df8382_role;
grant select on table sections to t_744b22df8382_role;
grant select on table passages to t_744b22df8382_role;
grant select on table tokens to t_744b22df8382_role;
grant select on table translation_layers to t_744b22df8382_role;
grant select on table translation_variants to t_744b22df8382_role;
grant select on table commentary_notes to t_744b22df8382_role;
grant select on table concept_threads to t_744b22df8382_role;
grant select on table concept_mentions to t_744b22df8382_role;
grant select on table authenticity_profiles to t_744b22df8382_role;
grant select on table cross_references to t_744b22df8382_role;
