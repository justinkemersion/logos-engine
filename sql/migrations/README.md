# SQL Migrations

Push in order using the Flux CLI:

```bash
flux push sql/migrations/0001_core_text_schema.sql
flux push sql/migrations/0002_core_grants.sql
flux push sql/migrations/0003_translation_layers.sql
flux push sql/migrations/0004_translation_grants.sql
flux push sql/migrations/0005_commentary_concepts_ai.sql
flux push sql/migrations/0006_commentary_grants.sql
flux push sql/migrations/0007_seed_mvp_texts.sql
flux push sql/migrations/0009_ai_runs_insert.sql
flux push sql/migrations/0010_editorial_promotion_grants.sql
```

After pushing all migrations:

```bash
pnpm flux:schema:sync   # writes FLUX_POSTGREST_SCHEMA to .env.local
pnpm flux:doctor        # verifies gateway bridge and schema access
```

## Migration map

| File | Creates |
|------|---------|
| `0001_core_text_schema.sql` | `source_editions`, `works`, `sections`, `passages`, `tokens` + RLS |
| `0002_core_grants.sql` | `grant select` on core tables |
| `0003_translation_layers.sql` | `translation_layers`, `translation_variants` + RLS |
| `0004_translation_grants.sql` | `grant select` on translation tables |
| `0005_commentary_concepts_ai.sql` | `commentary_notes`, `concept_threads`, `concept_mentions`, `authenticity_profiles`, `ai_runs`, `cross_references` + RLS |
| `0006_commentary_grants.sql` | `grant select` on commentary tables |
| `0007_seed_mvp_texts.sql` | MVP seed: Homer (Odyssey 1.1, Iliad 1.1), Plato (Republic 327a) |
| `0009_ai_runs_insert.sql` | `ai_runs` INSERT policy + grants (draft AI pipeline only) |
| `0010_editorial_promotion_grants.sql` | INSERT on canonical tables + `ai_runs` UPDATE (selective promotion) |

## RLS model

All content tables use `for select to authenticated using (true)`. This is shared scholarly
content — not per-user data. There are no `user_id` columns on content tables.

Write access (INSERT/UPDATE/DELETE) is not granted in MVP except **`ai_runs` INSERT**
for draft AI output (`0009_ai_runs_insert.sql`) and **selective editorial promotion**
(`0010_editorial_promotion_grants.sql`) into canonical tables as draft rows. Future
editorial tooling may add UPDATE/acceptance workflows in new numbered migrations.
