# Foundry Baseline

| Field | Value |
|-------|-------|
| Based on | `flux-app-foundry` |
| Baseline commit | See `flux-app-foundry` at time of fork |
| Last synced | 2026-05-24 |

## Blessed stack

- Next.js App Router + React + TypeScript (strict)
- Tailwind CSS v4
- Auth.js v5 + `jose`
- Flux via PostgREST (`lib/flux/` boundary)
- Vitest + ESLint + Prettier

## Local deviations

- Content tables use `using (true)` RLS (shared scholarly content, no `user_id` on content rows)
- No write server actions in MVP (read-only content layer)
- Three-column shell layout (LibraryNav + ReadingDesk + right panels)
- `components/reading/` and `components/concepts/` added alongside `components/shell/` and `components/ui/`
- `sql/migrations/` extended with text corpus schema (0001–0007)
