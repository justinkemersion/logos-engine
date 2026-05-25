# Forking Logos Engine

Use this guide to fork Logos Engine into a new corpus, language, or scholarly tradition
without corrupting the foundry discipline or the Logos reading model.

## Before you fork

1. Clone this repo and run `pnpm install`
2. Run `pnpm foundry:doctor` on a clean checkout
3. Read `_contract/forking.md` and `_contract/product.md`

## What to change

### 1. Identity

- `package.json` — rename the app
- `README.md` — describe the new corpus
- `app/layout.tsx` — update `metadata.title` and `metadata.description`
- `app/page.tsx` — update hero copy and CTAs
- `flux.json` — update `slug`; run `flux init` for a new project hash
- `FOUNDRY_BASELINE.md` — fill in baseline commit and last synced date

### 2. Corpus data

Add new works, sections, passages, tokens, and translation layers in a new
numbered migration starting at `0008_`:

```bash
# Example
sql/migrations/0008_add_sophocles.sql
sql/migrations/0009_sophocles_grants.sql
sql/migrations/0010_seed_sophocles.sql
```

Never edit the original `0001`–`0007` migrations after they have been pushed.

### 3. Library nav

Update `components/shell/LibraryNav.tsx` to add new authors and works to the tree.

### 4. Concept threads

Add new concept threads and mentions to the seed migration. The `ConceptTrail`
component in `components/concepts/ConceptTrail.tsx` renders the description field
as a semantic trail — just write good descriptions.

## What to keep

- All `_contract/` files (update, never delete)
- `lib/flux/` boundary (never bypass)
- Migration DDL + RLS pattern (select for authenticated using (true))
- Foundry CI (`.github/workflows/`) or equivalent
- Anti-drift scripts in `scripts/`

## What is forbidden

- Replacing the layered translation model with a single-rendering approach
- Adding a chatbot-primary interface without a plan
- Removing the literal layer from the reading desk
- Hardcoding schema names in SQL
- Bypassing `lib/flux/client.ts` for HTTP

## After forking

```bash
pnpm foundry:new-app-check    # verifies fork readiness
pnpm flux:doctor              # verifies Flux setup
pnpm foundry:verify           # full verification pass
```

## Syncing from upstream

To pull improvements from `logos-engine`:

```bash
git remote add logos-upstream https://github.com/your-org/logos-engine
git fetch logos-upstream
git merge logos-upstream/main --no-commit

# Resolve conflicts, favoring upstream for:
# - _contract/
# - lib/flux/
# - scripts/
# - .cursor/rules/
# - sql/migrations/0001–0007 (never overwrite if pushed)

# Update FOUNDRY_BASELINE.md with new last-synced date
pnpm foundry:doctor
pnpm foundry:verify
git commit -m "chore: sync from logos-engine upstream"
```
