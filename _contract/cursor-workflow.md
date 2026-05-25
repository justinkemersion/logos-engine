# Cursor workflow contract

## Before coding

1. Read relevant `_contract/*.md` files
2. Read the active plan in `plans/` or `.cursor/plans/`
3. Use `prompts/*.md` templates when applicable

## During implementation

- Touch only files required by the current slice
- Keep files under anti-drift LOC limits
- Run `pnpm test` and `pnpm check:drift` before finishing a slice

## After implementation

- Check off plan items
- Do not introduce new architectural layers without updating `_contract/`
- Commit after each vertical slice with a clear message

## Rules

`.cursor/rules/*.mdc` mirror contracts; update `_contract/` first, then rules.

## No-shim principle

If platform friction appears, fix upstream or document in a plan. Do not add compatibility
shims.

## Vertical slices

Work proceeds in thin vertical slices. Each slice leaves the app runnable:

1. Contracts
2. Migrations + seed
3. Flux helpers + scaffold (app boots)
4. Landing + library shell
5. Reading desk
6. Fragments + concepts polish
