# Translation contract

## Rules

1. **Preserve the Greek source.** The original text is never hidden, summarized, or replaced.
2. **Preserve the literal layer.** Token-by-token glosses must remain visible alongside any
   smoother rendering.
3. **Never silently flatten major terms.** When a Greek word carries philosophical weight,
   do not reduce it to a single English equivalent without noting the choice.
4. **Separate translation from commentary.** A translation layer renders text. A commentary
   note interprets it. These are different objects.
5. **Show alternate renderings when ambiguity matters.** Use `translation_variants` with a
   `tradeoff_note` that explains what is gained and what is lost.
6. **Use readable English only as a secondary layer.** The readable layer is labeled
   `readable`, sits in a tab, and never displaces the Greek or literal layer.
7. **All final renderings must trace back to tokens or notes.** No rendering appears without
   a `passage_id` link. Philosophical glosses without token anchors belong in commentary.
8. **Do not pretend certainty where the source is ambiguous.** Use `confidence` fields on
   variants. Acknowledge contested readings.

## Translation layer values

| Layer | Meaning |
|-------|---------|
| `raw_greek` | The source text exactly as stored |
| `token_gloss` | Machine-readable word-by-word glosses (per token, not a layer) |
| `literal` | Word-order-preserving English with minimal interpretation |
| `readable` | Fluent English — idiomatic but labeled as an interpretive layer |
| `philosophical` | A rendering that foregrounds conceptual content |

## Key concept terms that must not be silently flattened

| Greek | Notes |
|-------|-------|
| λόγος | speech, account, reason, word — context determines foreground, not default |
| ψυχή | soul, life-breath, animating principle — "soul" is not neutral |
| ἀρετή | excellence, virtue — both must remain visible |
| δικαιοσύνη | justice, right-ordering — neither alone captures the Greek |
| πολύτροπος | many-turned — resists any single English rendering; the compound is the point |
| μῆνις | rage, wrath — the Iliad's opening word; its weight is the whole poem |

## Variant confidence values

| Value | Meaning |
|-------|---------|
| `high` | Strong scholarly consensus or obvious etymological grounding |
| `medium` | Reasonable choice with meaningful alternatives |
| `contested` | Genuine interpretive disagreement in the tradition |

## Tradeoff note requirement

Every `translation_variants` row with `variant_type` of `literal`, `readable`, or
`philosophical` must include a `tradeoff_note` explaining:

- What the variant preserves from the Greek
- What it loses or obscures
- Why this choice was made over alternatives

## AI promotion provenance

When content is promoted from `ai_runs.passage_draft`, canonical rows receive:

| Field | Tables | Notes |
|-------|--------|-------|
| `source_ai_run_id` | layers, variants, commentary, concept mentions | Immutable after insert |
| `status` | `translation_layers` only | `draft` → `accepted` at review |
| `review_status` | variants, commentary, concept mentions | `draft` \| `reviewed` (minimal; may expand to `accepted` \| `rejected`) |
| `reviewed_at`, `reviewed_by`, `reviewer_note` | all promoted tables | Audit trail at review time |

**Provenance immutability:** once `source_ai_run_id` is set, it must never change.
Review and re-promotion may update content and review state but not reassign provenance.

**Accepted ≠ final:** `translation_layers.status = accepted` means editorial approval —
not publication or public-facing finalization.

Partial unique indexes (where `source_ai_run_id IS NOT NULL`) prevent duplicate promotion
from the same AI run. Seed/manual rows without provenance are unaffected.
