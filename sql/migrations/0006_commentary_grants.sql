-- Grants for commentary, concept, AI, and cross-reference tables (read-only in MVP)
grant select on table commentary_notes      to authenticated;
grant select on table concept_threads       to authenticated;
grant select on table concept_mentions      to authenticated;
grant select on table authenticity_profiles to authenticated;
grant select on table ai_runs               to authenticated;
grant select on table cross_references      to authenticated;
