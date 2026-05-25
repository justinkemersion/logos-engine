# Database contract

## SQL-first

Prefer PostgreSQL constraints, indexes, and RLS over application-layer authorization.

## Content table RLS

Logos Engine content tables (`works`, `sections`, `passages`, `tokens`, `translation_layers`,
`translation_variants`, `commentary_notes`, `concept_threads`, `concept_mentions`,
`authenticity_profiles`, `ai_runs`, `cross_references`, `source_editions`) are **shared
scholarly content** — not per-user data.

RLS policy for all content tables:

```sql
create policy <table>_select on <table>
  for select to authenticated using (true);
```

There is no `user_id` column on content tables. The JWT `sub` is used to authenticate the
reader but does not scope rows.

**No INSERT/UPDATE/DELETE via the application layer in MVP** except `ai_runs` INSERT for
draft AI pipeline output (`0009_ai_runs_insert.sql`). Content is seeded via migrations.
No writes to editorial content tables until explicit promotion.

## RLS invariant

All content tables use `for select to authenticated using (true)`. Draft AI output may be
inserted into `ai_runs` only (`ai_runs_insert` policy). No other content table accepts
application writes in the current slice.

- Numbered files: `0001_*.sql`, `0002_*_grants.sql`, domain DDL, `*_grants.sql`
- Use **unqualified** table names; Flux applies in the API schema context (`t_<hash>_api`)
- After `flux push`, run `pnpm flux:schema:sync`
- No `{{placeholders}}` in committed migration files

## Grants

Every DDL migration has a paired `*_grants.sql`:

```sql
grant select on table works, sections, passages, tokens, source_editions to authenticated;
```

`select` only on editorial content tables — no `insert`, `update`, `delete` until editorial
promotion is planned. Exception: `grant insert on ai_runs` for draft AI runs (`0009`).

## Primary keys

All PKs are `uuid primary key default gen_random_uuid()`.

## Indexes

Content tables carry indexes on:
- `works(slug)`
- `sections(work_id, sequence)`
- `passages(work_id, sequence)`, `passages(citation_ref)`
- `tokens(passage_id, token_index)`

## Migration file order

```
0001_core_text_schema.sql       works, sections, passages, tokens, source_editions + RLS
0002_core_grants.sql            grant select on core tables
0003_translation_layers.sql     translation_layers, translation_variants + RLS
0004_translation_grants.sql     grant select on translation tables
0005_commentary_concepts_ai.sql commentary_notes, concept_threads, concept_mentions,
                                  authenticity_profiles, ai_runs, cross_references + RLS
0006_commentary_grants.sql      grant select on commentary tables
0007_seed_mvp_texts.sql         MVP seed data
0009_ai_runs_insert.sql         ai_runs INSERT policy + grants (draft AI only)
0010_editorial_promotion_grants.sql  selective promotion INSERT + ai_runs UPDATE
```
