# Dependency policy

## Source of truth

Logos Engine forks `flux-app-foundry`. The blessed baseline is recorded in `FOUNDRY_BASELINE.md`.

## Fork rule

This app may pin versions temporarily but must document why in `_drift/dependency-exceptions.md`.

Each exception needs: package name, pinned version, reason, owner, and review date.

## Update cadence

- **Patch updates:** allowed anytime; run `pnpm foundry:verify` after.
- **Minor updates:** monthly maintenance pass.
- **Major updates:** only through a planned upgrade branch with its own plan file.

## Maintenance commands

| Command | Purpose |
|---------|---------|
| `pnpm deps:check` | List outdated packages |
| `pnpm deps:audit` | Security audit |
| `pnpm foundry:verify` | Lint, typecheck, build |

## Forbidden

- Random package additions without a plan entry.
- Installing overlapping UI libraries alongside `components/ui`.
- Upgrading framework majors inside feature work.
- Skipping `pnpm foundry:verify` after dependency changes.

## CI

Every PR: lint, typecheck, test, build via `pnpm foundry:verify:template`.
