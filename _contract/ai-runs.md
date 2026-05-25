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

## What AI must not do

- Author the final readable layer without review
- Generate authenticity assessments presented as scholarly consensus
- Create concept thread descriptions without editorial oversight
- Silently replace token glosses without marking them as draft
