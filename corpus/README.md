# Corpus Garden

A local filesystem corpus for Logos — transparent, diffable, and calm.

The garden sits **between** the passage agent (JSON) and Flux (database). It is for
generation, curation, and inspection — not publication.

## Philosophy

| Layer | Role |
| --- | --- |
| [`defaults.yaml`](defaults.yaml) (committed) | Global provenance defaults |
| `corpus/{author}/{work}/{section}/manifest.yaml` | Greek source per section |
| `.local/corpus/drafts/` (gitignored) | Immutable JSON generated artifacts |
| `.local/corpus/garden/` (gitignored) | Editorial markdown reading surface |
| `.local/corpus/exports/` (gitignored) | Reserved for future publish bundles |

Generation → curation → storage → publication stay separate. Flux is not involved in the
garden phase.

## Layout

Manifests are split by author, work, and section so files stay small as the corpus grows:

```txt
corpus/
  defaults.yaml                         # prompt_version, agent_profile, etc.
  homer/
    odyssey/
      book-1/manifest.yaml              # Odyssey Book 1 passages
      book-2/manifest.yaml              # (add when curated)
    iliad/
      book-1/manifest.yaml
  plato/
    republic/
      book-1/manifest.yaml
    apology/
      manifest.yaml                     # full work, no book subdir
    symposium/
      selected/manifest.yaml
    timaeus/
      fragments/manifest.yaml

.local/corpus/
  drafts/homer/odyssey/1-1.json
  garden/homer/odyssey/book-1/001.md
  exports/
```

**Convention:** place `manifest.yaml` at the leaf section directory. The loader discovers
all `corpus/**/manifest.yaml` files automatically (except `defaults.yaml`).

### Section manifest format

Each section file declares author/work metadata once, then lists passages:

```yaml
author: Homer
author_slug: homer
work: Odyssey
work_slug: odyssey
section_slug: book-1
section_title: Book 1
book: 1

passages:
  - citation: "1.1"
    sequence: 1
    greek: "ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον"
  - citation: "1.2"
    sequence: 2
    greek: "..."
```

- `sequence` → garden filename (`001.md`, `002.md`, …)
- `citation` → frontmatter and CLI selector
- Per-passage `agent_profile` / `generation_profile` overrides are optional

Markdown files use zero-padded sequence filenames. Citations live in frontmatter.

## JSON immutability

```txt
Do not manually edit .local/corpus/drafts/*.json.
Treat JSON drafts as immutable generated artifacts.
Editorial changes belong in markdown notes or future review workflows.
Regenerate with --force when source Greek or prompts change.
```

The markdown garden may evolve manually. JSON remains the structured substrate for future import.

## Provenance

Global defaults in [`defaults.yaml`](defaults.yaml). Each garden file also records:

| Field | Purpose |
| --- | --- |
| `agent_profile` | Which editorial machine produced the draft |
| `generation_profile` | Editorial profile (standard, literalist, etc.) |
| `prompt_version` | Prompt template version |
| `generated_by_model` | Model used at generation time |
| `generated_at` | Render date (ISO) |
| `source_hash` | `sha256(author + work + citation + greek)` — detects manifest drift |
| `status` | Typically `draft` |

If you edit Greek in a section manifest, `source_hash` changes. Re-render warns on drift;
regenerate with `--force` only after intentional edits.

## Workflow

### One passage

```bash
pnpm corpus:generate -- --work-slug=odyssey --citation=1.1
pnpm corpus:render -- --work-slug=odyssey --citation=1.1
```

### All passages in a section (e.g. Odyssey Book 1)

After adding entries to `corpus/homer/odyssey/book-1/manifest.yaml`:

```bash
pnpm corpus:generate -- --work-slug=odyssey --section=book-1
pnpm corpus:render -- --work-slug=odyssey --section=book-1
```

### Everything in the corpus

```bash
pnpm corpus:generate -- --all
pnpm corpus:render -- --all
```

### Filtered batch

Combine `--all` with filters:

```bash
pnpm corpus:generate -- --all --author-slug=homer
pnpm corpus:generate -- --all --work-slug=odyssey --section=book-1
```

`--all` means “all matching entries across discovered section manifests,” not “every line
of a book.” Expand a book by adding rows to that section’s `manifest.yaml`.

### Regenerate

```bash
pnpm corpus:generate -- --work-slug=odyssey --citation=1.1 --force
```

Requires `CURSOR_API_KEY` for generate (not render).

## Segmentation doctrine

Passages are **argumentative movements** — coherent dramatic or conceptual units that read
like intellectual fragments, not database shards.

Full policy: [`SEGMENTATION.md`](SEGMENTATION.md).

Republic Book I Phase A plan: [`plato/republic/book-1/PHASE-A.md`](plato/republic/book-1/PHASE-A.md).

## Expanding the corpus

1. Create or edit `corpus/{author}/{work}/{section}/manifest.yaml`.
2. Add passage rows with curated Greek text.
3. Run `corpus:generate` for the section or passage.
4. Edit garden markdown by hand if needed.
5. Do **not** import to Flux yet.

**Default:** manual curation improves passage quality and helps discover good passage units.

**Republic Book I exception:** Greek can be synced from [Perseus Scaife](https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0059.tlg030.perseus-grc2:0) into the manifest for review before generation:

```bash
pnpm corpus:sync:republic-book-1
```

Synced text is draft inventory until you approve it; refine page units into argumentative movements per [`SEGMENTATION.md`](SEGMENTATION.md) when ready.

### Scope targets

| Author | Work | Section path |
| --- | --- | --- |
| Homer | Odyssey | `homer/odyssey/book-1/` (expand to book-2, …) |
| Homer | Iliad | `homer/iliad/book-1/` |
| Plato | Republic | `plato/republic/book-1/` |
| Plato | Apology | `plato/apology/` |
| Plato | Symposium | `plato/symposium/selected/` |
| Plato | Timaeus | `plato/timaeus/fragments/` |

## What the markdown omits

Primary garden files intentionally exclude: philosophical layer, tokens, concepts,
cross-references, authenticity notes. Those remain in JSON for future import.

## Future import (not implemented)

```txt
.local/corpus/garden/**/*.md
  → parse frontmatter + sections
  → LogosPassageDraft
  → existing import-passage-draft pipeline → ai_runs → Flux
```

Eventually, selected curated markdown may be committed as publishable corpus editions.
