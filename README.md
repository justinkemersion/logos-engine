# Logos Engine

A trust-aware semantic reading environment for ancient Greek texts.

> Read the Greek world from the source.

Logos Engine is an AI-assisted classical text reading engine. It begins with Plato and Homer,
but is designed as a broader tool for reading from the original Greek outward — not from
English inward.

**Status:** MVP — Odyssey 1.1, Iliad 1.1, Republic 327a. Three passages proving the full pipeline.

## What it is

- A layered translation environment: Greek → literal → readable → philosophical
- Every English choice is traceable back to tokens, lemmas, and editorial rules
- Authenticity and transmission history are first-class data
- AI output is labeled as draft material until reviewed
- The Greek source is the authority

## What it is not

- Not a chatbot interface for "explain Plato"
- Not a flash-card or gamified learning tool
- Not a quote aggregator

## Stack

- Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS v4
- Auth.js v5 (GitHub and/or Google)
- Flux / PostgREST / PostgreSQL with RLS-first schema
- pnpm, Vitest

## Quick start

```bash
pnpm install
cp .env.example .env
# Fill in AUTH_SECRET, OAuth provider, FLUX_URL, FLUX_GATEWAY_JWT_SECRET
```

## Flux setup

```bash
flux login
flux init
flux push sql/migrations/0001_core_text_schema.sql
flux push sql/migrations/0002_core_grants.sql
flux push sql/migrations/0003_translation_layers.sql
flux push sql/migrations/0004_translation_grants.sql
flux push sql/migrations/0005_commentary_concepts_ai.sql
flux push sql/migrations/0006_commentary_grants.sql
flux push sql/migrations/0007_seed_mvp_texts.sql
flux push sql/migrations/0009_ai_runs_insert.sql
pnpm flux:schema:sync
pnpm flux:doctor
pnpm dev
```

Full guide: [`docs/LOGOS_WORKFLOW.md`](docs/LOGOS_WORKFLOW.md)

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (public) |
| `/works` | Work library |
| `/works/[slug]` | Work overview + passage list |
| `/passages/[id]` | Reading desk |
| `/concepts` | Concept index |
| `/concepts/[slug]` | Concept detail + semantic trail |
| `/fragments` | Fragment cards |

## Reading desk

The reading desk (`/passages/[id]`) shows:

- **Left rail:** hierarchical library (Plato, Homer, etc.)
- **Center:** Greek text tokenized with literal glosses; tab to literal / readable / commentary
- **Token click:** inline inspector with lemma, morphology, gloss, variants and tradeoff notes
- **Bottom panel:** grammar / notes / variants; **Generate Draft** button (disabled until UI gate)
- **Right panel:** readable English, philosophical notes, cross references, authenticity & transmission, related concepts

## AI draft pipeline

The `logos-passage-agent` generates validated structured JSON (`LogosPassageDraft`). Persistence
stores drafts in `ai_runs` only — **not** in canonical translation tables.

```bash
# Optional: set CURSOR_API_KEY in .env, then:
pnpm agent:passage:odyssey-1-1

# Import into ai_runs for Reading Desk review:
pnpm agent:passage:import:odyssey-1-1
```

Promotion selectively copies draft items into canonical tables (`translation_layers`,
`translation_variants`, `commentary_notes`, `concept_mentions`) as unreviewed rows with
`source_ai_run_id` provenance. Re-promotion is idempotent. Operators mark promoted rows
reviewed via Reading Desk controls. See [`_contract/ai-runs.md`](_contract/ai-runs.md).

Push migrations through `0011_promotion_provenance.sql` for review actions and provenance fields.

| Command | Purpose |
|---------|---------|
| `pnpm agent:passage` | Run passage agent CLI (requires `CURSOR_API_KEY`) |
| `pnpm agent:passage:odyssey-1-1` | Generate Odyssey 1.1 draft to `.local/agent-drafts/` |
| `pnpm agent:passage:iliad-1-1` | Generate Iliad 1.1 draft to `.local/agent-drafts/` |
| `pnpm agent:passage:republic-327a` | Generate Republic 327a draft to `.local/agent-drafts/` |
| `pnpm agent:passage:import` | Import local draft JSON into `ai_runs` |
| `pnpm agent:passage:import:odyssey-1-1` | Import Odyssey 1.1 draft for MVP passage |
| `pnpm agent:passage:import:iliad-1-1` | Import Iliad 1.1 draft for MVP passage |
| `pnpm agent:passage:import:republic-327a` | Import Republic 327a draft for MVP passage |
| `pnpm corpus:render` | Render garden markdown from local JSON drafts |
| `pnpm corpus:render:odyssey-1-1` | Render Odyssey 1.1 garden file |
| `pnpm corpus:generate` | Generate JSON + garden markdown from manifest |
| `pnpm corpus:generate:odyssey-1-1` | Generate Odyssey 1.1 draft + garden file |
| `pnpm flux:doctor` | Verify Flux gateway bridge |
| `pnpm foundry:doctor` | Full app + env preflight |
| `pnpm foundry:verify` | Lint, typecheck, test, drift, build |
| `pnpm check:drift` | File sizes, imports, contracts, SQL, graph |
| `pnpm typecheck` | TypeScript strict |
| `pnpm vitest run` | Unit + boundary tests |

## Forking

See [`docs/FIRST_FORK.md`](docs/FIRST_FORK.md) and [`_contract/forking.md`](_contract/forking.md).

## Philosophy

Logos Engine follows Foundry methodology: contract-first, migration-first, anti-drift.

The parallel is not accidental:

| Flux | Logos |
|------|-------|
| PostgreSQL visible | Greek visible |
| No shims | No semantic smoothing |
| Explicit contracts | Explicit translation rules |
| Traceable infra | Traceable interpretation |
| Layered architecture | Layered translation |

Both refuse to hide the substrate. That's the product philosophy.

## License

MIT
