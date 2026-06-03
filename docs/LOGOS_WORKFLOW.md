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
flux push sql/migrations/0012_seed_reading_desk_test_passages.sql
flux push sql/migrations/0013_public_read_anon.sql
flux push sql/migrations/0013_public_read_grants.sql
flux push sql/migrations/0014_workspaces_private_overlays.sql
flux push sql/migrations/0014_workspaces_grants.sql

# Sync schema name to .env.local
pnpm flux:schema:sync

# Verify gateway bridge and anon public read
pnpm flux:doctor
pnpm public:probe
```

## Product modes

| Mode | Route | Data access |
|------|-------|-------------|
| Public reader | `/read/**` | `fluxAnon()` only — accepted layers, reviewed variants/commentary |
| Personal workspace | `/workspace/**` | `fluxJson(sub)` — `workspace_*` overlays; never mutates canonical tables |
| Site editorial | `/passages/[id]` | Full authenticated reads + AI draft / promotion / review |

## Running the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Public (no login):** `/read` or `/read/00000000-0000-0000-0002-000000000001` (Odyssey 1.1).

**Editorial (sign in):** `/works` and `/passages/<id>` for the full reading desk with AI draft workflow.

**Workspace (sign in):** `/workspace` for a private interpretive layer over shared passages.

## Exploring the MVP

After setup, the following passages are available:

| Path | Passage |
|------|---------|
| `/read` | Public library (anonymous) |
| `/read/<passage-id>` | Public reader |
| `/workspace` | Personal workspace |
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

# Iliad 1.1 (second MVP editorial proof)
pnpm agent:passage:iliad-1-1
pnpm agent:passage:import:iliad-1-1

# Republic 327a (third MVP editorial proof)
pnpm agent:passage:republic-327a
pnpm agent:passage:import:republic-327a
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

## Corpus Garden

Local markdown corpus for generation and curation — **no Flux writes**.

See [`corpus/README.md`](../corpus/README.md) and [`corpus/BULK-WEEKEND.md`](../corpus/BULK-WEEKEND.md).

```bash
pnpm corpus:sync:odyssey-book-1
pnpm corpus:sync:iliad-book-1
pnpm corpus:generate:odyssey-book-1-batch   # resumable; see .local/corpus/*.log
pnpm corpus:generate:iliad-book-1-batch
pnpm corpus:status
```

```bash
# Render markdown from existing JSON (legacy .local/agent-drafts/ supported)
pnpm corpus:render:odyssey-1-1
pnpm corpus:render -- --work-slug=odyssey --section=book-1
pnpm corpus:render -- --all --author-slug=homer

# Generate JSON + markdown (requires CURSOR_API_KEY)
pnpm corpus:generate:odyssey-1-1
pnpm corpus:generate -- --work-slug=odyssey --citation=1.1 --force
```

Committed inventory: `corpus/defaults.yaml` plus section manifests under
`corpus/{author}/{work}/{section}/manifest.yaml`. Generated output: `.local/corpus/drafts/`
and `.local/corpus/garden/`. Future import into `ai_runs` is planned but not implemented.

### Reading Desk test passages (migration 0012)

After `0012_seed_reading_desk_test_passages.sql`, each work has multiple passages on the work
page. Import corpus JSON into `ai_runs` for the AI Draft tab:

```bash
pnpm agent:passage:import:iliad-1-2
pnpm agent:passage:import:iliad-1-10
pnpm agent:passage:import:iliad-1-33
pnpm agent:passage:import:iliad-1-60
pnpm agent:passage:import:odyssey-1-2
pnpm agent:passage:import:odyssey-1-5
```

Uses `.local/corpus/drafts/homer/{work}/{citation}.json` from the weekend batch.

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
