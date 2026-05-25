# AI runs contract

## Principle

AI output is draft material. It is never presented as final scholarly authority.

The Greek source remains the authority. AI assists the editorial process; it does not replace it.

## Run types

| Run type | Produces |
|----------|---------|
| `passage_draft` | Full structured JSON from `logos-passage-agent` (master artifact) |
| `token_gloss` | Literal word-by-word gloss per token |
| `literal_translation` | Word-order-preserving literal translation of a passage |
| `readable_translation` | Fluent readable English rendering |
| `philosophical_note` | Draft philosophical commentary on a passage |
| `concept_linking` | Suggested concept thread connections |
| `authenticity_summary` | Draft summary of transmission signals |
| `cross_reference_scan` | Suggested cross-reference candidates |

## Dual storage model

The `logos-passage-agent` produces one **`passage_draft`** master artifact containing the full
structured output (tokens, layers, variants, concepts, cross-references, commentary,
`editorialWarnings`). This master row preserves provenance, recoverability, and replayability.

The consuming application may also decompose the master into granular `run_type` rows for:

- targeted re-runs (e.g. re-generate only `literal_translation`),
- selective human review,
- and future pipeline specialization.

Decomposition logic may change across Logos versions; the master `passage_draft` survives that.

The agent core does not write to Flux. Persistence lands in `ai_runs` with `status: draft` after
validation.

## Status values

| Status | Meaning |
|--------|---------|
| `draft` | AI output not yet reviewed |
| `accepted` | Reviewed and accepted as editorial content |
| `rejected` | Reviewed and rejected |
| `revised` | Accepted with editorial changes |

## Rules

1. All AI runs land in `ai_runs` table with `status: draft`.
2. AI content is only promoted to translation layers, commentary notes, or concept threads
   after explicit editorial review.
3. The UI labels AI-generated content as "AI Draft" until status changes to `accepted`.
4. The "Generate Draft" button stays **disabled** until `LOGOS_PASSAGE_DRAFT_UI_ENABLED=1`
   after operator review of persisted `ai_runs` drafts. The server action may persist drafts
   independently; UI generation is a separate gate.
5. AI run **prompts** are stored verbatim for auditability. **`passage_draft` output** stores
   the validated `LogosPassageDraft` JSON (not canonical translation content).
6. Model version is recorded in `ai_runs.model`.

## Persistence rules

- **Persist drafts, not translations.** Only `ai_runs` accepts INSERT in this slice.
- Do not write AI output to `tokens`, `translation_layers`, `translation_variants`,
  `commentary_notes`, `cross_references`, or `concept_mentions` without editorial promotion.
- Granular decomposed rows are optional (`LOGOS_PASSAGE_AGENT_DECOMPOSE=1`); default is master
  `passage_draft` only.

### CLI scratch output

`pnpm agent:passage` writes validated JSON to `.local/agent-drafts/{work}/{citation}.json`
(gitignored). This is operator scratch space — not canonical content and not committed.
Stable hand-curated shapes for tests live in `lib/agents/fixtures/`. Flux persistence
(`ai_runs`) is separate:

```bash
# Generate locally (requires CURSOR_API_KEY)
pnpm agent:passage:odyssey-1-1
pnpm agent:passage:iliad-1-1

# Import local JSON into ai_runs (requires FLUX_URL + FLUX_GATEWAY_JWT_SECRET)
pnpm agent:passage:import:odyssey-1-1
pnpm agent:passage:import:iliad-1-1
```

Use `pnpm agent:passage:import -- --passage-id=<uuid> --file=path.json` for other passages.
JWT `sub` defaults to `LOGOS_FLUX_SUB` or `logos-cli-operator`.

## Draft review (Reading Desk)

The Reading Desk **AI Draft** bottom tab renders the latest `passage_draft` JSON for manual
review. Content is labeled **AI Draft — not canonical**. Copy actions are provided; no
promotion to translation or commentary tables occurs in the review slice.

## Promotion workflow

After review, operators may **selectively promote** items from a `passage_draft` into
canonical tables via the Reading Desk. Promoted rows land with `status: draft` on
translation layers (not auto-accepted). The source `ai_runs` row is marked `revised`.

Promotion is **idempotent**: re-promoting the same selections updates existing rows keyed
by `source_ai_run_id` rather than creating duplicates.

### Editorial lifecycle

```
agent output → ai_runs.passage_draft → promoted canonical draft → reviewed canonical content
```

| Stage | Where | Meaning |
|-------|-------|---------|
| AI draft | `ai_runs.output` | Generated artifact; not canonical |
| Promoted draft | canonical tables | Editorial copy, still unreviewed |
| Reviewed | canonical tables | Human accepted (`translation_layers.status = accepted`; other tables `review_status = reviewed`) |

**Accepted/reviewed** indicates editorial approval — not publication or finalization.

Promotable targets:

- `translation_layers` (literal, readable, philosophical)
- `translation_variants`
- `commentary_notes`
- `concept_mentions` (only when a matching `concept_threads` row exists)

Not promoted: `tokens`, `cross_references`, new concept thread creation.

### Provenance fields

AI-promoted canonical rows carry:

| Field | Purpose |
|-------|---------|
| `source_ai_run_id` | FK to originating `ai_runs` row — **immutable after insert** |
| `reviewed_at` | When a human marked the row reviewed |
| `reviewed_by` | Auth subject (`session.user.id`) of the reviewer |
| `reviewer_note` | Optional editorial note at review time |
| `review_status` | On non-layer tables: `draft` \| `reviewed` (may expand to `accepted` \| `rejected` in future migrations) |

**Provenance immutability:** `source_ai_run_id` is set at promotion and must never change.
Review actions and re-promotions may update review state and content, but may not reassign
provenance to another `ai_runs` row.

Re-promotion updates content fields only — it does **not** reset `accepted`/`reviewed`
status or clear `reviewed_at`/`reviewed_by`.

### Review actions

Authenticated operators may mark AI-promoted rows reviewed or return them to draft via
Reading Desk controls. See `lib/agents/review-promoted-content.ts`.

## What AI must not do

- Author the final readable layer without review
- Generate authenticity assessments presented as scholarly consensus
- Create concept thread descriptions without editorial oversight
- Silently replace token glosses without marking them as draft
