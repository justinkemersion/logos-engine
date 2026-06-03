# Product contract

## Purpose

Logos Engine is a trust-aware semantic reading environment for ancient Greek texts. It begins
with Plato and Homer, but is designed as a broader tool for reading from the original Greek
outward — not from English inward.

## Primary reader

A serious reader who wants to engage with the Greek world on its own terms: scholars,
students, and educated generalists who know that translations are interpretations.

## Product modes

| Mode | Route | Audience |
|------|-------|----------|
| Public Reader | `/read/**` | Anonymous; accepted/reviewed canonical content only |
| Personal Workspace | `/workspace/**` | Logged-in; private overlays on shared passages |
| Site Editorial | `/passages/[id]`, `/works/**`, promotion/review | Maintains public canonical content |

## Production route policy

At launch, three modes stay separated in routes, Flux helpers, RLS, and SEO:

| Mode | Routes | Auth | Flux | Discoverability |
|------|--------|------|------|-----------------|
| Public reader | `/`, `/read/**` | Anonymous OK | `fluxAnon()` only | Indexable; canonical slug URLs |
| Workspace | `/workspace/**` | Authenticated | `fluxJson(sub)` on `workspace_*` | `noindex` |
| Editorial | `/passages/**`, `/works/**` | Authenticated editors | Full reads + promotion/review | `noindex` |

Launch auth is GitHub-only. Production logs must never emit AI prompt payloads, JWT secrets,
or workspace-private content. Deploy procedure: `_contract/deployment.md`.

A user workspace is **not** a physical clone of the corpus. It is a private interpretive layer
referencing shared `passage_id` rows.

## Non-goals

- Not a chatbot interface for "explain Plato to me"
- Not a flash-card or gamified learning tool
- Not a full-text searchable corpus dump
- Not an AI that authors scholarly content
- Not a Plato quote aggregator

## MVP scope

Three passages proving the full reading pipeline:

1. Homer, Odyssey 1.1 — `ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον`
2. Homer, Iliad 1.1 — `Μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος`
3. Plato, Republic 327a — `Κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος τοῦ Ἀρίστωνος`

These are enough to prove: source text storage, tokenization, layered translation,
commentary, concept links, authenticity signals, and a working reading desk.

## Terminology

| Term | Definition |
|------|-----------|
| Work | A canonical text: Odyssey, Republic, Iliad |
| Section | A subdivision of a work: Book I, Book 1 |
| Passage | A citable unit of text with a stable reference (327a, 1.1) |
| Token | A single Greek word in a passage, with morphological data |
| Lemma | The dictionary headword a token reduces to |
| Translation Layer | One complete rendering of a passage (raw_greek / literal / readable / philosophical) |
| Variant | An alternative rendering of a token or phrase, with rationale |
| Commentary Note | A discrete scholarly note attached to a passage |
| Concept Thread | A semantic concept that persists across works (λόγος, μῆνις, ψυχή) |
| Authenticity Signal | A piece of evidence bearing on authorship or transmission |
| AI Run | A draft output from an AI model, pending review |
| Cross Reference | A typed relationship between two passages |
| Source Edition | A named edition or manuscript tradition (Oxford Classical Texts, Loeb, etc.) |
| Fragment | A short, potent passage offered as a standalone thought card |

## Core reading model

The Greek source is the authority. Every layer of translation, every commentary note, and
every AI-generated draft is subordinate to it.

Reading moves from the Greek outward:

```
Greek token
  → literal gloss (word-by-word)
  → translation layer (phrase-level choices)
  → variant (alternative renderings with tradeoff notes)
  → commentary (lexical, grammatical, philosophical, historical)
  → concept thread (semantic trail across works)
  → cross reference (typed relationship to another passage)
```

The readable English layer is assistance, not authority.

## Principle

> Logos Engine treats AI output as draft material until reviewed. The Greek source remains
> the authority.
