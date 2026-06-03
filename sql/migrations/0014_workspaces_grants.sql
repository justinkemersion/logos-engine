-- Workspace tables: authenticated CRUD only (no anon).

grant select, insert, update, delete on table workspaces to authenticated;
grant select, insert, update, delete on table workspace_translation_layers to authenticated;
grant select, insert, update, delete on table workspace_translation_variants to authenticated;
grant select, insert, update, delete on table workspace_commentary_notes to authenticated;

grant select, insert, update, delete on table workspaces to t_744b22df8382_role;
grant select, insert, update, delete on table workspace_translation_layers to t_744b22df8382_role;
grant select, insert, update, delete on table workspace_translation_variants to t_744b22df8382_role;
grant select, insert, update, delete on table workspace_commentary_notes to t_744b22df8382_role;
