# Flux integration contract

Platform setup order and gateway bridge rules: **`_contract/flux-workflow.md`**. Operator guide: **`docs/LOGOS_WORKFLOW.md`**.

## HTTP boundary

All Flux / PostgREST HTTP must go through `lib/flux/client.ts`:

- `fluxJson(sub, path, init)` — authenticated editorial and workspace reads/writes
- `fluxAnon(path, init)` — public reader only (`role: anon`)

Do not call `fetch()` against `FLUX_URL` anywhere else (enforced by Vitest).

## JWT

- Mint per request via `mintFluxJwt(sub)` in `lib/flux/jwt.ts`.
- `sub` must equal `session.user.id`.
- Content tables have no `user_id` column — RLS uses `using (true)` for `authenticated` role.
- Do not store Flux JWTs in the browser session.

## Environment

| Variable | Purpose |
|----------|---------|
| `FLUX_URL` | PostgREST base URL |
| `FLUX_GATEWAY_JWT_SECRET` | HS256 signing secret |
| `FLUX_POSTGREST_SCHEMA` | `Accept-Profile` / `Content-Profile` — set via `pnpm flux:schema:sync`; lives in `.env.local` only |
| `FLUX_TLS_INSECURE` | Dev-only; `1` disables TLS verify |

## Resource helpers

Domain read helpers live in `lib/flux/<resource>.ts` and call `fluxJson` only.

Logos Engine content is read-only from the application layer except **`ai_runs` INSERT**
for draft AI pipeline output. Seeding happens via `sql/migrations/0007_seed_mvp_texts.sql`.
No writes to `tokens`, `translation_layers`, `commentary_notes`, or `cross_references` until
explicit editorial promotion.

## Errors

Catch `FluxHttpError` in page loaders; degrade gracefully (show empty state, not a crash).

## Migrations

Schema changes are SQL files under `sql/migrations/` and pushed with Flux CLI (`flux push`).
