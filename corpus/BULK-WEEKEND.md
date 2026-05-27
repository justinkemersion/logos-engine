# Bulk weekend plan — Corpus Garden

**Context:** Cursor usage discount window — bulk sync + generate while cheap.  
**Goal by Monday:** Odyssey + Iliad Book 1 in the garden; Republic Book I done; editorial voice emerging.

---

## Current state

| Work | Manifest | Greek synced | Generated |
| --- | --- | --- | --- |
| Republic Book I | 28 pages (327–354) | Perseus `perseus-grc2` | **28/28** |
| Odyssey Book I | 444 lines (1.1–1.444) | Perseus `perseus-grc2` | in progress |
| Iliad Book I | 611 lines (1.1–1.611) | Perseus `perseus-grc2` | pending |

---

## Commands

### Sync Greek (no agent)

```bash
pnpm corpus:sync:republic-book-1
pnpm corpus:sync:odyssey-book-1    # ~444 lines, ~5 min
pnpm corpus:sync:iliad-book-1      # ~611 lines, ~8 min
```

### Batch generate (resumable)

```bash
pnpm corpus:generate:odyssey-book-1-batch
pnpm corpus:generate:iliad-book-1-batch

# Retry failures from log
pnpm corpus:generate-batch -- --work-slug=odyssey --section=book-1 --failed-only
pnpm corpus:generate-batch -- --work-slug=iliad --section=book-1 --failed-only

# Partial range
pnpm corpus:generate-batch -- --work-slug=odyssey --section=book-1 --from=1.1 --to=1.50
```

Logs: `.local/corpus/generate-{work}-{section}.log`

### Status

```bash
pnpm corpus:status
pnpm corpus:status -- --work-slug=odyssey --section=book-1
```

---

## Execution order

1. Sync Odyssey + Iliad manifests (done when YAML has 444 + 611 rows)
2. `pnpm corpus:generate:odyssey-book-1-batch` (~6–12 hr)
3. `pnpm corpus:generate:iliad-book-1-batch` (~8–15 hr)
4. `--failed-only` retry pass
5. Spot-review Republic + Homer openings

---

## Review checklist

| Priority | Files |
| --- | --- |
| Republic voice | `garden/plato/republic/book-1/001–005, 010, 028` |
| Odyssey opening | `garden/homer/odyssey/book-1/001–020` |
| Iliad opening | `garden/homer/iliad/book-1/001–020` |

Ask: *Does this feel like philosophy?*

---

## Segmentation note

- **Epic:** one Scaife line per manifest row (natural for Homer)
- **Republic:** one Stephanus page per row (merge into argumentative movements later)

See [`SEGMENTATION.md`](SEGMENTATION.md).

---

## Not this weekend

- Flux import
- Republic Books II–X
- Movement-level manifest merges (post-discount)
