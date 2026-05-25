# Logos Engine — Workflow Guide

## Quick start

```bash
pnpm install
cp .env.example .env
# Fill in AUTH_SECRET, AUTH_GITHUB_* or AUTH_GOOGLE_*, FLUX_URL, FLUX_GATEWAY_JWT_SECRET
```

## Flux setup

Follow this order. Do not skip steps.

```bash
flux login
flux init                          # or: flux link <project-id>
# Update flux.json hash from `flux list` if it wasn't written automatically

# Push migrations in order
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

# Sync schema name to .env.local
pnpm flux:schema:sync

# Verify gateway bridge
pnpm flux:doctor
```

## Running the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in, then navigate to `/works` to see the library.

## Exploring the MVP

After setup, the following passages are available:

| Path | Passage |
|------|---------|
| `/works/odyssey` | Homer, Odyssey — passage list |
| `/works/iliad` | Homer, Iliad — passage list |
| `/works/republic` | Plato, Republic — passage list |
| `/passages/<id>` | Reading desk for any passage |
| `/concepts` | Concept index |
| `/concepts/polytropos` | πολύτροπος — many-turned |
| `/concepts/logos` | λόγος semantic trail |
| `/fragments` | Fragment cards (Timaeus) |

To find the UUID for Odyssey 1.1, query PostgREST directly or navigate through `/works/odyssey`.

## Schema

All content tables use `for select to authenticated using (true)` RLS. There are no
`user_id` columns on content tables — this is shared scholarly content.

See `sql/migrations/README.md` for the full migration map.

## AI draft runs

The `logos-passage-agent` (see `prompts/logos-passage-agent.md`) produces validated
`LogosPassageDraft` JSON. Persistence writes **`ai_runs` only** with `run_type = passage_draft`.

Editorial lifecycle:

```
agent output → ai_runs.passage_draft → promoted canonical draft → reviewed canonical content
```

- **AI draft** = generated artifact in `ai_runs` (not canonical)
- **Promoted draft** = canonical table row, still unreviewed
- **Reviewed** = human accepted (`translation_layers.status = accepted`; other tables `review_status = reviewed`)

```bash
# Requires CURSOR_API_KEY in .env
# Writes to .local/agent-drafts/odyssey/1-1.json by default (gitignored)
pnpm agent:passage:odyssey-1-1

# Import that file into ai_runs (requires FLUX_URL + FLUX_GATEWAY_JWT_SECRET)
pnpm agent:passage:import:odyssey-1-1
```

Or run the generic commands:

```bash
pnpm agent:passage -- --work-title="Odyssey" --citation="1.1" \
  --author="Homer" --greek="ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον" \
  --decompose

pnpm agent:passage:import -- --passage-id=00000000-0000-0000-0002-000000000001 \
  --work-title=Odyssey --citation=1.1 --decompose
```

Use `--stdout` to print JSON instead of writing a file, or `--out=path.json` to override
the default location. Live agent output lives under `.local/agent-drafts/{work}/{citation}.json`;
hand-curated test fixtures remain in `lib/agents/fixtures/`.

The Reading Desk **Generate Draft** button stays disabled until
`LOGOS_PASSAGE_DRAFT_UI_ENABLED=1` after reviewing persisted drafts. The server action
`generatePassageDraftAction` is wired for programmatic use.

Optional env:

| Variable | Purpose |
|----------|---------|
| `CURSOR_API_KEY` | Cursor SDK auth for agent CLI / server action |
| `LOGOS_PASSAGE_DRAFT_UI_ENABLED=1` | Enable Reading Desk generate button |
| `LOGOS_PASSAGE_AGENT_DECOMPOSE=1` | Also persist granular `ai_runs` rows |

After pushing `0010_editorial_promotion_grants.sql` and `0011_promotion_provenance.sql`,
the Reading Desk supports selective **promotion** (idempotent, with `source_ai_run_id`
provenance) and **review** (mark reviewed / return to draft) on promoted canonical rows.
Concept mentions require an existing `concept_threads` row.

### Manual verification (promotion + review)

1. Generate/persist an Odyssey 1.1 draft (`generatePassageDraftAction` or CLI).
2. Promote literal layer + variants from the AI Draft tab.
3. Re-promote the same selections — confirm no duplicate rows (content updates in place).
4. Mark the promoted literal layer reviewed — badge changes from
   `AI Draft — not yet reviewed` to `Reviewed`.

## Checking for drift

```bash
pnpm check:drift     # file sizes, import boundaries, contracts, SQL, graph
pnpm typecheck       # TypeScript strict
pnpm vitest run      # unit + flux boundary tests
```

## Full verification

```bash
pnpm foundry:verify
```

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `AUTH_SECRET` | Yes | Min 32 chars |
| `AUTH_GITHUB_ID` + `AUTH_GITHUB_SECRET` | One pair required | GitHub OAuth |
| `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` | One pair required | Google OAuth |
| `FLUX_URL` | Yes | PostgREST base URL from `flux list` |
| `FLUX_GATEWAY_JWT_SECRET` | Yes | From `flux project credentials` |
| `FLUX_POSTGREST_SCHEMA` | `.env.local` only | Set by `pnpm flux:schema:sync` |
| `FLUX_TLS_INSECURE` | No | Set `1` for local dev with self-signed certs |
