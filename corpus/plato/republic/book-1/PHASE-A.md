# Republic Book I — Phase A (327a–331d)

**Status:** Greek synced from Perseus (`perseus-grc2`) — 28 Stephanus pages in `manifest.yaml`  
**Goal:** establish editorial voice; optionally merge pages into argumentative movements later.

Phase A is calmer, more literary, less conceptually dense than Phase B (Polemarchus /
Simonides) and Phase C (Thrasymachus, 336b–354c).

## Segmentation policy

Passages = **argumentative movements**. See [`../../../SEGMENTATION.md`](../../../SEGMENTATION.md).

Greek source: **Perseus Scaife** `tlg0059.tlg030.perseus-grc2` (see manifest header). Re-sync:

```bash
pnpm corpus:sync:republic-book-1
```

## Proposed movements (curate Greek, then add to `manifest.yaml`)

| Seq | Citation anchor | Movement type | Description |
| --- | --- | --- | --- |
| 1 | `327a` | Opening movement | Descent to Piraeus — *in manifest* |
| 2 | `327b` | Opening movement | Yesterday’s festival; staying for Polemarchus |
| 3 | `327c`–`328` | Dramatic exchange | Servants, the horse, invitation to the house |
| 4 | `328a`–`328e` | Dramatic exchange | Arrival; welcome; seating with Cephalus |
| 5 | `329a`–`329d` | Character speech | Cephalus on old age and complaints of the elderly |
| 6 | `330a`–`330d` | Character speech | Wealth, sacrifice, fear of the afterlife |
| 7 | `331a`–`331d` | Conceptual exchange | Living well and justice; handoff toward definition |

**Target:** ~7–10 movements for Phase A (adjust after first render — merge or split if a file
feels too thin or too heavy).

## Curation checklist

- [ ] Pick one Greek base text for all of Book I
- [ ] Add rows to `manifest.yaml` with `citation`, `sequence`, `greek`
- [ ] Generate: `pnpm corpus:generate -- --work-slug=republic --section=book-1`
- [ ] Read garden files: pacing, commentary density, voice
- [ ] Edit markdown by hand where needed; do not edit JSON drafts
- [ ] Phase B only after Phase A voice feels right

## Commands

```bash
# After manifest rows exist
pnpm corpus:generate -- --work-slug=republic --section=book-1

# Re-render markdown only (no API)
pnpm corpus:render -- --work-slug=republic --section=book-1
```

## Phase B / C (later)

| Phase | Stephanus | Focus |
| --- | --- | --- |
| B | 331e–336a | Polemarchus, Simonides on justice |
| C | 336b–354c | Thrasymachus — subdivide into many movements |
