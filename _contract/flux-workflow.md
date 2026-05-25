# Flux workflow contract

Logos Engine follows Foundry flux workflow exactly. Verify control-plane, gateway, schema,
and JWT bridge before product work or new SQL migrations.

## Setup order (non-negotiable)

1. `flux login` — control-plane API token (`~/.flux/config.json`)
2. `flux init` or link — creates/links project; writes real `hash` to `flux.json`
3. Fill `.env`: `FLUX_URL`, `FLUX_GATEWAY_JWT_SECRET` (from `flux project credentials`)
4. `flux push` on each file under `sql/migrations/` in order
5. `pnpm flux:schema:sync` — writes `FLUX_POSTGREST_SCHEMA` to `.env.local`
6. `pnpm flux:doctor` — platform + gateway probes
7. `pnpm foundry:doctor` — full app preflight

## Environment rules

| Variable | Where | Rule |
|----------|-------|------|
| `FLUX_URL` | `.env` | Canonical API host from `flux list` |
| `FLUX_GATEWAY_JWT_SECRET` | `.env` | Per-project secret (`flux project credentials`) |
| `FLUX_POSTGREST_SCHEMA` | `.env.local` only | From `pnpm flux:schema:sync`; never empty in `.env` |

Empty `FLUX_POSTGREST_SCHEMA=` in `.env` blocks `.env.local` in some loaders — omit the key
from `.env` entirely.

## v2_shared JWT bridge invariant

Apps mint HS256 JWTs with **`role: authenticated`** and stable **`sub`** (OAuth account id).
Do not mint `t_*_role` directly.

```
App (lib/flux/jwt.ts)     Gateway                    PostgREST (pooled)
─────────────────────     ───────                    ───────────────────
role: authenticated  →    verify project secret  →   role: t_<12hex>_role
sub: <user id>            mintBridgedTenantJwt()       sub: <user id>
                          Accept-Profile: t_<12hex>_api
```

## Doctor commands

- `pnpm flux:doctor` — Flux-only gates
- `pnpm foundry:doctor` — app + env + Flux checks when `FLUX_URL` is set

## Failure modes

| Symptom | Likely cause |
|---------|-------------|
| 403 permission denied for schema | Gateway bridge not deployed, or grants not pushed |
| Empty results 200 but auth 403 | Same bridge issue |
| `flux.json hash format` fail | Placeholder hash — use `flux list` hash |

## Related contracts

- `_contract/flux.md` — app HTTP boundary
- `docs/LOGOS_WORKFLOW.md` — operator guide
