# Architecture contract

## Layers

1. **app/** — routes, layouts, server actions (feature-colocated under route groups)
2. **components/** — UI and shell; may use `lib/ui` helpers only
3. **lib/** — shared server utilities; **lib/flux/** is the only Flux HTTP surface
4. **sql/migrations/** — schema source of truth

## Import directions

- `components/**` → `components/ui`, `lib/ui` (presentation helpers only)
- `app/**` → `components/**`, `lib/**`, `auth.ts`
- `lib/flux/**` → may use `jose`, `undici`; must not import React or `components/`
- **Forbidden:** `components/**` → `lib/flux`, `auth.ts`, `sql/`
- **Forbidden:** `"use client"` files → server-only modules

## Server vs client

- Flux calls and JWT minting are **server-only** (RSC loaders, server actions, scripts).
- Client components receive serializable props.
- The reading desk is `"use client"` for tab and token selection state.
- Mutations are not needed in MVP (read-only content).

## Feature layout

```
app/(app)/<feature>/
  page.tsx
```

No random `services/` or `repositories/` folders.

## Reading desk data flow

```
passages/[id]/page.tsx (RSC)
  → auth() → requireSessionSub()
  → lib/flux/passages.ts  → getPassage(id)
  → lib/flux/tokens.ts    → listTokensForPassage(id)
  → lib/flux/translations.ts → listTranslationLayers(id) + listTranslationVariants(id)
  → lib/flux/commentary.ts   → listCommentaryNotes(id) + listConceptMentions(id)
  → lib/flux/works.ts        → getAuthenticity(workId)
  → lib/flux/cross-references.ts → listCrossReferences(id)
  → <ReadingDesk> (client) receives all data as serializable props
```
