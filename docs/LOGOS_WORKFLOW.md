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
