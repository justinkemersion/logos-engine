# Component rules

## Location

- `components/ui/` — primitives (Button, Input, Card, Badge, …)
- `components/shell/` — AppShell, LibraryNav, TopBar
- `components/reading/` — ReadingDesk, TokenInspector, AuthenticityCard, right-panel cards
- `components/concepts/` — ConceptTrail, concept card primitives
- `components/providers.tsx` — client providers only

## Client boundary

Files with `"use client"` must not import `lib/flux`, `auth`, or SQL.

## Props

Prefer explicit typed props. Avoid `any`.

## Composition

Pages compose shell + ui primitives. No 200-line page-specific styled div trees.

## Naming

PascalCase components, one default export per file.

## Size

Max 250 LOC per `.tsx` in `components/`. Split when larger.

## Reading desk components

The reading desk is split across multiple focused components:

- `ReadingDesk.tsx` — orchestrator (client); tab state + selected token state
- `TokenRow.tsx` — renders one token (Greek + gloss)
- `TokenInspector.tsx` — inline inspector shown when token selected
- `TranslationPane.tsx` — renders a translation layer by type
- `CommentaryPane.tsx` — renders commentary notes
- `CrossReferencesPanel.tsx` — right-panel cross references
- `AuthenticityCard.tsx` — right-panel authenticity + signals
- `RelatedConcepts.tsx` — right-panel concept chips
