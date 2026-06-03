# Public reader contract

## Mode

Anonymous visitors browse **accepted / reviewed** site canonical content only. No login, no
editorial controls, no AI draft internals.

Route: `/read`, `/read/[authorSlug]/[workSlug]/[citationSlug]`. Legacy `/read/[passageId]` UUID URLs redirect to slug paths.

## Flux boundary (mandatory)

```txt
Public helpers must never call authenticated Flux helpers with a fake/public subject.
Public reader data must go through fluxAnon() only.
```

- Use `fluxAnon(path)` from `lib/flux/client.ts` with `mintFluxJwtAnon()` (`role: anon`).
- **Forbidden:** `fluxJson("public-reader", ...)` or any `fluxJson` call from public loaders.

Authenticated editorial and workspace code uses `fluxJson(sub, ...)` with `session.user.id`.

## Visibility

| Resource | Public rule |
|----------|-------------|
| `works`, `sections`, `passages`, `tokens` | All rows |
| `translation_layers` | `status = 'accepted'` |
| `translation_variants`, `commentary_notes`, `concept_mentions` | `review_status = 'reviewed'` |
| `concept_threads`, `authenticity_profiles`, `cross_references` | All rows (MVP seed) |
| `ai_runs` | Never |
| `workspace_*` | Never |

Helpers in `lib/public/*` apply PostgREST filters in addition to RLS (defense-in-depth).

## UI exclusions

No AI Draft tab, promotion, review controls, or server actions on public routes.

## Verification

After `flux push` of `0013_public_read_*`:

```bash
pnpm public:probe
```
