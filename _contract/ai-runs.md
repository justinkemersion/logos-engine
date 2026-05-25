# AI runs contract

## Principle

AI output is draft material. It is never presented as final scholarly authority.

The Greek source remains the authority. AI assists the editorial process; it does not replace it.

## Run types

| Run type | Produces |
|----------|---------|
| `token_gloss` | Literal word-by-word gloss per token |
| `literal_translation` | Word-order-preserving literal translation of a passage |
| `readable_translation` | Fluent readable English rendering |
| `philosophical_note` | Draft philosophical commentary on a passage |
| `concept_linking` | Suggested concept thread connections |
| `authenticity_summary` | Draft summary of transmission signals |
| `cross_reference_scan` | Suggested cross-reference candidates |

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
4. The "Generate Draft Layer" button is disabled until the Flux AI workflow is built.
   The UI placeholder makes the intended flow visible without implying the feature is live.
5. AI run prompts and outputs are stored verbatim for auditability.
6. Model version is recorded in `ai_runs.model`.

## What AI must not do

- Author the final readable layer without review
- Generate authenticity assessments presented as scholarly consensus
- Create concept thread descriptions without editorial oversight
- Silently replace token glosses without marking them as draft
