# Anti-drift contract

## Categories

1. **Architectural** — no ad-hoc services, no Flux fetch outside boundary
2. **Design** — no inline design systems on pages; follow `_contract/design.md`
3. **AI** — follow plans; no oversized files; no duplicate patterns

## File size limits

| Area | Max LOC |
|------|---------|
| `components/**/*.tsx` | 250 |
| `app/**/page.tsx`, `route.ts` | 300 |
| `lib/**/*.ts` | 400 |

## CI gates

Run on every PR:

1. `pnpm install`
2. `pnpm foundry:verify:template` — lint, typecheck, test, drift checks, build

## Vitest guards

- No raw `fetch` under `lib/` except `lib/flux/client.ts`
- Migrations contain RLS policies and grants

## Observability

Run `pnpm foundry:report` after structural changes.

`pnpm check:graph` enforces circular-import and dependency-cruiser rules.

## Dependencies

Follow `_contract/dependency-policy.md`.

## Workflow

Major work starts with a plan in `plans/`. Execute one slice at a time.

## No-shim principle

If Flux friction appears, fix upstream or document in a plan. Do not add hidden compatibility
shims to work around schema or JWT issues.
