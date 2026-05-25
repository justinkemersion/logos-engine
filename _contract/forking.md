# Forking contract

## Purpose

Logos Engine can be forked to cover additional corpora, languages, or scholarly traditions
without corrupting the foundry discipline or the Logos reading model.

## Before forking

1. Run `pnpm foundry:doctor` on a clean clone.
2. Read `_contract/dependency-policy.md` and `docs/FIRST_FORK.md`.

## Required fork files

| File | Purpose |
|------|---------|
| `FOUNDRY_BASELINE.md` | Upstream commit, last sync, deviations |
| `_drift/dependency-exceptions.md` | Documented dependency pins only |

## Allowed changes in a fork

- Rename app in `package.json`, README, UI copy
- Add corpus tables in new numbered migrations (never edit applied migrations)
- Add routes under `app/(app)/`
- Add plans in `plans/` for domain work
- Add new concept threads, works, and passages via migrations

## Forbidden in a fork

- Removing `_contract/` or anti-drift CI
- Bypassing `lib/flux/client.ts` for HTTP
- Editing committed upstream migration files in place
- Replacing the layered translation model with a single-rendering approach
- Adding a chatbot-primary interface without a plan

## Syncing from upstream

Periodically merge from `flux-app-foundry` or `logos-engine`:

1. Resolve conflicts favoring upstream for contracts, `lib/flux/`, CI, scripts
2. Re-run `pnpm foundry:doctor` and `pnpm foundry:verify`
3. Update `FOUNDRY_BASELINE.md` last-synced date
