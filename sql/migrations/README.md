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
flux push sql/migrations/0011_promotion_provenance.sql
flux push sql/migrations/0012_seed_reading_desk_test_passages.sql
flux push sql/migrations/0013_public_read_anon.sql
flux push sql/migrations/0013_public_read_grants.sql
flux push sql/migrations/0014_workspaces_private_overlays.sql
flux push sql/migrations/0014_workspaces_grants.sql
```

After pushing all migrations:

```bash
pnpm flux:schema:sync   # writes FLUX_POSTGREST_SCHEMA to .env.local
pnpm flux:doctor        # verifies gateway bridge and schema access
pnpm public:probe       # verifies anon public-read policies
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
| `0011_promotion_provenance.sql` | Provenance + review audit columns, partial unique indexes, UPDATE grants (review actions) |
| `0012_seed_reading_desk_test_passages.sql` | Extra passages: Iliad 1.2, 1.10, 1.33, 1.60; Odyssey 1.2, 1.5 |
| `0013_public_read_anon.sql` | Restrictive `anon` SELECT policies + seed `review_status` backfill |
| `0013_public_read_grants.sql` | `grant select` to `anon` on public-safe tables |
| `0014_workspaces_private_overlays.sql` | `workspaces`, `workspace_*` overlay tables + parent-scoped RLS |
| `0014_workspaces_grants.sql` | Authenticated CRUD on workspace tables (no anon) |

## RLS model

Canonical content tables use `for select to authenticated using (true)` for editorial access.
Public reader adds parallel `for select to anon` policies with restrictive `using` clauses
(see `0013_public_read_anon.sql`). Workspace tables scope ownership via `workspaces.owner_sub`.

Shared scholarly content has no `user_id` on canonical tables.

Write access (INSERT/UPDATE/DELETE) is not granted in MVP except **`ai_runs` INSERT**
for draft AI output (`0009_ai_runs_insert.sql`), **selective editorial promotion**
(`0010_editorial_promotion_grants.sql`) into canonical tables as draft rows, and
**review actions** (`0011_promotion_provenance.sql`) UPDATE on canonical tables.
